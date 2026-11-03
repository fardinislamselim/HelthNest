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

export const AdminValidation = {
  createAdminValidationSchema,
  userIdParamsValidationSchema,
};
