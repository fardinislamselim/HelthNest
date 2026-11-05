import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { dashboardService } from "./dashboard.service";

const getAdminDashboard = catchAsync(async (_req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin dashboard statistics retrieved successfully",
    data: await dashboardService.getAdminDashboard(),
  });
});

const getDoctorDashboard = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor dashboard statistics retrieved successfully",
    data: await dashboardService.getDoctorDashboard(req.user!.userId),
  });
});

const getPatientDashboard = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient dashboard statistics retrieved successfully",
    data: await dashboardService.getPatientDashboard(req.user!.userId),
  });
});

const getSuperAdminDashboard = catchAsync(async (_req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Super admin dashboard statistics retrieved successfully",
    data: await dashboardService.getSuperAdminDashboard(),
  });
});

export const dashboardController = {
  getAdminDashboard,
  getDoctorDashboard,
  getPatientDashboard,
  getSuperAdminDashboard,
};
