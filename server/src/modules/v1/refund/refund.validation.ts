/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

import { z } from "zod";

const refundIdParams = z.object({
  params: z.object({
    refundId: z.string().trim().min(1, "Refund ID is required"),
  }),
});

const listQuery = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED"]).optional(),
  }),
});

const processRefundBody = z.object({
  body: z.object({
    appointmentId: z.string().trim().min(1, "Appointment ID is required"),
    reason: z.string().trim().optional(),
  }),
});

export const RefundValidation = {
  refundIdParams,
  listQuery,
  processRefundBody,
};

