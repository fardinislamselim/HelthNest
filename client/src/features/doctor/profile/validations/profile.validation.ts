import { z } from "zod";

export const doctorProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z.string().trim().email("Please provide a valid email address"),
  contactNumber: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || (val.length >= 7 && val.length <= 20),
      "Contact number must be between 7 and 20 digits",
    ),
  address: z
    .string()
    .trim()
    .max(300, "Address cannot exceed 300 characters")
    .optional(),
});

export type DoctorProfileFormValues = z.infer<typeof doctorProfileSchema>;
