import { NextFunction, Request, Response } from "express";
import catchAsync from "@/utils/catchAsync";
import { doctorService } from "./doctor.service";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";

const applyAsDoctor = catchAsync(
  async (req: Request, res: Response) => {

    const files = req.files as
      | {
          resume?: Express.Multer.File[];
          aditionalFiles?: Express.Multer.File[];
        }
      | undefined;

    const resume = files?.resume?.[0] ?? null;
    const aditionalFiles = files?.aditionalFiles ?? [];

    const data = req.body;

    const result = await doctorService.applyAsDoctor(data, resume, aditionalFiles);


    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor applied successfully",
      data: result,
    });
  },
);

const verifyDoctorEmail = catchAsync(async (req: Request, res: Response) => {
  await doctorService.verifyDoctorEmail(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor email verified successfully",
    data: null,
  });
});

export const doctorController = {
  applyAsDoctor,
  verifyDoctorEmail,
};
