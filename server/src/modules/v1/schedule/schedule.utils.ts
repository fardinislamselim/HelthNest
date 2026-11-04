/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

import config from "@/config";
import { ScheduleStatus, AppointmentStatus } from "../../../../generated/prisma/enums";

/**
 * Extract zoned date and time parts from a Date object
 */
export const getZonedTime = (
  date: Date = new Date(),
  timeZone: string = config.timezone || "Asia/Dhaka",
): {
  todayDate: string; // YYYY-MM-DD
  currentTime: string; // HH:mm
  currentDateTimeStr: string; // YYYY-MM-DDTHH:mm:ss
} => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "00";

  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");
  const second = get("second");

  return {
    todayDate: `${year}-${month}-${day}`,
    currentTime: `${hour}:${minute}`,
    currentDateTimeStr: `${year}-${month}-${day}T${hour}:${minute}:${second}`,
  };
};

/**
 * Determine if a slot is available for patient booking
 */
export const isSlotAvailable = (slot: {
  isBooked: boolean;
  appointment?: { status: AppointmentStatus } | null;
}): boolean => {
  if (slot.isBooked) return false;
  if (slot.appointment && slot.appointment.status !== AppointmentStatus.CANCELLED) {
    return false;
  }
  return true;
};

/**
 * Check if a schedule is eligible for patient visibility
 */
export const isScheduleVisibleForPatient = (
  schedule: {
    date: string;
    startTime: string;
    status: ScheduleStatus;
    isDeleted?: boolean;
    slots?: {
      isBooked: boolean;
      appointment?: { status: AppointmentStatus } | null;
    }[];
  },
  referenceDate: Date = new Date(),
  timeZone: string = config.timezone || "Asia/Dhaka",
): boolean => {
  if (schedule.isDeleted) return false;
  if (schedule.status !== ScheduleStatus.PUBLISHED) return false;

  const { todayDate, currentTime } = getZonedTime(referenceDate, timeZone);

  // Rule 1: Today's schedules only
  if (schedule.date !== todayDate) return false;

  // Rule 3: Disappear when start time arrives (strictly greater than currentTime)
  if (schedule.startTime <= currentTime) return false;

  // Rule 4: Must have at least one available slot
  if (!schedule.slots || !schedule.slots.some(isSlotAvailable)) {
    return false;
  }

  return true;
};

