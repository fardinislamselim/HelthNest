/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

import { z } from "zod";

const medicineSchema = z.object({
  name: z.string().trim().min(1, "Medicine name is required"),
  dosage: z.string().trim().min(1, "Dosage is required"),
  frequency: z.string().trim().min(1, "Frequency is required"),
  duration: z.string().trim().min(1, "Duration is required"),
  instructions: z.string().trim().optional(),
});

const createPrescriptionValidationSchema = z.object({
  body: z.object({
    appointmentId: z
      .string()
      .trim()
      .min(1, "Appointment ID is required"),
    keyFindings: z
      .string()
      .trim()
      .min(1, "Key clinical findings are required"),
    medicines: z
      .array(medicineSchema)
      .min(1, "At least one medicine must be prescribed"),
    additionalInstructions: z.string().trim().optional(),
  }),
});

const prescriptionIdParamsValidationSchema = z.object({
  params: z.object({
    prescriptionId: z
      .string()
      .trim()
      .min(1, "Prescription ID is required"),
  }),
});

const getMyPrescriptionsQueryValidationSchema = z.object({
  query: z
    .object({
      page: z.coerce
        .number()
        .int()
        .positive("Page must be a positive integer")
        .optional()
        .default(1),
      limit: z.coerce
        .number()
        .int()
        .positive("Limit must be a positive integer")
        .max(100, "Limit cannot exceed 100")
        .optional()
        .default(10),
    })
    .optional(),
});

export const PrescriptionValidation = {
  createPrescriptionValidationSchema,
  prescriptionIdParamsValidationSchema,
  getMyPrescriptionsQueryValidationSchema,
};
