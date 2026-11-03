import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import AppError from "@/middleware/AppError";
import { IRequestUser } from "@/modules/v1/auth/auth.interface";
import userService from "@/modules/v1/user/user.service";


//  Upload Profile Image Controller
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

// Get My Profile Controller
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const result = await userService.getMyProfile(user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile fetched successfully",
    data: result,
  });
});

// Update My Profile Controller
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const result = await userService.updateMyProfile(user.userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

// Get User By ID Controller
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getUserById(String(req.params.userId));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User fetched successfully",
    data: result,
  });
});

// Export User Controller
export const UserController = {
  updateProfileImage,
  getMyProfile,
  updateMyProfile,
  getUserById,
};