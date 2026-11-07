import { z } from "zod";

export const prescriptionMedicineSchema = z.object({
  name: z.string().trim().min(1, "Medicine name is required"),
  dosage: z.string().trim().min(1, "Dosage is required (e.g. 500mg)"),
  frequency: z.string().trim().min(1, "Frequency is required (e.g. 1-0-1 or Twice daily)"),
  duration: z.string().trim().min(1, "Duration is required (e.g. 7 days)"),
  instructions: z.string().trim().optional(),
});

export const createPrescriptionSchema = z.object({
  appointmentId: z.string().trim().min(1, "Please select an eligible completed appointment"),
  keyFindings: z
    .string()
    .trim()
    .min(5, "Key clinical findings must be at least 5 characters"),
  medicines: z
    .array(prescriptionMedicineSchema)
    .min(1, "At least one medicine must be prescribed"),
  additionalInstructions: z.string().trim().optional(),
});

export type CreatePrescriptionFormValues = z.infer<typeof createPrescriptionSchema>;
