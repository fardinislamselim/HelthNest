/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

import config from "@/config";

// Calculates exact UTC Date for a schedule date ("YYYY-MM-DD") and start time ("HH:mm")
export const getScheduleStartDateTime = (
  dateStr: string,
  timeStr: string,
  timeZone: string = config.timezone || "Asia/Dhaka",
): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);

  // Guess UTC timestamp
  const guess = Date.UTC(year, month - 1, day, hours, minutes);

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

  const parts = formatter.formatToParts(new Date(guess));
  const findVal = (type: string) => parts.find((p) => p.type === type)?.value || "00";

  const formattedGuessMs = Date.UTC(
    Number(findVal("year")),
    Number(findVal("month")) - 1,
    Number(findVal("day")),
    Number(findVal("hour")),
    Number(findVal("minute")),
    Number(findVal("second")),
  );

  const offset = formattedGuessMs - guess;
  return new Date(guess - offset);
};

// Determines if a cancellation is eligible for a refund based on the cancellation time and the schedule start time.
export const isEligibleForRefund = (
  cancellationTime: Date,
  scheduleStartTime: Date,
): boolean => {
  const oneHourInMs = 60 * 60 * 1000;
  return cancellationTime.getTime() < scheduleStartTime.getTime() - oneHourInMs;
};

