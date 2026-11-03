import AppError from "@/middleware/AppError";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { adminService } from "./admin.service";

// Create an administrator and deliver the generated credentials by email.
const createAdmin = (role: "ADMIN" | "SUPER_ADMIN") =>
  catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.createAdmin(req.body, role);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Administrator created successfully",
      data: result,
    });
  });

// List administrators of the requested role.
const listAdmins = (role: "ADMIN" | "SUPER_ADMIN") =>
  catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.listAdmins(role);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Administrators retrieved successfully",
      data: result,
    });
  });

// Return account details for an authorized administrator.
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getUserById(String(req.params.userId));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

// Block or unblock an administrator without allowing self-lockout.
const setBlocked = (
  role: "ADMIN" | "SUPER_ADMIN",
  status: "BLOCKED" | "ACTIVE",
) =>
  catchAsync(async (req: Request, res: Response) => {
    if (req.user?.userId === req.params.userId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You cannot change your own account status",
      );
    }
    const result = await adminService.setAdminBlocked(
      String(req.params.userId),
      role,
      status,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        status === "BLOCKED"
          ? "Administrator blocked successfully"
          : "Administrator unblocked successfully",
      data: result,
    });
  });

export const adminController = {
  createAdmin,
  listAdmins,
  getUserById,
  setBlocked,
};
