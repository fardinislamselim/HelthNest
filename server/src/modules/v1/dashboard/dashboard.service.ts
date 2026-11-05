import httpStatus from "http-status";
import { Prisma } from "../../../../generated/prisma/client";
import {
  AppointmentStatus,
  DoctorVerificationStatus,
  PaymentStatus,
  RefundStatus,
  Role,
  ScheduleStatus,
  UserStatus,
} from "../../../../generated/prisma/enums";
import config from "@/config";
import AppError from "@/middleware/AppError";
import { prisma } from "@/lib/prisma";
import { getZonedTime } from "@/modules/v1/schedule/schedule.utils";
import type { DashboardResult } from "./dashboard.interface";

const recentLimit = 5;

const getBusinessDate = () => getZonedTime(new Date(), config.timezone).todayDate;

const appointmentStatusCounts = async (
  where: Prisma.AppointmentWhereInput = {},
) => {
  const [total, today, booked, ongoing, completed, cancelled] =
    await Promise.all([
      prisma.appointment.count({ where }),
      prisma.appointment.count({
        where: { ...where, schedule: { is: { date: getBusinessDate() } } },
      }),
      prisma.appointment.count({
        where: { ...where, status: AppointmentStatus.BOOKED },
      }),
      prisma.appointment.count({
        where: { ...where, status: AppointmentStatus.ONGOING },
      }),
      prisma.appointment.count({
        where: { ...where, status: AppointmentStatus.COMPLETED },
      }),
      prisma.appointment.count({
        where: { ...where, status: AppointmentStatus.CANCELLED },
      }),
    ]);

  return { total, today, booked, ongoing, completed, cancelled };
};

const paymentStats = async (where: Prisma.PaymentWhereInput = {}) => {
  const paidWhere: Prisma.PaymentWhereInput = {
    ...where,
    status: PaymentStatus.PAID,
  };
  const [successfulCount, successfulAmount] = await Promise.all([
    prisma.payment.count({ where: paidWhere }),
    prisma.payment.aggregate({ where: paidWhere, _sum: { amount: true } }),
  ]);
  return {
    successfulCount,
    totalAmount: Number(successfulAmount._sum.amount ?? 0),
  };
};

const refundStats = async (where: Prisma.RefundWhereInput = {}) => {
  const [total, completed, pending, failed, completedAmount] = await Promise.all([
    prisma.refund.count({ where }),
    prisma.refund.count({ where: { ...where, status: RefundStatus.COMPLETED } }),
    prisma.refund.count({
      where: {
        ...where,
        status: { in: [RefundStatus.PENDING, RefundStatus.PROCESSING] },
      },
    }),
    prisma.refund.count({ where: { ...where, status: RefundStatus.FAILED } }),
    prisma.refund.aggregate({
      where: { ...where, status: RefundStatus.COMPLETED },
      _sum: { amount: true },
    }),
  ]);
  return {
    total,
    completed,
    pending,
    failed,
    totalRefundedAmount: Number(completedAmount._sum.amount ?? 0),
  };
};

const getAdminDashboard = async (): Promise<DashboardResult> => {
  const [
    totalPatients,
    activePatients,
    blockedPatients,
    totalDoctors,
    activeDoctors,
    blockedDoctors,
    totalApplications,
    pendingApplications,
    approvedDoctors,
    rejectedApplications,
    appointments,
    payments,
    refunds,
    recentDoctorApplications,
    recentAppointments,
    recentPayments,
    recentRefunds,
  ] = await Promise.all([
    prisma.patient.count({ where: { isDeleted: false } }),
    prisma.patient.count({
      where: { isDeleted: false, user: { status: UserStatus.ACTIVE } },
    }),
    prisma.patient.count({
      where: { isDeleted: false, user: { status: UserStatus.BLOCKED } },
    }),
    prisma.doctor.count({ where: { isDeleted: false } }),
    prisma.doctor.count({
      where: { isDeleted: false, user: { status: UserStatus.ACTIVE } },
    }),
    prisma.doctor.count({
      where: { isDeleted: false, user: { status: UserStatus.BLOCKED } },
    }),
    prisma.doctor.count({ where: { isDeleted: false } }),
    prisma.doctor.count({
      where: {
        isDeleted: false,
        verificationStatus: DoctorVerificationStatus.PENDING,
      },
    }),
    prisma.doctor.count({
      where: {
        isDeleted: false,
        verificationStatus: DoctorVerificationStatus.APPROVED,
      },
    }),
    prisma.doctor.count({
      where: {
        isDeleted: false,
        verificationStatus: DoctorVerificationStatus.REJECTED,
      },
    }),
    appointmentStatusCounts(),
    paymentStats(),
    refundStats(),
    prisma.doctor.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        specialization: true,
        verificationStatus: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: recentLimit,
    }),
    prisma.appointment.findMany({
      select: {
        id: true,
        status: true,
        createdAt: true,
        schedule: { select: { date: true, startTime: true } },
        doctor: { select: { id: true, name: true } },
        patient: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: recentLimit,
    }),
    prisma.payment.findMany({
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
        appointment: {
          select: {
            patient: { select: { id: true, name: true } },
            doctor: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: recentLimit,
    }),
    prisma.refund.findMany({
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
        patient: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: recentLimit,
    }),
  ]);

  return {
    users: {
      totalPatients,
      totalDoctors,
      activePatients,
      blockedPatients,
      activeDoctors,
      blockedDoctors,
    },
    doctorApplications: {
      total: totalApplications,
      pending: pendingApplications,
      approved: approvedDoctors,
      rejected: rejectedApplications,
    },
    appointments,
    payments,
    refunds,
    recent: {
      doctorApplications: recentDoctorApplications,
      appointments: recentAppointments,
      payments: recentPayments,
      refunds: recentRefunds,
    },
  };
};

const getSuperAdminDashboard = async (): Promise<DashboardResult> => {
  const [
    totalUsers,
    totalPatients,
    totalDoctors,
    totalAdmins,
    totalSuperAdmins,
    activeUsers,
    blockedUsers,
    appointments,
    payments,
    refunds,
    doctorApplications,
    recentUsers,
    recentDoctorApplications,
    recentAppointments,
    recentPayments,
    recentRefunds,
  ] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.patient.count({ where: { isDeleted: false } }),
    prisma.doctor.count({ where: { isDeleted: false } }),
    prisma.user.count({ where: { isDeleted: false, role: Role.ADMIN } }),
    prisma.user.count({ where: { isDeleted: false, role: Role.SUPER_ADMIN } }),
    prisma.user.count({ where: { isDeleted: false, status: UserStatus.ACTIVE } }),
    prisma.user.count({ where: { isDeleted: false, status: UserStatus.BLOCKED } }),
    appointmentStatusCounts(),
    paymentStats(),
    refundStats(),
    Promise.all([
      prisma.doctor.count({ where: { isDeleted: false } }),
      prisma.doctor.count({
        where: {
          isDeleted: false,
          verificationStatus: DoctorVerificationStatus.PENDING,
        },
      }),
      prisma.doctor.count({
        where: {
          isDeleted: false,
          verificationStatus: DoctorVerificationStatus.APPROVED,
        },
      }),
      prisma.doctor.count({
        where: {
          isDeleted: false,
          verificationStatus: DoctorVerificationStatus.REJECTED,
        },
      }),
      prisma.doctor.count({
        where: {
          isDeleted: false,
          verificationStatus: DoctorVerificationStatus.APPROVED,
          user: { status: UserStatus.ACTIVE },
        },
      }),
      prisma.doctor.count({
        where: {
          isDeleted: false,
          user: { status: UserStatus.BLOCKED },
        },
      }),
    ]),
    prisma.user.findMany({
      where: { isDeleted: false },
      select: { id: true, name: true, role: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: recentLimit,
    }),
    prisma.doctor.findMany({
      where: { isDeleted: false },
      select: { id: true, name: true, verificationStatus: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: recentLimit,
    }),
    prisma.appointment.findMany({
      select: {
        id: true,
        status: true,
        createdAt: true,
        schedule: { select: { date: true, startTime: true } },
      },
      orderBy: { createdAt: "desc" },
      take: recentLimit,
    }),
    prisma.payment.findMany({
      select: { id: true, amount: true, currency: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: recentLimit,
    }),
    prisma.refund.findMany({
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: recentLimit,
    }),
  ]);

  const [totalApplications, pendingApplications, approvedDoctors, rejectedApplications, activeDoctors, blockedDoctors] =
    doctorApplications;

  return {
    users: { totalUsers, totalPatients, totalDoctors, totalAdmins, totalSuperAdmins, activeUsers, blockedUsers },
    doctorApplications: {
      total: totalApplications,
      pending: pendingApplications,
      approved: approvedDoctors,
      rejected: rejectedApplications,
      activeDoctors,
      blockedDoctors,
    },
    appointments,
    financial: {
      ...payments,
      completedRefunds: refunds.completed,
      totalRefundedAmount: refunds.totalRefundedAmount,
      pendingRefunds: refunds.pending,
      failedRefunds: refunds.failed,
      netCollectedAmount: payments.totalAmount - refunds.totalRefundedAmount,
    },
    recent: {
      users: recentUsers,
      doctorApplications: recentDoctorApplications,
      appointments: recentAppointments,
      payments: recentPayments,
      refunds: recentRefunds,
    },
  };
};

const getDoctorProfile = async (userId: string) => {
  const doctor = await prisma.doctor.findFirst({
    where: { userId, isDeleted: false },
    select: { id: true },
  });
  if (!doctor) throw new AppError(httpStatus.NOT_FOUND, "Doctor profile not found");
  return doctor;
};

const getPatientProfile = async (userId: string) => {
  const patient = await prisma.patient.findFirst({
    where: { userId, isDeleted: false },
    select: { id: true },
  });
  if (!patient) throw new AppError(httpStatus.NOT_FOUND, "Patient profile not found");
  return patient;
};

const getDoctorDashboard = async (userId: string): Promise<DashboardResult> => {
  const { id } = await getDoctorProfile(userId);
  const today = getBusinessDate();
  const [appointments, schedules, totalSlots, availableSlots, prescriptions, patients, recentAppointments, upcomingAppointments, recentPrescriptions] =
    await Promise.all([
      appointmentStatusCounts({ doctorId: id }),
      Promise.all([
        prisma.schedule.count({ where: { doctorId: id, isDeleted: false } }),
        prisma.schedule.count({
          where: { doctorId: id, isDeleted: false, status: ScheduleStatus.PUBLISHED },
        }),
        prisma.schedule.count({
          where: { doctorId: id, isDeleted: false, status: ScheduleStatus.DRAFT },
        }),
        prisma.schedule.count({ where: { doctorId: id, isDeleted: false, date: today } }),
      ]),
      prisma.slot.count({ where: { schedule: { doctorId: id, isDeleted: false } } }),
      prisma.slot.count({
        where: { schedule: { doctorId: id, isDeleted: false }, isBooked: false },
      }),
      prisma.prescription.count({ where: { doctorId: id } }),
      prisma.appointment.findMany({
        where: { doctorId: id, patientId: { not: null } },
        distinct: ["patientId"],
        select: { patient: { select: { id: true, name: true } } },
      }),
      prisma.appointment.findMany({
        where: { doctorId: id },
        select: {
          id: true,
          status: true,
          createdAt: true,
          patient: { select: { id: true, name: true } },
          schedule: { select: { date: true, startTime: true, endTime: true } },
        },
        orderBy: { createdAt: "desc" },
        take: recentLimit,
      }),
      prisma.appointment.findMany({
        where: {
          doctorId: id,
          status: { in: [AppointmentStatus.BOOKED, AppointmentStatus.CONFIRMED] },
          OR: [
            { schedule: { date: { gt: today } } },
            { schedule: { date: today, startTime: { gt: getZonedTime().currentTime } } },
          ],
        },
        select: {
          id: true,
          status: true,
          patient: { select: { id: true, name: true } },
          schedule: { select: { date: true, startTime: true, endTime: true } },
        },
        orderBy: [{ schedule: { date: "asc" } }, { serialNumber: "asc" }],
        take: recentLimit,
      }),
      prisma.prescription.findMany({
        where: { doctorId: id },
        select: {
          id: true,
          createdAt: true,
          patient: { select: { id: true, name: true } },
          appointment: { select: { id: true } },
        },
        orderBy: { createdAt: "desc" },
        take: recentLimit,
      }),
    ]);

  const [totalSchedules, publishedSchedules, draftSchedules, todaySchedules] = schedules;
  return {
    appointments,
    schedules: {
      total: totalSchedules,
      published: publishedSchedules,
      draft: draftSchedules,
      today: todaySchedules,
      totalSlots,
      availableSlots,
      bookedSlots: totalSlots - availableSlots,
    },
    prescriptions: { total: prescriptions, recent: recentPrescriptions },
    patients: { totalUnique: patients.length, recent: patients.slice(0, recentLimit) },
    recent: { appointments: recentAppointments, upcomingAppointments },
  };
};

const getPatientDashboard = async (userId: string): Promise<DashboardResult> => {
  const { id } = await getPatientProfile(userId);
  const today = getBusinessDate();
  const [appointments, prescriptions, payments, refunds, recentAppointments, upcomingAppointments, recentPrescriptions, recentRefunds] =
    await Promise.all([
      appointmentStatusCounts({ patientId: id }),
      prisma.prescription.count({ where: { patientId: id } }),
      paymentStats({ appointment: { patientId: id } }),
      refundStats({ patientId: id }),
      prisma.appointment.findMany({
        where: { patientId: id },
        select: {
          id: true,
          status: true,
          createdAt: true,
          doctor: { select: { id: true, name: true, specialization: true } },
          schedule: { select: { date: true, startTime: true, endTime: true } },
        },
        orderBy: { createdAt: "desc" },
        take: recentLimit,
      }),
      prisma.appointment.findMany({
        where: {
          patientId: id,
          status: { in: [AppointmentStatus.BOOKED, AppointmentStatus.CONFIRMED] },
          OR: [
            { schedule: { date: { gt: today } } },
            { schedule: { date: today, startTime: { gt: getZonedTime().currentTime } } },
          ],
        },
        select: {
          id: true,
          status: true,
          doctor: { select: { id: true, name: true } },
          schedule: { select: { date: true, startTime: true, endTime: true } },
        },
        orderBy: [{ schedule: { date: "asc" } }, { serialNumber: "asc" }],
        take: recentLimit,
      }),
      prisma.prescription.findMany({
        where: { patientId: id },
        select: { id: true, createdAt: true, doctor: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
        take: recentLimit,
      }),
      prisma.refund.findMany({
        where: { patientId: id },
        select: { id: true, amount: true, currency: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: recentLimit,
      }),
    ]);

  return {
    appointments,
    prescriptions: { total: prescriptions, recent: recentPrescriptions },
    payments,
    refunds: {
      total: refunds.total,
      completed: refunds.completed,
      totalRefundedAmount: refunds.totalRefundedAmount,
      pending: refunds.pending,
      recent: recentRefunds,
    },
    recent: { appointments: recentAppointments, upcomingAppointments },
  };
};

export const dashboardService = {
  getAdminDashboard,
  getDoctorDashboard,
  getPatientDashboard,
  getSuperAdminDashboard,
};
