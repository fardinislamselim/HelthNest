/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import ejs from "ejs";
import httpStatus from "http-status";
import { UploadApiResponse } from "cloudinary";
import { SignOptions } from "jsonwebtoken";

import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { redisClient } from "@/lib/redis";
import { transporter } from "@/lib/nodemailer";
import { logger } from "@/lib/winston";
import config from "@/config";
import AppError from "@/middleware/AppError";
import { jwtUtils } from "@/utils/jwt";
import {
  Role,
  DoctorVerificationStatus,
  UserStatus,
} from "../../../../generated/prisma/enums";
import {
  TApplyAsDoctor,
  TVerifyDoctorEmail,
  TGetApplicationStatusQuery,
  TRejectDoctorApplication,
} from "./doctor.interface";

const getTemplatePath = (templateName: string) => {
  const possiblePaths = [
    path.join(process.cwd(), "src/templates", templateName),
    path.join(process.cwd(), "server/src/templates", templateName),
    path.join(__dirname, "../../../templates", templateName),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return possiblePaths[0];
};

// Apply as Doctor Service
const applyAsDoctor = async (
  payload: TApplyAsDoctor,
  resume: Express.Multer.File | null,
  additionalFiles: Express.Multer.File[],
) => {
  const email = payload.email.trim().toLowerCase();
  const licenseNumber = payload.licenseNumber.trim();

  const isUserExists = await prisma.user.findUnique({
    where: { email },
    include: { doctor: true },
  });

  if (isUserExists?.doctor) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A doctor application already exists for this email",
    );
  }

  const isLicenseExists = await prisma.doctor.findUnique({
    where: { licenseNumber },
  });

  if (isLicenseExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A doctor with this license number already exists",
    );
  }

  let resumeResult: UploadApiResponse | null = null;
  if (resume?.buffer) {
    resumeResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result!);
          },
        )
        .end(resume.buffer);
    });
  }

  let additionalFilesResult: UploadApiResponse[] = [];
  if (additionalFiles && additionalFiles.length > 0) {
    additionalFilesResult = await Promise.all(
      additionalFiles
        .filter((file) => file.buffer)
        .map((file) => {
          return new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  resource_type: "auto",
                },
                (error, result) => {
                  if (error) {
                    return reject(error);
                  }
                  resolve(result!);
                },
              )
              .end(file.buffer);
          });
        }),
    );
  }

  let hashedPassword: string | undefined = undefined;
  if (payload.password) {
    hashedPassword = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_rounds) || 12,
    );
  }

  const doctorData = {
    name: payload.name,
    email,
    address: payload.address,
    specialization: payload.specialization,
    licenseNumber,
    qualifications: payload.qualifications,
    experienceYears: Number(payload.experienceYears),
    bio: payload.bio,
    consultationFee:
      payload.consultationFee !== undefined && payload.consultationFee !== null
        ? payload.consultationFee
        : undefined,
    contactNumber: payload.contactNumber,
    resume: resumeResult?.secure_url,
    resumePublicId: resumeResult?.public_id,
    additionalFiles: additionalFilesResult.map((file) => ({
      url: file.secure_url,
      publicId: file.public_id,
    })),
  };

  const doctorApplication = await prisma.$transaction(async (tx) => {
    if (isUserExists) {
      return tx.user.update({
        where: { id: isUserExists.id },
        data: {
          name: payload.name,
          role: Role.DOCTOR,
          emailVerified: false,
          ...(hashedPassword ? { password: hashedPassword } : {}),
          doctor: { create: doctorData },
        },
        include: { doctor: true },
        omit: { password: true },
      });
    }

    return tx.user.create({
      data: {
        name: payload.name,
        email,
        role: Role.DOCTOR,
        emailVerified: false,
        ...(hashedPassword ? { password: hashedPassword } : {}),
        doctor: { create: doctorData },
      },
      include: { doctor: true },
      omit: { password: true },
    });
  });

  const otp = crypto.randomInt(100000, 1000000).toString();
  const key = `doctor-email-verification:${email}`;
  await redisClient.set(key, otp, {
    expiration: { type: "EX", value: 5 * 60 },
  });

  if (config.node_env === "development" || config.node_env === "devlopment") {
    console.log(`[dev] Doctor email verification OTP for ${email}: ${otp}`);
  }

  const templatePath = getTemplatePath("doctor-email-verification.ejs");
  try {
    const html = await ejs.renderFile(templatePath, {
      name: payload.name,
      otp,
      expiresIn: "5 minutes",
    });

    await transporter.sendMail({
      from: config.email_sender,
      to: email,
      subject: "Verify your doctor application email",
      html,
    });
  } catch (error) {
    logger.error("Failed to send doctor verification email:", error);
  }

  return doctorApplication;
};

// Verify Doctor Email Service
const verifyDoctorEmail = async (payload: TVerifyDoctorEmail) => {
  const email = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email },
    include: { doctor: true },
  });

  if (!user || !user.doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor application not found");
  }

  if (user.emailVerified) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Doctor application email is already verified",
    );
  }

  const key = `doctor-email-verification:${email}`;
  const storedOtp = await redisClient.get(key);
  if (!storedOtp) {
    throw new AppError(httpStatus.NOT_FOUND, "OTP is expired");
  }
  if (storedOtp !== payload.otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
    include: { doctor: true },
    omit: { password: true },
  });

  await redisClient.del(key);

  const jwtPayload = {
    userId: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      emailVerified: updatedUser.emailVerified,
    },
    doctor: updatedUser.doctor,
  };
};

// Resend Doctor Application OTP Service
const resendDoctorOtp = async (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { doctor: true },
  });

  if (!user || !user.doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor application not found");
  }

  if (user.emailVerified) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Doctor application email is already verified",
    );
  }

  const otp = crypto.randomInt(100000, 1000000).toString();
  const expirationSeconds = 5 * 60;
  const key = `doctor-email-verification:${normalizedEmail}`;

  await redisClient.set(key, otp, {
    expiration: { type: "EX", value: expirationSeconds },
  });

  if (config.node_env === "development" || config.node_env === "devlopment") {
    console.log(
      `[dev] Doctor email verification OTP for ${normalizedEmail}: ${otp}`,
    );
  }

  const templatePath = getTemplatePath("doctor-email-verification.ejs");
  try {
    const html = await ejs.renderFile(templatePath, {
      name: user.name,
      otp,
      expiresIn: "5 minutes",
    });

    await transporter.sendMail({
      from: config.email_sender,
      to: normalizedEmail,
      subject: "Verify your doctor application email",
      html,
    });
  } catch (error) {
    logger.error("Failed to resend doctor verification email:", error);
  }
};

// Check Doctor Application Status Service
const getApplicationStatus = async (query: TGetApplicationStatusQuery) => {
  let user = null;

  if (query.userId) {
    user = await prisma.user.findUnique({
      where: { id: query.userId },
      include: { doctor: true },
    });
  } else if (query.email) {
    user = await prisma.user.findUnique({
      where: { email: query.email.trim().toLowerCase() },
      include: { doctor: true },
    });
  }

  if (!user || !user.doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor application not found");
  }

  const doctor = user.doctor;
  const isEmailVerified = user.emailVerified;

  let status: string;
  let statusDescription: string;

  if (!isEmailVerified) {
    status = "UNVERIFIED";
    statusDescription =
      "Email verification pending. Doctor applications must be verified before entering the pending approval process.";
  } else if (doctor.verificationStatus === DoctorVerificationStatus.PENDING) {
    status = "PENDING";
    statusDescription =
      "Your application has been verified and has entered the pending approval process.";
  } else if (doctor.verificationStatus === DoctorVerificationStatus.APPROVED) {
    status = "APPROVED";
    statusDescription =
      "Your doctor application has been approved. You can now log in to your account.";
  } else {
    status = "REJECTED";
    statusDescription = `Your doctor application has been rejected.${doctor.rejectionReason ? ` Reason: ${doctor.rejectionReason}` : ""}`;
  }

  return {
    status,
    isEmailVerified,
    verificationStatus: doctor.verificationStatus,
    statusDescription,
    rejectionReason: doctor.rejectionReason,
    reviewedAt: doctor.reviewedAt,
    appliedAt: doctor.createdAt,
    doctor: {
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      address: doctor.address,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      qualifications: doctor.qualifications,
      experienceYears: doctor.experienceYears,
      bio: doctor.bio,
      consultationFee: doctor.consultationFee,
      contactNumber: doctor.contactNumber,
      resume: doctor.resume,
      additionalFiles: doctor.additionalFiles,
    },
  };
};

const doctorSelection = {
  id: true,
  name: true,
  email: true,
  address: true,
  specialization: true,
  licenseNumber: true,
  qualifications: true,
  experienceYears: true,
  bio: true,
  consultationFee: true,
  contactNumber: true,
  verificationStatus: true,
  rejectionReason: true,
  reviewedBy: true,
  reviewedAt: true,
  resume: true,
  additionalFiles: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      emailVerified: true,
      status: true,
      role: true,
    },
  },
} as const;

const getAllDoctors = async () =>
  prisma.doctor.findMany({
    where: { isDeleted: false },
    select: doctorSelection,
    orderBy: { createdAt: "desc" },
  });

const getPendingDoctors = async () =>
  prisma.doctor.findMany({
    where: {
      isDeleted: false,
      verificationStatus: DoctorVerificationStatus.PENDING,
      user: { emailVerified: true },
    },
    select: doctorSelection,
    orderBy: { createdAt: "asc" },
  });

const getDoctorById = async (doctorId: string) => {
  const doctor = await prisma.doctor.findFirst({
    where: { id: doctorId, isDeleted: false },
    select: doctorSelection,
  });

  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  return doctor;
};

const sendDoctorWelcomeEmail = async (doctor: { name: string; email: string }) => {
  const templatePath = getTemplatePath("doctor-welcome.ejs");
  const html = await ejs.renderFile(templatePath, { name: doctor.name });

  await transporter.sendMail({
    from: config.email_sender,
    to: doctor.email,
    subject: "Welcome to HealthNest - Your doctor application is approved",
    html,
  });
};

const approveDoctor = async (doctorId: string, reviewerId: string) => {
  const doctor = await prisma.$transaction(async (tx) => {
    const existingDoctor = await tx.doctor.findFirst({
      where: { id: doctorId, isDeleted: false },
      include: { user: true },
    });

    if (!existingDoctor) {
      throw new AppError(httpStatus.NOT_FOUND, "Doctor not found");
    }

    if (existingDoctor.verificationStatus === DoctorVerificationStatus.APPROVED) {
      throw new AppError(httpStatus.BAD_REQUEST, "Doctor is already approved");
    }
    if (!existingDoctor.user.emailVerified) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Doctor email must be verified before approval",
      );
    }

    return tx.doctor.update({
      where: { id: doctorId },
      data: {
        verificationStatus: DoctorVerificationStatus.APPROVED,
        rejectionReason: null,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        user: { update: { status: "ACTIVE" } },
      },
      select: doctorSelection,
    });
  });

  try {
    await sendDoctorWelcomeEmail(doctor);
  } catch (error) {
    logger.error("Doctor approved but welcome email could not be sent:", error);
  }

  return doctor;
};

const rejectDoctor = async (
  doctorId: string,
  reviewerId: string,
  payload: TRejectDoctorApplication,
) => {
  const existingDoctor = await prisma.doctor.findFirst({
    where: { id: doctorId, isDeleted: false },
  });

  if (!existingDoctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor not found");
  }
  if (existingDoctor.verificationStatus === DoctorVerificationStatus.APPROVED) {
    throw new AppError(httpStatus.BAD_REQUEST, "An approved doctor cannot be rejected");
  }

  return prisma.doctor.update({
    where: { id: doctorId },
    data: {
      verificationStatus: DoctorVerificationStatus.REJECTED,
      rejectionReason: payload.rejectionReason ?? null,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
    },
    select: doctorSelection,
  });
};

const setDoctorBlocked = async (doctorId: string, status: UserStatus) => {
  const doctor = await prisma.doctor.findFirst({
    where: { id: doctorId, isDeleted: false },
    select: { userId: true },
  });

  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  await prisma.user.update({
    where: { id: doctor.userId },
    data: { status },
  });

  return getDoctorById(doctorId);
};

export const doctorService = {
  applyAsDoctor,
  verifyDoctorEmail,
  resendDoctorOtp,
  getApplicationStatus,
  getAllDoctors,
  getPendingDoctors,
  getDoctorById,
  approveDoctor,
  rejectDoctor,
  setDoctorBlocked,
};
