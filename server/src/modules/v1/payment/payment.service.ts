import PDFDocument from "pdfkit";
import httpStatus from "http-status";
import {
  PaymentStatus,
  AppointmentStatus,
} from "../../../../generated/prisma/enums";
import config from "@/config";
import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/nodemailer";
import AppError from "@/middleware/AppError";
import Stripe from "stripe";
import createInvoicePdf from "@/utils/invoice-pdf";
import sendInvoiceEmail from "@/services/email.service";
import stripe from "@/lib/stripe";

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
    success_url: config.stripe_success_url,
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

  const confirmation = await prisma.$transaction(
    async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { checkoutSessionId: session.id },
        include: {
          appointment: {
            include: {
              patient: true,
              doctor: true,
              schedule: true,
              slot: true,
            },
          },
        },
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
      const serialNumber = (latest._max.serialNumber ?? 0) + 1;
      const invoiceNumber = `HN-${Date.now()}-${serialNumber}`;
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.PAID,
          transactionId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : undefined,
          invoiceNumber,
          paidAt: new Date(),
        },
      });
      const appointment = await tx.appointment.update({
        where: { id: payment.appointmentId },
        data: { status: AppointmentStatus.BOOKED, serialNumber },
        include: { patient: true, doctor: true, schedule: true, slot: true },
      });
      return { payment, appointment, invoiceNumber };
    },
    { isolationLevel: "Serializable" },
  );

  if (!confirmation?.appointment.patient || !confirmation.appointment.doctor)
    return;
const pdf = await createInvoicePdf(
  confirmation.invoiceNumber,
  {
    id: confirmation.appointment.id,
    amount: confirmation.payment.amount.toString(),
    currency: confirmation.payment.currency,
    patientName: confirmation.appointment.patient.name,
    patientEmail: confirmation.appointment.patient.email,
    doctorName: confirmation.appointment.doctor.name,
    scheduleDate: confirmation.appointment.schedule.date,
    slotStart: confirmation.appointment.slot.startTime,
    slotEnd: confirmation.appointment.slot.endTime,
    serialNumber: confirmation.appointment.serialNumber!,
    paidAt: confirmation.payment.paidAt!,
  }
);

await sendInvoiceEmail({
  email: confirmation.appointment.patient.email,
  patientName: confirmation.appointment.patient.name,
  doctorName: confirmation.appointment.doctor.name,
  scheduleDate: String(confirmation.appointment.schedule.date),
  slotStart: confirmation.appointment.slot.startTime,
  slotEnd: confirmation.appointment.slot.endTime,
  serialNumber: confirmation.appointment.serialNumber!,
  invoiceNumber: confirmation.invoiceNumber,
  amount: confirmation.payment.amount.toString(),
  currency: confirmation.payment.currency,
  pdf,
});
  await prisma.payment.update({
    where: { id: confirmation.payment.id },
    data: { invoiceEmailedAt: new Date() },
  });
};

export const paymentService = { createCheckoutSession, handleStripeEvent };
