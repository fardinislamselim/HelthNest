/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

import httpStatus from "http-status";
import { prisma } from "@/lib/prisma";
import stripe from "@/lib/stripe";
import AppError from "@/middleware/AppError";
import {
  RefundStatus,
  PaymentStatus,
  AppointmentStatus,
  Role,
  type Prisma,
} from "../../../../generated/prisma/client";
import type { IRefundQuery, IProcessRefundInput } from "./refund.interface";

const refundInclude = {
  payment: {
    select: {
      id: true,
      amount: true,
      currency: true,
      transactionId: true,
      status: true,
      paidAt: true,
    },
  },
  appointment: {
    select: {
      id: true,
      serialNumber: true,
      status: true,
      cancelledAt: true,
      schedule: {
        select: {
          date: true,
          startTime: true,
          endTime: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
};

/**
 * Internal refund processing service.
 * Handles gateway refund initiation via Stripe with idempotency protection.
 */
const processRefundInternal = async (payload: IProcessRefundInput) => {
  const { appointmentId, paymentId, patientId, amount, currency = "usd", reason } = payload;

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { appointment: true },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Associated payment not found");
  }

  if (payment.appointmentId !== appointmentId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment does not match appointment");
  }

  // Idempotency: check if an active or completed refund already exists
  const existingRefund = await prisma.refund.findFirst({
    where: {
      paymentId: payment.id,
      status: { in: [RefundStatus.COMPLETED, RefundStatus.PROCESSING] },
    },
    include: refundInclude,
  });

  if (existingRefund) {
    return existingRefund;
  }

  if (payment.status !== PaymentStatus.PAID) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Cannot refund payment with status '${payment.status}'. Only PAID payments can be refunded.`,
    );
  }

  const idempotencyKey = payload.idempotencyKey || `refund_app_${appointmentId}_pay_${paymentId}`;

  // Check if pending refund with this idempotency key already exists
  const existingKeyRefund = await prisma.refund.findUnique({
    where: { idempotencyKey },
    include: refundInclude,
  });

  if (existingKeyRefund && existingKeyRefund.status === RefundStatus.COMPLETED) {
    return existingKeyRefund;
  }

  // Create or reuse pending refund record
  const refundRecord =
    existingKeyRefund ??
    (await prisma.refund.create({
      data: {
        appointmentId,
        paymentId,
        patientId,
        amount,
        currency,
        status: RefundStatus.PENDING,
        idempotencyKey,
        reason,
      },
    }));

  let gatewayRefundId: string | null = null;
  let nextStatus: RefundStatus = RefundStatus.PENDING;
  let failureReason: string | null = null;

  try {
    if (!payment.transactionId) {
      throw new Error("Payment transaction reference (Stripe payment_intent) is missing");
    }

    const stripeClient = stripe();
    const stripeRefund = await stripeClient.refunds.create(
      {
        payment_intent: payment.transactionId,
        amount: Math.round(Number(amount) * 100),
        reason: "requested_by_customer",
      },
      {
        idempotencyKey: `stripe_${idempotencyKey}`,
      },
    );

    gatewayRefundId = stripeRefund.id;
    if (stripeRefund.status === "succeeded") {
      nextStatus = RefundStatus.COMPLETED;
    } else if (stripeRefund.status === "pending") {
      nextStatus = RefundStatus.PROCESSING;
    } else if (stripeRefund.status === "failed") {
      nextStatus = RefundStatus.FAILED;
      failureReason = stripeRefund.failure_reason || "Gateway refund failed";
    }
  } catch (err: any) {
    nextStatus = RefundStatus.FAILED;
    failureReason = err?.message || "Stripe refund processing failed";
  }

  const updatedRefund = await prisma.refund.update({
    where: { id: refundRecord.id },
    data: {
      status: nextStatus,
      gatewayRefundId,
      failureReason,
      processedAt: nextStatus === RefundStatus.COMPLETED ? new Date() : null,
    },
    include: refundInclude,
  });

  if (nextStatus === RefundStatus.COMPLETED) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.REFUNDED },
    });
  }

  return updatedRefund;
};

/**
 * Handle manual/internal trigger of an eligible refund for an appointment (Admin only)
 */
const processRefundForAppointment = async (appointmentId: string, reason?: string) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      patient: true,
      payment: true,
      schedule: true,
    },
  });

  if (!appointment) {
    throw new AppError(httpStatus.NOT_FOUND, "Appointment not found");
  }

  if (appointment.status !== AppointmentStatus.CANCELLED) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Cannot process refund for an appointment that is not cancelled",
    );
  }

  if (!appointment.patientId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Appointment has no associated patient");
  }

  if (!appointment.payment || appointment.payment.status !== PaymentStatus.PAID) {
    throw new AppError(
      httpStatus.CONFLICT,
      "No eligible paid payment found for this appointment",
    );
  }

  return processRefundInternal({
    appointmentId: appointment.id,
    paymentId: appointment.payment.id,
    patientId: appointment.patientId,
    amount: Number(appointment.payment.amount),
    currency: appointment.payment.currency,
    reason: reason || "Internal refund processing initiated by administrator",
  });
};

/**
 * Retrieve authenticated patient's refund history
 */
const getMyRefunds = async (userId: string, query: IRefundQuery) => {
  const patient = await prisma.patient.findUnique({
    where: { userId },
  });

  if (!patient || patient.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Patient profile not found");
  }

  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;

  const where: Prisma.RefundWhereInput = {
    patientId: patient.id,
    ...(query.status ? { status: query.status } : {}),
  };

  const [total, refunds] = await Promise.all([
    prisma.refund.count({ where }),
    prisma.refund.findMany({
      where,
      include: refundInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
  ]);

  return {
    refunds,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

/**
 * Retrieve details for a specific refund (Patient or Admin)
 */
const getRefundById = async (userId: string, userRole: Role, refundId: string) => {
  const refund = await prisma.refund.findUnique({
    where: { id: refundId },
    include: {
      ...refundInclude,
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          userId: true,
        },
      },
    },
  });

  if (!refund) {
    throw new AppError(httpStatus.NOT_FOUND, "Refund not found");
  }

  if (userRole === Role.PATIENT) {
    const patient = await prisma.patient.findUnique({
      where: { userId },
    });
    if (!patient || refund.patientId !== patient.id) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to view this refund");
    }
  } else if (userRole !== Role.ADMIN && userRole !== Role.SUPER_ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to view this refund");
  }

  return refund;
};

export const refundService = {
  processRefundInternal,
  processRefundForAppointment,
  getMyRefunds,
  getRefundById,
};
