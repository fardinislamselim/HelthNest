import { Request, Response } from "express";
import httpStatus from "http-status";
import { Role, UserStatus } from "../../../../generated/prisma/enums";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { adminService } from "./admin.service";
import AppError from "@/middleware/AppError";

const createAdmin = (role: Role.ADMIN | Role.SUPER_ADMIN) =>
  catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.createAdmin(req.body, role);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Administrator created successfully",
      data: result,
    });
  });

const listAdmins = (role: Role.ADMIN | Role.SUPER_ADMIN) =>
  catchAsync(async (_req: Request, res: Response) => {
    const result = await adminService.listAdmins(role);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Administrators retrieved successfully",
      data: result,
    });
  });

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getUserById(String(req.params.userId));
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "User retrieved successfully", data: result });
});

const setBlocked = (role: Role.ADMIN | Role.SUPER_ADMIN, status: UserStatus.BLOCKED | UserStatus.ACTIVE) =>
  catchAsync(async (req: Request, res: Response) => {
    if (req.user?.userId === req.params.userId) {
      throw new AppError(httpStatus.BAD_REQUEST, "You cannot change your own account status");
    }
    const result = await adminService.setAdminBlocked(String(req.params.userId), role, status);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: status === UserStatus.BLOCKED ? "Administrator blocked successfully" : "Administrator unblocked successfully",
      data: result,
    });
  });

export const adminController = {
  createAdmin,
  listAdmins,
  getUserById,
  setBlocked,
};
