/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

import { z } from "zod";

// Update My Profile Validation Schema
const updateMyProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100).optional(),
    email: z.string().trim().email().transform((email) => email.toLowerCase()).optional(),
    contactNumber: z.string().trim().min(7).max(20).optional(),
    address: z.string().trim().max(300).optional(),
  }).refine((body) => Object.keys(body).length > 0, {
    message: "At least one profile field is required",
  }),
});

// Get User By ID Validation Schema
const getUserByIdValidationSchema = z.object({
  params: z.object({
    userId: z.string().uuid("Invalid user ID"),
  }),
})

// Update Profile Image Validation Schema
const updateProfileImageValidationSchema = z.object({
  file: z.any().refine((file) => file && file.size < 5 * 1024 * 1024, {
    message: "Profile image size must be less than 5MB",
  }),
});

// Export User Validation
export const UserValidation = {
  updateMyProfileValidationSchema,
  getUserByIdValidationSchema,
  updateProfileImageValidationSchema
};