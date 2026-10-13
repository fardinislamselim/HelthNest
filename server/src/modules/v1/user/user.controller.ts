/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Third-Party Module
 */
import httpStatus from "http-status";
import { Request, Response } from "express";

/**
 * Application Module
 */
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import AppError from "@/middleware/AppError";
import { IRequestUser } from "@/modules/v1/auth/auth.interface";
import userService from "@/modules/v1/user/user.service";

/**
 * Upload Profile Image Controller
 */
const updateProfileImage = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;

  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "Profile image is required");
  }

  const result = await userService.updateProfileImage(
    req.file.buffer,
    user.userId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile image uploaded successfully",
    data: result,
  });
});

export const UserController = {
  updateProfileImage,
};