/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Third-Party Module
 */
import type { UploadApiResponse } from "cloudinary";

/**
 * Application Module
 */
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

/**
 * Update Profile Image Service
 */
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

export default {
  updateProfileImage,
};
