import httpStatus from "http-status";
import { Prisma } from "../../../../generated/prisma/client";
import {
  AppointmentStatus,
  PaymentStatus,
  RefundStatus,
  Role,
  ScheduleStatus,
} from "../../../../generated/prisma/enums";

import { prisma } from "@/lib/prisma";
import AppError from "@/middleware/AppError";
import { getZonedTime } from "@/modules/v1/schedule/schedule.utils";
import type {
  IAppointmentQuery,
  ICreateAppointmentPayload,
} from "./appointment.interface";
import { paymentService } from "@/modules/v1/payment/payment.service";
import { refundService } from "@/modules/v1/refund/refund.service";
import {
  getScheduleStartDateTime,
  isEligibleForRefund,
} from "@/utils/payment-refund";

const appointmentInclude = {
  patient: {
    select: {
      id: true,
      name: true,
      email: true,
      contactNumber: true,
      user: { select: { profileImageUrl: true } },
    },
  },
  doctor: {
    select: {
      id: true,
      name: true,
      specialization: true,
      user: { select: { profileImageUrl: true } },
    },
  },
  schedule: {
    select: { id: true, date: true, startTime: true, endTime: true, meetLink: true },
  },
  slot: {
    select: { id: true, serialNumber: true, startTime: true, endTime: true },
  },
  payment: {
    select: {
      status: true,
      amount: true,
      currency: true,
      invoiceNumber: true,
    },
  },
} satisfies Prisma.AppointmentInclude;

const getPatient = async (userId: string) => {
  const patient = await prisma.patient.findFirst({
    where: { userId, isDeleted: false },
  });
  if (!patient) throw new AppError(httpStatus.NOT_FOUND, "Patient profile not found");
  return patient;
};

const getDoctor = async (userId: string) => {
  const doctor = await prisma.doctor.findFirst({
    where: { userId, isDeleted: false },
  });
  if (!doctor) throw new AppError(httpStatus.NOT_FOUND, "Doctor profile not found");
  return doctor;
};

const getAppointment = async (appointmentId: string) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: appointmentInclude,
  });
  if (!appointment) throw new AppError(httpStatus.NOT_FOUND, "Appointment not found");
  return appointment;
};

const getPagination = (query: IAppointmentQuery) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
  return { page, limit, skip: (page - 1) * limit };
};

const createAppointment = async (
  userId: string,
  payload: ICreateAppointmentPayload,
) => {
  const patient = await getPatient(userId);
  const { todayDate, currentTime } = getZonedTime();

  const schedule = await prisma.schedule.findFirst({
    where: {
      id: payload.scheduleId,
      status: ScheduleStatus.PUBLISHED,
      isDeleted: false,
      date: todayDate,
      startTime: { gt: currentTime },
      doctor: { isDeleted: false },
    },
    select: { id: true, doctorId: true },
  });
  if (!schedule) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Schedule is not available for booking",
    );
  }

  try {
    const appointment = await prisma.$transaction(async (tx) => {
      const slot = await tx.slot.findFirst({
        where: { id: payload.slotId, scheduleId: schedule.id },
      });
      if (!slot) throw new AppError(httpStatus.NOT_FOUND, "Slot not found");
      if (slot.isBooked) {
        throw new AppError(httpStatus.CONFLICT, "Slot is no longer available");
      }

      const existing = await tx.appointment.findFirst({
        where: {
          slotId: slot.id,
          status: { not: AppointmentStatus.CANCELLED },
        },
      });
      if (existing) {
        throw new AppError(httpStatus.CONFLICT, "Slot is no longer available");
      }

      const reserved = await tx.slot.updateMany({
        where: { id: slot.id, isBooked: false },
        data: { isBooked: true },
      });
      if (reserved.count !== 1) {
        throw new AppError(httpStatus.CONFLICT, "Slot is no longer available");
      }

      return tx.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: schedule.doctorId,
          scheduleId: schedule.id,
          slotId: slot.id,
          status: AppointmentStatus.PENDING,
        },
        include: appointmentInclude,
      });
    });
    try {
      const payment = await paymentService.createCheckoutSession(
        appointment.id,
        userId,
      );
      return { appointment, payment };
    } catch (error) {
      await prisma.$transaction(async (tx) => {
        await tx.appointment.update({
          where: { id: appointment.id },
          data: { status: AppointmentStatus.CANCELLED, cancelledAt: new Date() },
        });
        await tx.slot.update({
          where: { id: appointment.slotId },
          data: { isBooked: false },
        });
      });
      throw error;
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(httpStatus.CONFLICT, "Slot is no longer available");
    }
    throw error;
  }
};

const listPatientAppointments = async (userId: string, query: IAppointmentQuery) => {
  const patient = await getPatient(userId);
  const { page, limit, skip } = getPagination(query);
  const where: Prisma.AppointmentWhereInput = {
    patientId: patient.id,
    ...(query.status ? { status: query.status } : {}),
    ...(query.date ? { schedule: { date: query.date } } : {}),
  };
  const [total, appointments] = await Promise.all([
    prisma.appointment.count({ where }),
    prisma.appointment.findMany({
      where,
      include: appointmentInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
  ]);
  return { appointments, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const listDoctorAppointments = async (userId: string, query: IAppointmentQuery) => {
  const doctor = await getDoctor(userId);
  const { page, limit, skip } = getPagination(query);
  const where: Prisma.AppointmentWhereInput = {
    doctorId: doctor.id,
    ...(query.status ? { status: query.status } : {}),
    ...(query.date ? { schedule: { date: query.date } } : {}),
  };
  const [total, appointments] = await Promise.all([
    prisma.appointment.count({ where }),
    prisma.appointment.findMany({
      where,
      include: appointmentInclude,
      orderBy: [{ schedule: { date: "asc" } }, { serialNumber: "asc" }],
      skip,
      take: limit,
    }),
  ]);
  return { appointments, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const getOwnAppointment = async (userId: string, role: Role, appointmentId: string) => {
  const appointment = await getAppointment(appointmentId);
  const profile =
    role === Role.PATIENT ? await getPatient(userId) : await getDoctor(userId);
  const owns =
    role === Role.PATIENT
      ? appointment.patientId === profile.id
      : appointment.doctorId === profile.id;
  if (!owns) throw new AppError(httpStatus.NOT_FOUND, "Appointment not found");
  return appointment;
};

const startAppointment = async (userId: string, appointmentId: string) => {
  const doctor = await getDoctor(userId);
  const updated = await prisma.appointment.updateMany({
    where: { id: appointmentId, doctorId: doctor.id, status: AppointmentStatus.BOOKED },
    data: { status: AppointmentStatus.ONGOING, startedAt: new Date() },
  });
  if (updated.count !== 1) {
    await getOwnAppointment(userId, Role.DOCTOR, appointmentId);
    throw new AppError(httpStatus.CONFLICT, "Appointment cannot be started in its current state");
  }
  return getAppointment(appointmentId);
};

const completeAppointment = async (userId: string, appointmentId: string) => {
  const doctor = await getDoctor(userId);
  const updated = await prisma.appointment.updateMany({
    where: { id: appointmentId, doctorId: doctor.id, status: AppointmentStatus.ONGOING },
    data: { status: AppointmentStatus.COMPLETED, completedAt: new Date() },
  });
  if (updated.count !== 1) {
    await getOwnAppointment(userId, Role.DOCTOR, appointmentId);
    throw new AppError(httpStatus.CONFLICT, "Appointment cannot be completed in its current state");
  }
  return getAppointment(appointmentId);
};

const cancelAppointment = async (userId: string, appointmentId: string) => {
  const patient = await getPatient(userId);

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      schedule: true,
      payment: true,
      slot: true,
      patient: true,
    },
  });

  if (!appointment || appointment.patientId !== patient.id) {
    throw new AppError(httpStatus.NOT_FOUND, "Appointment not found");
  }

  if (appointment.status === AppointmentStatus.CANCELLED) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Appointment has already been cancelled",
    );
  }
  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Completed appointment cannot be cancelled",
    );
  }
  if (appointment.status === AppointmentStatus.ONGOING) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Ongoing appointment cannot be cancelled",
    );
  }

  const cancellationTime = new Date();
  const scheduleStartTime = getScheduleStartDateTime(
    appointment.schedule.date,
    appointment.schedule.startTime,
  );
  const refundEligible = isEligibleForRefund(cancellationTime, scheduleStartTime);

  const updatedAppointment = await prisma.$transaction(async (tx) => {
    const updated = await tx.appointment.update({
      where: { id: appointment.id },
      data: { status: AppointmentStatus.CANCELLED, cancelledAt: cancellationTime },
      include: appointmentInclude,
    });
    await tx.slot.update({ where: { id: appointment.slotId }, data: { isBooked: false } });
    return updated;
  });

  let refundResult = null;
  const hasPaidPayment =
    appointment.payment && appointment.payment.status === PaymentStatus.PAID;

  if (refundEligible && hasPaidPayment) {
    refundResult = await refundService.processRefundInternal({
      appointmentId: appointment.id,
      paymentId: appointment.payment!.id,
      patientId: patient.id,
      amount: Number(appointment.payment!.amount),
      currency: appointment.payment!.currency,
      reason: "Appointment cancelled by patient > 1 hour prior to schedule",
    });
  }

  let message: string;
  if (refundEligible) {
    if (hasPaidPayment) {
      message =
        refundResult?.status === RefundStatus.COMPLETED
          ? "Appointment cancelled and refund processed successfully"
          : "Appointment cancelled and refund is processing";
    } else {
      message = "Appointment cancelled successfully. No paid payment found to refund.";
    }
  } else {
    message =
      "Appointment cancelled successfully. No refund issued as cancellation was within 1 hour or after schedule start.";
  }

  return {
    appointment: updatedAppointment,
    cancellationTime: cancellationTime.toISOString(),
    scheduleStartTime: scheduleStartTime.toISOString(),
    refundEligible,
    refund: refundResult,
    message,
  };
};

export const appointmentService = {
  createAppointment,
  listPatientAppointments,
  listDoctorAppointments,
  getOwnAppointment,
  startAppointment,
  completeAppointment,
  cancelAppointment,
};
