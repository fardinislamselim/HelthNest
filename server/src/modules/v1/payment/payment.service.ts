import httpStatus from "http-status";
import {
  PaymentStatus,
  AppointmentStatus,
} from "../../../../generated/prisma/enums";
import type { Prisma } from "../../../../generated/prisma/client";
import config from "@/config";
import { prisma } from "@/lib/prisma";
import AppError from "@/middleware/AppError";
import Stripe from "stripe";
import createInvoicePdf from "@/utils/invoice-pdf";
import sendInvoiceEmail from "@/services/email.service";
import stripe from "@/lib/stripe";
import { logger } from "@/lib/winston";
import { getScheduleStartDateTime } from "@/utils/payment-refund";

const confirmationInclude = {
  patient: true,
  doctor: true,
  schedule: true,
  slot: true,
} satisfies Prisma.AppointmentInclude;

/**
 * Appends the appointment id and Stripe's session placeholder to the
 * configured success URL so the success page can verify the payment.
 */
const buildSuccessUrl = (appointmentId: string) => {
  const base = config.stripe_success_url;
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}appointmentId=${encodeURIComponent(
    appointmentId,
  )}&session_id={CHECKOUT_SESSION_ID}`;
};

export const createCheckoutSession = async (
  appointmentId: string,
  userId?: string,
) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      patient: true,
      doctor: true,
      schedule: true,
      slot: true,
      payment: true,
    },
  });
  if (!appointment || !appointment.patient || !appointment.doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Appointment not found");
  }
  if (userId && appointment.patient.userId !== userId) {
    throw new AppError(httpStatus.NOT_FOUND, "Appointment not found");
  }
  if (appointment.status !== AppointmentStatus.PENDING) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Appointment is no longer awaiting payment",
    );
  }
  if (!appointment.doctor.consultationFee) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Doctor consultation fee is not configured",
    );
  }
  if (appointment.payment?.status === PaymentStatus.PAID) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Appointment has already been paid",
    );
  }
  if (
    appointment.schedule &&
    getScheduleStartDateTime(
      appointment.schedule.date,
      appointment.schedule.startTime,
    ).getTime() <= Date.now()
  ) {
    throw new AppError(
      httpStatus.CONFLICT,
      "The consultation schedule has already started; payment can no longer be completed",
    );
  }

  const amount = Number(appointment.doctor.consultationFee);
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    customer_email: appointment.patient.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: config.payment_currency,
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: `HelthNest consultation with Dr. ${appointment.doctor.name}`,
          },
        },
      },
    ],
    metadata: { appointmentId: appointment.id },
    success_url: buildSuccessUrl(appointment.id),
    cancel_url: config.stripe_cancel_url,
  });
  if (!session.url) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "Stripe did not return a checkout URL",
    );
  }

  await prisma.payment.upsert({
    where: { appointmentId: appointment.id },
    create: {
      appointmentId: appointment.id,
      provider: "STRIPE",
      checkoutSessionId: session.id,
      amount,
      currency: config.payment_currency,
    },
    update: {
      checkoutSessionId: session.id,
      amount,
      status: PaymentStatus.PENDING,
    },
  });
  return { checkoutSessionId: session.id, paymentUrl: session.url };
};

const getPaymentIntentId = (session: Stripe.Checkout.Session) => {
  if (typeof session.payment_intent === "string") return session.payment_intent;
  if (typeof session.payment_intent === "object" && session.payment_intent) {
    return session.payment_intent.id;
  }
  return null;
};

/**
 * Marks a payment as PAID, books the appointment and assigns the next
 * serial number for its schedule — all inside one serializable transaction.
 * Idempotent: a payment that is already PAID returns null unless its invoice
 * still needs to be emailed.
 */
async function finalizePaidPayment(
  paymentId: string,
  transactionId?: string | null,
) {
  return prisma.$transaction(
    async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { appointment: { include: confirmationInclude } },
      });
      if (!payment) return null;
      if (payment.status === PaymentStatus.PAID) {
        if (!payment.invoiceNumber || payment.invoiceEmailedAt) return null;
        return {
          payment,
          appointment: payment.appointment,
          invoiceNumber: payment.invoiceNumber,
        };
      }
      if (payment.appointment.status !== AppointmentStatus.PENDING) return null;

      const latest = await tx.appointment.aggregate({
        where: {
          scheduleId: payment.appointment.scheduleId,
          serialNumber: { not: null },
        },
        _max: { serialNumber: true },
      });
      const serialNumber =
        Math.max(
          latest._max.serialNumber ?? 0,
          payment.appointment.serialNumber ?? 0,
        ) + 1;
      const invoiceNumber =
        payment.invoiceNumber ?? `HN-${Date.now()}-${serialNumber}`;

      const paidPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.PAID,
          transactionId: transactionId ?? undefined,
          invoiceNumber,
          paidAt: new Date(),
        },
      });
      const appointment = await tx.appointment.update({
        where: { id: payment.appointmentId },
        data: { status: AppointmentStatus.BOOKED, serialNumber },
        include: confirmationInclude,
      });
      return { payment: paidPayment, appointment, invoiceNumber };
    },
    { isolationLevel: "Serializable" },
  );
}

async function deliverInvoice(
  confirmation: NonNullable<Awaited<ReturnType<typeof finalizePaidPayment>>>,
) {
  const { appointment, payment, invoiceNumber } = confirmation;
  if (!appointment.patient || !appointment.doctor) return;
  if (!appointment.serialNumber || !payment.paidAt) return;

  const pdf = await createInvoicePdf(invoiceNumber, {
    id: appointment.id,
    amount: payment.amount.toString(),
    currency: payment.currency,
    patientName: appointment.patient.name,
    patientEmail: appointment.patient.email,
    doctorName: appointment.doctor.name,
    scheduleDate: appointment.schedule.date,
    slotStart: appointment.slot.startTime,
    slotEnd: appointment.slot.endTime,
    serialNumber: appointment.serialNumber,
    paidAt: payment.paidAt,
  });

  await sendInvoiceEmail({
    email: appointment.patient.email,
    patientName: appointment.patient.name,
    doctorName: appointment.doctor.name,
    scheduleDate: String(appointment.schedule.date),
    slotStart: appointment.slot.startTime,
    slotEnd: appointment.slot.endTime,
    serialNumber: appointment.serialNumber,
    invoiceNumber,
    amount: payment.amount.toString(),
    currency: payment.currency,
    pdf,
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { invoiceEmailedAt: new Date() },
  });
}

const sendInvoiceSafely = async (
  confirmation: NonNullable<Awaited<ReturnType<typeof finalizePaidPayment>>>,
) => {
  try {
    await deliverInvoice(confirmation);
  } catch (error) {
    logger.error(
      `Failed to dispatch invoice for appointment ${
        confirmation.appointment.id
      }: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

export const handleStripeEvent = async (event: Stripe.Event) => {
  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded" &&
    event.type !== "checkout.session.async_payment_failed" &&
    event.type !== "checkout.session.expired"
  )
    return;

  const session = event.data.object as Stripe.Checkout.Session;
  const appointmentId = session.metadata?.appointmentId;
  if (!appointmentId) return;
  if (
    event.type === "checkout.session.completed" &&
    session.payment_status !== "paid"
  )
    return;

  if (
    event.type === "checkout.session.async_payment_failed" ||
    event.type === "checkout.session.expired"
  ) {
    await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { checkoutSessionId: session.id },
      });
      if (!payment || payment.status === PaymentStatus.PAID) return;
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status:
            event.type === "checkout.session.expired"
              ? PaymentStatus.EXPIRED
              : PaymentStatus.FAILED,
        },
      });
      await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: AppointmentStatus.CANCELLED, cancelledAt: new Date() },
      });
      await tx.slot.update({
        where: {
          id: (
            await tx.appointment.findUniqueOrThrow({
              where: { id: appointmentId },
              select: { slotId: true },
            })
          ).slotId,
        },
        data: { isBooked: false },
      });
    });
    return;
  }

  const paymentRecord = await prisma.payment.findUnique({
    where: { checkoutSessionId: session.id },
    select: { id: true },
  });
  if (!paymentRecord) return;

  const confirmation = await finalizePaidPayment(
    paymentRecord.id,
    getPaymentIntentId(session),
  );
  if (confirmation) await sendInvoiceSafely(confirmation);
};

/**
 * Confirms a checkout straight with Stripe after the patient is redirected
 * back to the app, so bookings are finalised even when the webhook cannot
 * reach a local development server.
 */
export const verifyCheckoutPayment = async (
  userId: string,
  appointmentId: string,
  sessionId?: string,
) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      patient: true,
      doctor: true,
      schedule: true,
      slot: true,
      payment: true,
    },
  });
  if (
    !appointment ||
    !appointment.patient ||
    appointment.patient.userId !== userId
  ) {
    throw new AppError(httpStatus.NOT_FOUND, "Appointment not found");
  }
  if (appointment.payment?.status === PaymentStatus.PAID) {
    return { verified: true, appointment };
  }
  if (!appointment.payment) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This appointment has no payment to verify",
    );
  }
  if (appointment.status === AppointmentStatus.CANCELLED) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This appointment was cancelled and can no longer be paid",
    );
  }

  const checkoutSessionId =
    sessionId || appointment.payment.checkoutSessionId;
  if (!checkoutSessionId) {
    throw new AppError(
      httpStatus.CONFLICT,
      "No Stripe checkout session is associated with this appointment",
    );
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe().checkout.sessions.retrieve(checkoutSessionId);
  } catch (error) {
    logger.error(
      `Stripe session verification failed for ${checkoutSessionId}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "Unable to verify the payment with Stripe at the moment",
    );
  }

  if (session.metadata?.appointmentId !== appointment.id) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This payment session does not belong to the selected appointment",
    );
  }
  if (session.payment_status !== "paid") {
    throw new AppError(
      httpStatus.CONFLICT,
      "Stripe has not confirmed this payment yet. Please refresh in a moment.",
    );
  }

  const confirmation = await finalizePaidPayment(
    appointment.payment.id,
    getPaymentIntentId(session),
  );

  if (!confirmation) {
    const refreshed = await prisma.appointment.findUnique({
      where: { id: appointment.id },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
        slot: true,
        payment: true,
      },
    });
    if (refreshed?.payment?.status === PaymentStatus.PAID) {
      return { verified: true, appointment: refreshed };
    }
    throw new AppError(
      httpStatus.CONFLICT,
      "This appointment is no longer awaiting payment",
    );
  }

  await sendInvoiceSafely(confirmation);
  return { verified: true, appointment: confirmation.appointment };
};

export const paymentService = {
  createCheckoutSession,
  handleStripeEvent,
  verifyCheckoutPayment,
};
