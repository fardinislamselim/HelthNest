/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Convert HH:mm to minutes from midnight
 */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Format minutes from midnight to HH:mm
 */
export const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

const scheduleIdParamsValidationSchema = z.object({
  params: z.object({
    scheduleId: z.string().uuid("Schedule ID must be a valid UUID"),
  }),
});

const createScheduleValidationSchema = z.object({
  body: z
    .object({
      date: z
        .string()
        .regex(dateRegex, "Date must be in YYYY-MM-DD format")
        .refine((date) => !isNaN(Date.parse(date)), {
          message: "Date must be a valid calendar date",
        }),
      startTime: z
        .string()
        .regex(timeRegex, "Start time must be in HH:mm 24-hour format"),
      endTime: z
        .string()
        .regex(timeRegex, "End time must be in HH:mm 24-hour format"),
      meetLink: z
        .string()
        .trim()
        .url("Please provide a valid video meeting URL"),
    })
    .superRefine((data, ctx) => {
      const startMinutes = timeToMinutes(data.startTime);
      const endMinutes = timeToMinutes(data.endTime);

      if (startMinutes >= endMinutes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Schedule must start and end on the same calendar date and cannot cross midnight",
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
    }),
});

const updateScheduleValidationSchema = z.object({
  params: z.object({
    scheduleId: z.string().uuid("Schedule ID must be a valid UUID"),
  }),
  body: z
    .object({
      date: z
        .string()
        .regex(dateRegex, "Date must be in YYYY-MM-DD format")
        .refine((date) => !isNaN(Date.parse(date)), {
          message: "Date must be a valid calendar date",
        })
        .optional(),
      startTime: z
        .string()
        .regex(timeRegex, "Start time must be in HH:mm 24-hour format")
        .optional(),
      endTime: z
        .string()
        .regex(timeRegex, "End time must be in HH:mm 24-hour format")
        .optional(),
      meetLink: z
        .string()
        .trim()
        .url("Please provide a valid video meeting URL")
        .optional(),
    })
    .refine(
      (data) =>
        data.date !== undefined ||
        data.startTime !== undefined ||
        data.endTime !== undefined ||
        data.meetLink !== undefined,
      {
        message: "At least one field must be provided for update",
      },
    )
    .superRefine((data, ctx) => {
      if (data.startTime && data.endTime) {
        const startMinutes = timeToMinutes(data.startTime);
        const endMinutes = timeToMinutes(data.endTime);

        if (startMinutes >= endMinutes) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Schedule must start and end on the same calendar date and cannot cross midnight",
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
      }
    }),
});

const getMySchedulesQueryValidationSchema = z.object({
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
      status: z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED"]).optional(),
      startDate: z
        .string()
        .regex(dateRegex, "Start date must be in YYYY-MM-DD format")
        .optional(),
      endDate: z
        .string()
        .regex(dateRegex, "End date must be in YYYY-MM-DD format")
        .optional(),
    })
    .optional(),
});

const getTodaySchedulesQueryValidationSchema = z.object({
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

export const ScheduleValidation = {
  createScheduleValidationSchema,
  updateScheduleValidationSchema,
  scheduleIdParamsValidationSchema,
  getMySchedulesQueryValidationSchema,
  getTodaySchedulesQueryValidationSchema,
};
