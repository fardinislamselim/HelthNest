import { z } from "zod";
import { emailSchema, passwordSchema, otpSchema } from "./common";

export const registerPatientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: emailSchema,
  password: passwordSchema,
  contactNumber: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || (val.length >= 7 && val.length <= 20),
      "Contact number must be between 7 and 20 characters",
    ),
  address: z
    .string()
    .trim()
    .max(300, "Address cannot exceed 300 characters")
    .optional(),
});

export const registerDoctorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: emailSchema,
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password cannot exceed 128 characters")
    .optional()
    .or(z.literal("")),
  specialization: z
    .string()
    .trim()
    .min(1, "Specialization is required")
    .max(100, "Specialization cannot exceed 100 characters"),
  licenseNumber: z
    .string()
    .trim()
    .min(1, "Medical license number is required")
    .max(100, "License number cannot exceed 100 characters"),
  qualifications: z
    .string()
    .trim()
    .min(1, "Qualifications are required")
    .max(500, "Qualifications cannot exceed 500 characters"),
  experienceYears: z
    .number()
    .int("Must be a whole number")
    .min(0, "Experience years must be at least 0"),
  consultationFee: z
    .number()
    .nonnegative("Consultation fee cannot be negative")
    .optional(),
  contactNumber: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || (val.length >= 7 && val.length <= 20),
      "Contact number must be between 7 and 20 characters",
    ),
  address: z
    .string()
    .trim()
    .max(300, "Address cannot exceed 300 characters")
    .optional(),
  bio: z
    .string()
    .trim()
    .max(2000, "Bio cannot exceed 2000 characters")
    .optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

export const resendOtpSchema = z.object({
  email: emailSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    otp: otpSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterDoctorFormValues = z.infer<typeof registerDoctorSchema>;
export type RegisterPatientFormValues = z.infer<typeof registerPatientSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
export type ResendOtpFormValues = z.infer<typeof resendOtpSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
