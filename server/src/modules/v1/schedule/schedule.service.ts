/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

import httpStatus from "http-status";
import { prisma } from "@/lib/prisma";
import AppError from "@/middleware/AppError";
import { Prisma } from "../../../../generated/prisma/client";
import { ScheduleStatus, AppointmentStatus } from "../../../../generated/prisma/enums";
import {
  ICreateSchedulePayload,
  IUpdateSchedulePayload,
  IScheduleFilterQuery,
  ISchedulesListResult,
  IScheduleResponse,
  IPatientTodaySchedulesResult,
  IPatientScheduleSlotsResponse,
  IPatientAvailableDoctorItem,
  IPatientAvailableScheduleItem,
  IPatientSlotItem,
} from "./schedule.interface";
import {
  timeToMinutes,
  minutesToTime,
} from "./schedule.validation";
import {
  getZonedTime,
  isSlotAvailable,
  isScheduleVisibleForPatient,
} from "./schedule.utils";

/**
 * Generate 20-minute slots from startTime to endTime
 */
export const generateSlots = (startTime: string, endTime: string) => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const slots: { serialNumber: number; startTime: string; endTime: string }[] = [];

  let serial = 1;
  for (let time = startMinutes; time + 20 <= endMinutes; time += 20) {
    slots.push({
      serialNumber: serial++,
      startTime: minutesToTime(time),
      endTime: minutesToTime(time + 20),
    });
  }

  return slots;
};

/**
 * Retrieve authenticated doctor profile from User.id
 */
const getDoctorByUserId = async (userId: string) => {
  const doctor = await prisma.doctor.findFirst({
    where: { userId, isDeleted: false },
  });

  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor profile not found");
  }

  return doctor;
};

/**
 * Common select/include shape for schedules
 */
const scheduleInclude = {
  slots: {
    orderBy: { serialNumber: "asc" as const },
    include: {
      appointments: {
        select: {
          id: true,
          status: true,
          patientId: true,
        },
      },
    },
  },
};

/**
 * Create a new consultation schedule with generated 20-minute slots.
 */
const createSchedule = async (
  userId: string,
  payload: ICreateSchedulePayload,
): Promise<IScheduleResponse> => {
  const doctor = await getDoctorByUserId(userId);

  // Rule 1: One Schedule Per Calendar Date
  const existingSchedule = await prisma.schedule.findFirst({
    where: {
      doctorId: doctor.id,
      date: payload.date,
      isDeleted: false,
    },
  });

  if (existingSchedule) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A schedule already exists for this date",
    );
  }

  // Rule 6: Automatic Slot Generation in 20-minute intervals
  const slots = generateSlots(payload.startTime, payload.endTime);

  try {
    const createdSchedule = await prisma.$transaction(async (tx) => {
      return tx.schedule.create({
        data: {
          doctorId: doctor.id,
          date: payload.date,
          startTime: payload.startTime,
          endTime: payload.endTime,
          meetLink: payload.meetLink,
          status: ScheduleStatus.DRAFT, // Rule 5: Default status = DRAFT
          totalSlots: slots.length,
          slots: {
            create: slots.map((s) => ({
              serialNumber: s.serialNumber,
              startTime: s.startTime,
              endTime: s.endTime,
              isBooked: false,
            })),
          },
        },
        include: scheduleInclude,
      });
    });

    return createdSchedule as unknown as IScheduleResponse;
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new AppError(
        httpStatus.CONFLICT,
        "A schedule already exists for this date",
      );
    }
    throw error;
  }
};

/**
 * Retrieve all schedules belonging to the authenticated doctor with pagination and filtering.
 */
const getMySchedules = async (
  userId: string,
  query: IScheduleFilterQuery = {},
): Promise<ISchedulesListResult> => {
  const doctor = await getDoctorByUserId(userId);

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const whereClause: Prisma.ScheduleWhereInput = {
    doctorId: doctor.id,
    isDeleted: false,
  };

  if (query.status) {
    whereClause.status = query.status;
  }

  if (query.startDate || query.endDate) {
    whereClause.date = {};
    if (query.startDate) {
      whereClause.date.gte = query.startDate;
    }
    if (query.endDate) {
      whereClause.date.lte = query.endDate;
    }
  }

  const [total, schedules] = await Promise.all([
    prisma.schedule.count({ where: whereClause }),
    prisma.schedule.findMany({
      where: whereClause,
      include: scheduleInclude,
      skip,
      take: limit,
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    }),
  ]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return {
    schedules: schedules as unknown as IScheduleResponse[],
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

/**
 * Retrieve details of a specific schedule belonging to the authenticated doctor.
 */
const getScheduleById = async (
  userId: string,
  scheduleId: string,
): Promise<IScheduleResponse> => {
  const doctor = await getDoctorByUserId(userId);

  const schedule = await prisma.schedule.findFirst({
    where: {
      id: scheduleId,
      isDeleted: false,
    },
    include: scheduleInclude,
  });

  // Verify existence and ownership: return 404 if schedule doesn't exist or belongs to another doctor
  if (!schedule || schedule.doctorId !== doctor.id) {
    throw new AppError(httpStatus.NOT_FOUND, "Schedule not found");
  }

  return schedule as unknown as IScheduleResponse;
};

/**
 * Update an existing schedule respecting date-lock and booking-lock rules.
 */
const updateSchedule = async (
  userId: string,
  scheduleId: string,
  payload: IUpdateSchedulePayload,
): Promise<IScheduleResponse> => {
  const doctor = await getDoctorByUserId(userId);

  const schedule = await prisma.schedule.findFirst({
    where: {
      id: scheduleId,
      isDeleted: false,
    },
    include: {
      slots: true,
      appointments: true,
    },
  });

  if (!schedule || schedule.doctorId !== doctor.id) {
    throw new AppError(httpStatus.NOT_FOUND, "Schedule not found");
  }

  const hasBookings =
    schedule.slots.some((s) => s.isBooked) || schedule.appointments.length > 0;

  // Rule 8: Published Schedule Date Lock
  if (payload.date && payload.date !== schedule.date) {
    if (schedule.status !== ScheduleStatus.DRAFT) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Cannot modify date of a published schedule",
      );
    }

    // Check duplicate schedule on the new date
    const duplicate = await prisma.schedule.findFirst({
      where: {
        doctorId: doctor.id,
        date: payload.date,
        id: { not: scheduleId },
        isDeleted: false,
      },
    });

    if (duplicate) {
      throw new AppError(
        httpStatus.CONFLICT,
        "A schedule already exists for this date",
      );
    }
  }

  // Rule 9: Time Range Modification Check
  const isStartTimeChanged =
    payload.startTime !== undefined && payload.startTime !== schedule.startTime;
  const isEndTimeChanged =
    payload.endTime !== undefined && payload.endTime !== schedule.endTime;

  if (isStartTimeChanged || isEndTimeChanged) {
    if (hasBookings) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Cannot modify schedule times after bookings have been made",
      );
    }

    const effectiveStartTime = payload.startTime ?? schedule.startTime;
    const effectiveEndTime = payload.endTime ?? schedule.endTime;

    const startMinutes = timeToMinutes(effectiveStartTime);
    const endMinutes = timeToMinutes(effectiveEndTime);

    if (startMinutes >= endMinutes) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Schedule must start and end on the same calendar date and cannot cross midnight",
      );
    }

    const duration = endMinutes - startMinutes;
    if (duration < 180) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Schedule duration must be at least 3 hours (180 minutes)",
      );
    }
    if (duration > 480) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Schedule duration must not exceed 8 hours (480 minutes)",
      );
    }
  }

  // Perform updates transactionally
  try {
    const updated = await prisma.$transaction(async (tx) => {
      const timeChanged = isStartTimeChanged || isEndTimeChanged;
      let totalSlots = schedule.totalSlots;

      if (timeChanged) {
        const effectiveStartTime = payload.startTime ?? schedule.startTime;
        const effectiveEndTime = payload.endTime ?? schedule.endTime;
        const newSlots = generateSlots(effectiveStartTime, effectiveEndTime);
        totalSlots = newSlots.length;

        // Delete old unbooked slots and create new ones
        await tx.slot.deleteMany({
          where: { scheduleId: schedule.id },
        });

        await tx.slot.createMany({
          data: newSlots.map((s) => ({
            scheduleId: schedule.id,
            serialNumber: s.serialNumber,
            startTime: s.startTime,
            endTime: s.endTime,
            isBooked: false,
          })),
        });
      }

      return tx.schedule.update({
        where: { id: scheduleId },
        data: {
          ...(payload.date ? { date: payload.date } : {}),
          ...(payload.startTime ? { startTime: payload.startTime } : {}),
          ...(payload.endTime ? { endTime: payload.endTime } : {}),
          ...(payload.meetLink ? { meetLink: payload.meetLink } : {}),
          ...(timeChanged ? { totalSlots } : {}),
        },
        include: scheduleInclude,
      });
    });

    return updated as unknown as IScheduleResponse;
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new AppError(
        httpStatus.CONFLICT,
        "A schedule already exists for this date",
      );
    }
    throw error;
  }
};

/**
 * Publish a draft or unpublished schedule.
 */
const publishSchedule = async (
  userId: string,
  scheduleId: string,
): Promise<IScheduleResponse> => {
  const doctor = await getDoctorByUserId(userId);

  const schedule = await prisma.schedule.findFirst({
    where: {
      id: scheduleId,
      isDeleted: false,
    },
  });

  if (!schedule || schedule.doctorId !== doctor.id) {
    throw new AppError(httpStatus.NOT_FOUND, "Schedule not found");
  }

  if (schedule.status === ScheduleStatus.PUBLISHED) {
    throw new AppError(httpStatus.CONFLICT, "Schedule is already published");
  }

  const updated = await prisma.schedule.update({
    where: { id: scheduleId },
    data: { status: ScheduleStatus.PUBLISHED },
    include: scheduleInclude,
  });

  return updated as unknown as IScheduleResponse;
};

/**
 * Unpublish an existing published schedule.
 */
const unpublishSchedule = async (
  userId: string,
  scheduleId: string,
): Promise<IScheduleResponse> => {
  const doctor = await getDoctorByUserId(userId);

  const schedule = await prisma.schedule.findFirst({
    where: {
      id: scheduleId,
      isDeleted: false,
    },
  });

  if (!schedule || schedule.doctorId !== doctor.id) {
    throw new AppError(httpStatus.NOT_FOUND, "Schedule not found");
  }

  if (schedule.status === ScheduleStatus.UNPUBLISHED) {
    throw new AppError(httpStatus.CONFLICT, "Schedule is already unpublished");
  }

  if (schedule.status === ScheduleStatus.DRAFT) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Draft schedules cannot be unpublished",
    );
  }

  const updated = await prisma.schedule.update({
    where: { id: scheduleId },
    data: { status: ScheduleStatus.UNPUBLISHED },
    include: scheduleInclude,
  });

  return updated as unknown as IScheduleResponse;
};

/**
 * Delete a schedule only when it contains no booked appointments.
 */
const deleteSchedule = async (
  userId: string,
  scheduleId: string,
): Promise<null> => {
  const doctor = await getDoctorByUserId(userId);

  const schedule = await prisma.schedule.findFirst({
    where: {
      id: scheduleId,
      isDeleted: false,
    },
    include: {
      slots: true,
      appointments: true,
    },
  });

  if (!schedule || schedule.doctorId !== doctor.id) {
    throw new AppError(httpStatus.NOT_FOUND, "Schedule not found");
  }

  const hasBookings =
    schedule.slots.some((s) => s.isBooked) || schedule.appointments.length > 0;

  if (hasBookings) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Cannot delete schedule with booked appointments",
    );
  }

  await prisma.$transaction(async (tx) => {
    // Delete unbooked slots safely
    await tx.slot.deleteMany({
      where: { scheduleId },
    });

    // Delete schedule
    await tx.schedule.delete({
      where: { id: scheduleId },
    });
  });

  return null;
};

/**
 * Patient: Retrieve all doctors' schedules available for booking today
 */
const getTodayAvailableSchedules = async (
  query: { page?: number | string; limit?: number | string } = {},
): Promise<IPatientTodaySchedulesResult> => {
  const { todayDate, currentTime } = getZonedTime();

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  // Filter for today's published, unexpired schedules with available slots
  const whereClause: Prisma.ScheduleWhereInput = {
    date: todayDate,
    status: ScheduleStatus.PUBLISHED,
    isDeleted: false,
    startTime: {
      gt: currentTime,
    },
    doctor: {
      isDeleted: false,
    },
    slots: {
      some: {
        isBooked: false,
        OR: [
          { appointments: { none: { status: { not: AppointmentStatus.CANCELLED } } } },
        ],
      },
    },
  };

  const [total, rawSchedules] = await Promise.all([
    prisma.schedule.count({ where: whereClause }),
    prisma.schedule.findMany({
      where: whereClause,
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            experienceYears: true,
            consultationFee: true,
            user: {
              select: {
                profileImageUrl: true,
              },
            },
          },
        },
        slots: {
          select: {
            id: true,
            isBooked: true,
            appointments: {
              select: {
                status: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { startTime: "asc" },
    }),
  ]);

  const schedules: IPatientAvailableScheduleItem[] = rawSchedules.map((schedule) => {
    const availableSlots = schedule.slots.filter(isSlotAvailable).length;

    return {
      id: schedule.id,
      scheduleId: schedule.id,
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      status: schedule.status,
      totalSlots: schedule.totalSlots,
      availableSlots,
      doctor: {
        id: schedule.doctor.id,
        doctorId: schedule.doctor.id,
        name: schedule.doctor.name,
        specialization: schedule.doctor.specialization,
        profileImage: schedule.doctor.user?.profileImageUrl || null,
        experienceYears: schedule.doctor.experienceYears,
        consultationFee: schedule.doctor.consultationFee
          ? Number(schedule.doctor.consultationFee)
          : null,
      },
    };
  });

  const totalPages = Math.ceil(total / limit);

  return {
    schedules,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

/**
 * Patient: Retrieve available slots for an eligible schedule
 */
const getScheduleAvailableSlots = async (
  scheduleId: string,
): Promise<IPatientScheduleSlotsResponse> => {
  const schedule = await prisma.schedule.findFirst({
    where: {
      id: scheduleId,
      isDeleted: false,
    },
    include: {
      slots: {
        orderBy: { serialNumber: "asc" },
        include: {
          appointments: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!schedule) {
    throw new AppError(httpStatus.NOT_FOUND, "Schedule not found");
  }

  // Check all patient visibility rules (today only, published, start time not arrived, not fully booked)
  const isEligible = isScheduleVisibleForPatient(schedule);

  if (!isEligible) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Schedule not found or no longer available for booking",
    );
  }

  const slots: IPatientSlotItem[] = schedule.slots.map((slot) => ({
    id: slot.id,
    slotId: slot.id,
    serialNumber: slot.serialNumber,
    startTime: slot.startTime,
    endTime: slot.endTime,
    isAvailable: isSlotAvailable(slot),
  }));

  return {
    scheduleId: schedule.id,
    date: schedule.date,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    totalSlots: schedule.totalSlots,
    slots,
  };
};

/**
 * Patient: Retrieve unique doctors with at least one available schedule today
 */
const getDoctorsAvailableToday = async (): Promise<IPatientAvailableDoctorItem[]> => {
  const { todayDate, currentTime } = getZonedTime();

  const schedules = await prisma.schedule.findMany({
    where: {
      date: todayDate,
      status: ScheduleStatus.PUBLISHED,
      isDeleted: false,
      startTime: {
        gt: currentTime,
      },
      doctor: {
        isDeleted: false,
      },
      slots: {
        some: {
          isBooked: false,
          OR: [
            { appointments: { none: { status: { not: AppointmentStatus.CANCELLED } } } },
          ],
        },
      },
    },
    include: {
      doctor: {
        select: {
          id: true,
          name: true,
          specialization: true,
          experienceYears: true,
          consultationFee: true,
          user: {
            select: {
              profileImageUrl: true,
            },
          },
        },
      },
      slots: {
        select: {
          id: true,
          isBooked: true,
          appointments: {
            select: {
              status: true,
            },
          },
        },
      },
    },
    orderBy: { startTime: "asc" },
  });

  const doctorMap = new Map<string, IPatientAvailableDoctorItem>();

  for (const schedule of schedules) {
    const availableSlots = schedule.slots.filter(isSlotAvailable).length;
    if (availableSlots === 0) {
      continue;
    }

    const doctor = schedule.doctor;
    const existing = doctorMap.get(doctor.id);

    if (existing) {
      existing.availableScheduleCount += 1;
      existing.availableSlotCount += availableSlots;
    } else {
      doctorMap.set(doctor.id, {
        id: doctor.id,
        doctorId: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        profileImage: doctor.user?.profileImageUrl || null,
        experienceYears: doctor.experienceYears,
        consultationFee: doctor.consultationFee
          ? Number(doctor.consultationFee)
          : null,
        availableScheduleCount: 1,
        availableSlotCount: availableSlots,
      });
    }
  }

  return Array.from(doctorMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
};

export const scheduleService = {
  createSchedule,
  getMySchedules,
  getScheduleById,
  updateSchedule,
  publishSchedule,
  unpublishSchedule,
  deleteSchedule,
  getTodayAvailableSchedules,
  getScheduleAvailableSlots,
  getDoctorsAvailableToday,
};
