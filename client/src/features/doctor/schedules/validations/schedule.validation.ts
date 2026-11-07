import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const calculateExpectedSlots = (startTime: string, endTime: string): number => {
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) return 0;
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  if (start >= end) return 0;
  return Math.floor((end - start) / 20);
};

export const createScheduleSchema = z
  .object({
    date: z
      .string()
      .regex(dateRegex, "Date must be in YYYY-MM-DD format")
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Please choose a valid calendar date",
      }),
    startTime: z
      .string()
      .regex(timeRegex, "Start time must be in HH:mm 24-hour format (e.g. 09:00)"),
    endTime: z
      .string()
      .regex(timeRegex, "End time must be in HH:mm 24-hour format (e.g. 13:00)"),
    meetLink: z
      .string()
      .trim()
      .url("Please provide a valid video meeting URL (e.g. https://meet.google.com/abc-defg-hij)"),
  })
  .superRefine((data, ctx) => {
    if (!timeRegex.test(data.startTime) || !timeRegex.test(data.endTime)) return;

    const startMinutes = timeToMinutes(data.startTime);
    const endMinutes = timeToMinutes(data.endTime);

    if (startMinutes >= endMinutes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End time must be after start time and on the same calendar day (no midnight crossings)",
        path: ["endTime"],
      });
      return;
    }

    const duration = endMinutes - startMinutes;
    if (duration < 180) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Schedule duration must be at least 3 hours (180 minutes)",
        path: ["endTime"],
      });
    } else if (duration > 480) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Schedule duration must not exceed 8 hours (480 minutes)",
        path: ["endTime"],
      });
    }
  });

export type CreateScheduleFormValues = z.infer<typeof createScheduleSchema>;
