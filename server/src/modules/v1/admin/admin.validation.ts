/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

import { z } from "zod";

const createAdminValidationSchema = z.object({
  body: z.object({
    organizationEmail: z.string().trim().email().transform((email) => email.toLowerCase()),
    personalEmail: z.string().trim().email().transform((email) => email.toLowerCase()),
    name: z.string().trim().min(2).max(100).optional(),
  }),
});

const userIdParamsValidationSchema = z.object({
  params: z.object({
    userId: z.string().uuid("User ID must be a valid UUID"),
  }),
});

const doctorIdParamsValidationSchema = z.object({
  params: z.object({
    doctorId: z.string().trim().min(1, "Doctor ID is required"),
  }),
});

const rejectDoctorValidationSchema = doctorIdParamsValidationSchema.extend({
  body: z.object({
    rejectionReason: z.string().trim().min(1).max(1000).optional(),
  }),
});


const patientIdParamsValidationSchema = z.object({
  params: z.object({
    patientId: z.string().uuid("Patient ID must be a valid UUID"),
  }),
});

const getAllPatientsQueryValidationSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().positive("Page must be a positive integer").optional().default(1),
      limit: z.coerce.number().int().positive("Limit must be a positive integer").max(100, "Limit cannot exceed 100").optional().default(10),
      search: z.string().trim().optional(),
      searchTerm: z.string().trim().optional(),
      status: z.enum(["ACTIVE", "BLOCKED", "DELETED"]).optional(),
    })
    .optional(),
});

export const AdminValidation = {
  createAdminValidationSchema,
  userIdParamsValidationSchema,
  doctorIdParamsValidationSchema,
  rejectDoctorValidationSchema,
  patientIdParamsValidationSchema,
  getAllPatientsQueryValidationSchema,

};
