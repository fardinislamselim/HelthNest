import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import AppError from "@/middleware/AppError";
import httpStatus from "http-status";


// Update Profile Image Service

const updateProfileImage = async (buffer: Buffer, userId: string) => {
  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      profileImagePublicId: true,
      profileImageUrl: true,
    },
  });

  const cloudinaryResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }

            if (!result) {
              return reject(new Error("No result returned from Cloudinary"));
            }

            resolve(result);
          },
        )
        .end(buffer);
    },
  );

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      profileImageUrl: cloudinaryResult.secure_url,
      profileImagePublicId: cloudinaryResult.public_id,
    },
    omit: {
      password: true,
    },
  });

  if (currentUser?.profileImagePublicId) {
    await cloudinary.uploader.destroy(currentUser.profileImagePublicId);
  }

  return updatedUser;
};

// Get My Profile Service
const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { patient: true, doctor: true },
    omit: { password: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

// Update My Profile Service
const updateMyProfile = async (
  userId: string,
  payload: {
    name?: string;
    email?: string;
    contactNumber?: string;
    address?: string;
  },
) => {
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { patient: true, doctor: true },
  });

  if (!currentUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (payload.email && payload.email !== currentUser.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (emailExists) {
      throw new AppError(httpStatus.CONFLICT, "Email is already in use");
    }
  }

  const user = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        ...(payload.name !== undefined ? { name: payload.name } : {}),
        ...(payload.email !== undefined ? { email: payload.email, emailVerified: false } : {}),
      },
    });

    if (currentUser.patient) {
      await tx.patient.update({
        where: { userId },
        data: {
          ...(payload.name !== undefined ? { name: payload.name } : {}),
          ...(payload.email !== undefined ? { email: payload.email } : {}),
          ...(payload.contactNumber !== undefined ? { contactNumber: payload.contactNumber } : {}),
          ...(payload.address !== undefined ? { address: payload.address } : {}),
        },
      });
    }

    if (currentUser.doctor) {
      await tx.doctor.update({
        where: { userId },
        data: {
          ...(payload.name !== undefined ? { name: payload.name } : {}),
          ...(payload.email !== undefined ? { email: payload.email } : {}),
          ...(payload.contactNumber !== undefined ? { contactNumber: payload.contactNumber } : {}),
          ...(payload.address !== undefined ? { address: payload.address } : {}),
        },
      });
    }

    return updatedUser;
  });

  return getMyProfile(user.id);
};

// Get User By ID Service
const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { patient: true, doctor: true },
    omit: { password: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

// Export User Service
export default {
  updateProfileImage,
  getMyProfile,
  updateMyProfile,
  getUserById,
};
