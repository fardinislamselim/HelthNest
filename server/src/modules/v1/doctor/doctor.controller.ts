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
import config from "@/config";

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
    secure: config.node_env === "development" ? false : true,
    sameSite: config.node_env === "development" ? "lax" : "none",
    maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
  });

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: config.node_env === "development" ? false : true,
    sameSite: config.node_env === "development" ? "lax" : "none",
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

// Retrieve Public Doctors List Controller
const getAllPublicDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await doctorService.getAllPublicDoctors(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Public doctors retrieved successfully",
    meta: result.meta,
    data: result.doctors,
  });
});

// Retrieve Public Doctor Filter Options Controller
const getDoctorFilterOptions = catchAsync(
  async (_req: Request, res: Response) => {
    const result = await doctorService.getDoctorFilterOptions();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor filter options retrieved successfully",
      data: result,
    });
  },
);

// Retrieve Public Doctor Details Controller
const getPublicDoctorById = catchAsync(async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const result = await doctorService.getPublicDoctorById(String(doctorId));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor details retrieved successfully",
    data: result,
  });
});

// Retrieve Public Doctor Schedules & Slots Controller
const getPublicDoctorSchedules = catchAsync(
  async (req: Request, res: Response) => {
    const { doctorId } = req.params;
    const date = typeof req.query.date === "string" ? req.query.date : undefined;
    const result = await doctorService.getPublicDoctorSchedules(
      String(doctorId),
      date,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor schedules retrieved successfully",
      data: result,
    });
  },
);

export const doctorController = {
  applyAsDoctor,
  verifyDoctorEmail,
  resendDoctorOtp,
  getApplicationStatus,
  getAllPublicDoctors,
  getDoctorFilterOptions,
  getPublicDoctorById,
  getPublicDoctorSchedules,
};
