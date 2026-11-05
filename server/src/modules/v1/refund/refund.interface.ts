/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

import { RefundStatus } from "../../../../generated/prisma/enums";

export interface IRefundQuery {
  page?: string;
  limit?: string;
  status?: RefundStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IProcessRefundInput {
  appointmentId: string;
  paymentId: string;
  patientId: string;
  amount: number;
  currency?: string;
  reason?: string;
  idempotencyKey?: string;
}

export interface IProcessRefundInternalBody {
  appointmentId: string;
  reason?: string;
}

