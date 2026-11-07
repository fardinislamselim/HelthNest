"use client";

import { useQuery } from "@tanstack/react-query";
import { patientScheduleService } from "../services/schedule.service";
import type { PatientScheduleSlotsResponse } from "../types/schedule.types";

export const SCHEDULE_SLOTS_QUERY_KEY = ["schedules", "slots"] as const;

export function useScheduleSlots(scheduleId: string | null) {
  const query = useQuery<PatientScheduleSlotsResponse, Error>({
    queryKey: [...SCHEDULE_SLOTS_QUERY_KEY, scheduleId],
    queryFn: async () => {
      if (!scheduleId) throw new Error("Schedule ID is required");
      const res = await patientScheduleService.getScheduleSlots(scheduleId);
      return res.data;
    },
    enabled: Boolean(scheduleId),
    staleTime: 15 * 1000,
  });

  return {
    slotsData: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useScheduleSlots;
