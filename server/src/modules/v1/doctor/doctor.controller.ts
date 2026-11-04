/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { doctorService } from "./doctor.service";
import { UserStatus } from "../../../../generated/prisma/enums";

// Apply as Doctor Controller
const applyAsDoctor = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as
    | {
        resume?: Express.Multer.File[];
        additionalFiles?: Express.Multer.File[];
        aditionalFiles?: Express.Multer.File[];
      }
    | undefined;

  const resume = files?.resume?.[0] ?? null;
  const additionalFiles = files?.additionalFiles ?? files?.aditionalFiles ?? [];

  const data = req.body;
  const result = await doctorService.applyAsDoctor(data, resume, additionalFiles);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Doctor application submitted successfully. Please check your email for the verification code.",
    data: result,
  });
});

// Verify Doctor Application Email Controller
const verifyDoctorEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await doctorService.verifyDoctorEmail(req.body);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  });

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor email verified successfully. Your application has entered the pending approval process.",
    data: result,
  });
});

// Resend Doctor Application OTP Controller
const resendDoctorOtp = catchAsync(async (req: Request, res: Response) => {
  await doctorService.resendDoctorOtp(req.body.email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor verification OTP resent successfully",
    data: null,
  });
});

// Check Doctor Application Status Controller
const getApplicationStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const email = req.query.email as string | undefined;

  const result = await doctorService.getApplicationStatus({
    userId,
    email,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor application status retrieved successfully",
    data: result,
  });
});

export const doctorController = {
  applyAsDoctor,
  verifyDoctorEmail,
  resendDoctorOtp,
  getApplicationStatus,

};
