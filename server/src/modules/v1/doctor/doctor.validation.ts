/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

import { z } from "zod";

const applyAsDoctorValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),
    email: z
      .string()
      .trim()
      .email("Please provide a valid email")
      .transform((email) => email.toLowerCase()),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(128, "Password cannot exceed 128 characters")
      .optional(),
    address: z.string().trim().min(1).max(300).optional(),
    specialization: z.string().trim().min(1, "Specialization is required").max(100),
    licenseNumber: z.string().trim().min(1, "License number is required").max(100),
    qualifications: z.string().trim().min(1, "Qualifications are required").max(500),
    experienceYears: z.coerce.number().int().min(0, "Experience years must be at least 0"),
    bio: z.string().trim().max(2000).optional(),
    consultationFee: z.coerce.number().nonnegative().optional(),
    contactNumber: z.string().trim().min(7).max(20).optional(),
  }),
});

const verifyDoctorEmailValidationSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Please provide a valid email")
      .transform((email) => email.toLowerCase()),
    otp: z.string().trim().regex(/^\d{6}$/, "OTP must be 6 digits"),
  }),
});

const resendDoctorOtpValidationSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Please provide a valid email")
      .transform((email) => email.toLowerCase()),
  }),
});

const getPublicDoctorsQueryValidationSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().positive().optional().default(1),
      limit: z.coerce.number().int().positive().max(50).optional().default(12),
      search: z.string().trim().optional(),
      specialization: z.string().trim().optional(),
      minExperience: z.coerce.number().int().min(0).optional(),
      maxFee: z.coerce.number().nonnegative().optional(),
    })
    .optional(),
});

const doctorIdParamsValidationSchema = z.object({
  params: z.object({
    doctorId: z.string().uuid("Doctor ID must be a valid UUID"),
  }),
});

export const DoctorValidation = {
  applyAsDoctorValidationSchema,
  verifyDoctorEmailValidationSchema,
  resendDoctorOtpValidationSchema,
  getPublicDoctorsQueryValidationSchema,
  doctorIdParamsValidationSchema,
};
