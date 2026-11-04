import { z } from "zod";

const appointmentIdParams = z.object({
  params: z.object({
    appointmentId: z.string().uuid("Appointment ID must be a valid UUID"),
  }),
});

const listQuery = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
    status: z
      .enum(["PENDING", "BOOKED", "ONGOING", "COMPLETED", "CANCELLED"])
      .optional(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .optional(),
  }),
});

const createAppointment = z.object({
  body: z.object({
    scheduleId: z.string().uuid("Schedule ID must be a valid UUID"),
    slotId: z.string().uuid("Slot ID must be a valid UUID"),
  }),
});

export const AppointmentValidation = {
  appointmentIdParams,
  listQuery,
  createAppointment,
};
