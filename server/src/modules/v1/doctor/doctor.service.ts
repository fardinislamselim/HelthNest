import path from "path";
import { prisma } from "@/lib/prisma";
import { TApplyAsDoctor } from "./doctor.interface";
import { UploadApiResponse } from "cloudinary";
import { cloudinary } from "@/lib/cloudinary";
import { Role } from "../../../../generated/prisma/enums";
import { redisClient } from "@/lib/redis";
import { transporter } from "@/lib/nodemailer";
import config from "@/config";
import crypto from "crypto";
import httpStatus from "http-status";
import AppError from "@/middleware/AppError";
import ejs from "ejs";

// Apply as Doctor Service
const applyAsDoctor = async (
  paylod: TApplyAsDoctor,
  resume: Express.Multer.File | null,
  aditionalFiles: Express.Multer.File[],
) => {
  const email = paylod.email.trim().toLowerCase();
  const isUserExists = await prisma.user.findUnique({
    where: { email },
    include: { doctor: true },
  });

  if (isUserExists?.doctor) {
    throw new AppError(httpStatus.CONFLICT, "A doctor application already exists for this email");
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

  const additionalFilesResult = await Promise.all(
    aditionalFiles.map((file) => {
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

  const doctorData = {
    ...paylod,
    email,
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
          name: paylod.name,
          role: Role.DOCTOR,
          emailVerified: false,
          doctor: { create: doctorData },
        },
        include: { doctor: true },
      });
    }

    return tx.user.create({
      data: {
        name: paylod.name,
        email,
        role: Role.DOCTOR,
        emailVerified: false,
        doctor: { create: doctorData },
      },
      include: { doctor: true },
    });
  });

  const otp = crypto.randomInt(100000, 1000000).toString();
  const key = `doctor-email-verification:${email}`;
  await redisClient.set(key, otp, {
    expiration: { type: "EX", value: 5 * 60 },
  });

  if (config.node_env === "development") {
    console.log(`[dev] Doctor email verification OTP for ${email}: ${otp}`);
  }

  const templatePath = path.join(
    process.cwd(),
    "src/templates/doctor-email-verification.ejs",
  );
  const html = await ejs.renderFile(templatePath, {
    name: paylod.name,
    otp,
    expiresIn: "5 minutes",
  });

  await transporter.sendMail({
    from: config.email_sender,
    to: email,
    subject: "Verify your doctor application email",
    html,
  });

  return doctorApplication;
};

const verifyDoctorEmail = async (payload: { email: string; otp: string }) => {
  const email = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email },
    include: { doctor: true },
  });

  if (!user?.doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor application not found");
  }

  const key = `doctor-email-verification:${email}`;
  const storedOtp = await redisClient.get(key);
  if (!storedOtp) {
    throw new AppError(httpStatus.NOT_FOUND, "OTP is expired");
  }
  if (storedOtp !== payload.otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });
  await redisClient.del(key);
};

export const doctorService = {
  applyAsDoctor,
  verifyDoctorEmail,
};
