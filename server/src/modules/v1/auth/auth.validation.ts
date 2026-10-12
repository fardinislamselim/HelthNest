/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

import { z } from "zod";

/**
 * Register Patient Validation
 */
const registerPatientValidationSchema = z.object({
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
      .max(128, "Password cannot exceed 128 characters"),

    contactNumber: z
      .string()
      .trim()
      .min(7, "Contact number must be at least 7 characters")
      .max(20, "Contact number cannot exceed 20 characters")
      .optional(),

    address: z
      .string()
      .trim()
      .max(300, "Address cannot exceed 300 characters")
      .optional(),
  }),
});

/**
 * Login Validation
 */
const loginUserValidationSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Please provide a valid email")
      .transform((email) => email.toLowerCase()),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(128, "Password cannot exceed 128 characters"),
  }),
});

/**
 * Google Login Validation
 */
const googleLoginValidationSchema = z.object({
  body: z.object({
    idToken: z
      .string()
      .min(1, "Google ID token is required"),
  }),
});

/**
 * Refresh Token Validation
 */
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z
      .string()
      .min(1, "Refresh token is required")
      .optional(),
  }),
});

/**
 * Forgot Password Validation
 */
const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Please provide a valid email")
      .transform((email) => email.toLowerCase()),
  }),
});

/**
 * Reset Password Validation
 */
const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Please provide a valid email")
      .transform((email) => email.toLowerCase()),
    otp: z
      .string()
      .trim()
      .min(6, "OTP must be at least 6 digits")
      .max(6, "OTP cannot exceed 6 digits"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(128, "Password cannot exceed 128 characters"),
  }),
});

/**
 * Export Auth Validation
 */
export const AuthValidation = {
  registerPatientValidationSchema,
  loginUserValidationSchema,
  googleLoginValidationSchema,
  refreshTokenValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema
};
