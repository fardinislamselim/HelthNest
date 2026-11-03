import { z } from "zod";

const applyAsDoctorValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().transform((email) => email.toLowerCase()),
    address: z.string().trim().min(1).max(300),
    specialization: z.string().trim().min(1).max(100),
    licenseNumber: z.string().trim().min(1).max(100),
    qualifications: z.string().trim().min(1).max(500),
    experienceYears: z.coerce.number().int().min(0),
    bio: z.string().trim().max(2000).optional(),
    consultationFee: z.coerce.number().nonnegative().optional(),
    contactNumber: z.string().trim().min(7).max(20).optional(),
  }),
});

const verifyDoctorEmailValidationSchema = z.object({
  body: z.object({
    email: z.string().trim().email().transform((email) => email.toLowerCase()),
    otp: z.string().trim().regex(/^\d{6}$/, "OTP must be 6 digits"),
  }),
});

export const DoctorValidation = {
  applyAsDoctorValidationSchema,
  verifyDoctorEmailValidationSchema,
};