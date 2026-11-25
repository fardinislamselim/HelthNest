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
  ScheduleStatus,
  UserStatus,
} from "../../../../generated/prisma/enums";
import { getZonedTime, isSlotAvailable } from "@/modules/v1/schedule/schedule.utils";
import {
  TApplyAsDoctor,
  TVerifyDoctorEmail,
  TGetApplicationStatusQuery,
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

    await Promise.race([
      transporter.sendMail({
        from: config.email_sender,
        to: email,
        subject: "Verify your doctor application email",
        html,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SMTP connection timed out")), 3000),
      ),
    ]);
  } catch (error) {
    logger.warn(`Failed to send doctor verification email to ${email}: ${(error as Error)?.message}. OTP logged to console.`);
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

    await Promise.race([
      transporter.sendMail({
        from: config.email_sender,
        to: normalizedEmail,
        subject: "Verify your doctor application email",
        html,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SMTP connection timed out")), 3000),
      ),
    ]);
  } catch (error) {
    logger.warn(`Failed to resend doctor verification email to ${normalizedEmail}: ${(error as Error)?.message}. OTP logged to console.`);
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



const publicDoctorSelect = {
  id: true,
  name: true,
  specialization: true,
  qualifications: true,
  experienceYears: true,
  bio: true,
  consultationFee: true,
  user: {
    select: {
      profileImageUrl: true,
    },
  },
} as const;

export interface IPublicDoctorQuery {
  page?: number;
  limit?: number;
  search?: string;
  searchTerm?: string;
  specialization?: string;
  minExperience?: number;
  experience?: number;
  maxFee?: number;
  fee?: number;
}

const getAllPublicDoctors = async (query?: IPublicDoctorQuery) => {
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 12;
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    isDeleted: false,
    verificationStatus: DoctorVerificationStatus.APPROVED,
    user: {
      status: UserStatus.ACTIVE,
      isDeleted: false,
    },
  };

  const searchTerm = (query?.search || query?.searchTerm)?.trim();
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { specialization: { contains: searchTerm, mode: "insensitive" } },
      { qualifications: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  const specialization = query?.specialization?.trim();
  if (
    specialization &&
    specialization !== "ALL" &&
    specialization !== "All Specializations"
  ) {
    where.specialization = {
      contains: specialization,
      mode: "insensitive",
    };
  }

  const minExperience = query?.minExperience ?? query?.experience;
  if (minExperience !== undefined && Number(minExperience) > 0) {
    where.experienceYears = {
      gte: Number(minExperience),
    };
  }

  const maxFee = query?.maxFee ?? query?.fee;
  if (maxFee !== undefined && Number(maxFee) > 0) {
    where.consultationFee = {
      lte: Number(maxFee),
    };
  }

  const [total, doctors] = await Promise.all([
    prisma.doctor.count({ where }),
    prisma.doctor.findMany({
      where,
      select: publicDoctorSelect,
      skip,
      take: limit,
      orderBy: { experienceYears: "desc" },
    }),
  ]);

  const formattedDoctors = doctors.map((doc) => ({
    id: doc.id,
    name: doc.name,
    specialization: doc.specialization,
    qualifications: doc.qualifications,
    experienceYears: doc.experienceYears,
    bio: doc.bio,
    consultationFee: doc.consultationFee ? Number(doc.consultationFee) : null,
    profileImageUrl: doc.user?.profileImageUrl || null,
  }));

  return {
    doctors: formattedDoctors,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit) || 1,
    },
  };
};

const getPublicDoctorById = async (doctorId: string) => {
  const doctor = await prisma.doctor.findFirst({
    where: {
      id: doctorId,
      isDeleted: false,
      verificationStatus: DoctorVerificationStatus.APPROVED,
      user: {
        status: UserStatus.ACTIVE,
      },
    },
    select: {
      ...publicDoctorSelect,
      contactNumber: true,
      address: true,
      createdAt: true,
    },
  });

  if (!doctor) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Doctor not found or currently unavailable",
    );
  }

  return {
    id: doctor.id,
    name: doctor.name,
    specialization: doctor.specialization,
    qualifications: doctor.qualifications,
    experienceYears: doctor.experienceYears,
    bio: doctor.bio,
    consultationFee: doctor.consultationFee
      ? Number(doctor.consultationFee)
      : null,
    profileImageUrl: doctor.user?.profileImageUrl || null,
    contactNumber: doctor.contactNumber,
    address: doctor.address,
    createdAt: doctor.createdAt,
  };
};

const getDoctorFilterOptions = async () => {
  const activeApprovedWhere = {
    isDeleted: false,
    verificationStatus: DoctorVerificationStatus.APPROVED,
    user: {
      status: UserStatus.ACTIVE,
      isDeleted: false,
    },
  };

  const [distinctSpecializations, aggregateBounds] = await Promise.all([
    prisma.doctor.findMany({
      where: activeApprovedWhere,
      select: { specialization: true },
      distinct: ["specialization"],
      orderBy: { specialization: "asc" },
    }),
    prisma.doctor.aggregate({
      where: activeApprovedWhere,
      _min: {
        experienceYears: true,
        consultationFee: true,
      },
      _max: {
        experienceYears: true,
        consultationFee: true,
      },
    }),
  ]);

  const specializations = Array.from(
    new Set(
      distinctSpecializations
        .map((item) => item.specialization?.trim())
        .filter((spec): spec is string => Boolean(spec)),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const maxExperience = aggregateBounds._max.experienceYears ?? 15;
  const maxFee = aggregateBounds._max.consultationFee
    ? Number(aggregateBounds._max.consultationFee)
    : 250;

  const experienceTiers = [3, 5, 10, 15, 20].filter(
    (years) => years <= Math.max(maxExperience, 15),
  );
  const experienceOptions = [
    { label: "Any Experience", value: 0 },
    ...experienceTiers.map((years) => ({
      label: `${years}+ Years`,
      value: years,
    })),
  ];

  const feeTiers = [50, 100, 150, 200, 250, 500].filter(
    (fee) => fee <= Math.max(maxFee, 250),
  );
  const feeOptions = [
    { label: "Any Fee", value: 0 },
    ...feeTiers.map((fee) => ({
      label: `Under $${fee}`,
      value: fee,
    })),
  ];

  return {
    specializations,
    experienceOptions,
    feeOptions,
    bounds: {
      minExperience: aggregateBounds._min.experienceYears ?? 0,
      maxExperience,
      minFee: aggregateBounds._min.consultationFee
        ? Number(aggregateBounds._min.consultationFee)
        : 0,
      maxFee,
    },
  };
};

const getPublicDoctorSchedules = async (doctorId: string, date?: string) => {
  const { todayDate, currentTime } = getZonedTime(
    new Date(),
    config.timezone || "Asia/Dhaka",
  );
  const targetDate =
    date && /^\d{4}-\d{2}-\d{2}$/.test(date.trim()) ? date.trim() : todayDate;

  if (targetDate < todayDate) {
    return {
      date: targetDate,
      schedule: null,
      slots: [],
    };
  }

  const schedule = await prisma.schedule.findFirst({
    where: {
      doctorId,
      date: targetDate,
      status: ScheduleStatus.PUBLISHED,
      isDeleted: false,
      doctor: {
        isDeleted: false,
        verificationStatus: DoctorVerificationStatus.APPROVED,
        user: {
          status: UserStatus.ACTIVE,
          isDeleted: false,
        },
      },
    },
    include: {
      slots: {
        orderBy: { serialNumber: "asc" },
        include: {
          appointments: {
            select: { status: true },
          },
        },
      },
    },
  });

  if (!schedule) {
    return {
      date: targetDate,
      schedule: null,
      slots: [],
    };
  }

  // Booking window closes once schedule startTime is reached on today's date
  if (targetDate === todayDate && schedule.startTime <= currentTime) {
    return {
      date: targetDate,
      schedule: null,
      slots: [],
    };
  }

  const slots = schedule.slots.map((slot) => {
    const available = isSlotAvailable(slot);
    return {
      id: slot.id,
      serialNumber: slot.serialNumber,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isBooked: !available,
      isAvailable: available,
    };
  });

  const availableSlots = slots.filter((s) => s.isAvailable).length;

  return {
    date: targetDate,
    schedule: {
      id: schedule.id,
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      totalSlots: schedule.totalSlots,
      availableSlots,
    },
    slots,
  };
};

export const doctorService = {
  applyAsDoctor,
  verifyDoctorEmail,
  resendDoctorOtp,
  getApplicationStatus,
  getAllPublicDoctors,
  getDoctorFilterOptions,
  getPublicDoctorById,
  getPublicDoctorSchedules,
};
