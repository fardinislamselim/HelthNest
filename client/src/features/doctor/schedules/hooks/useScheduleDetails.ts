"use client";

import { useQuery } from "@tanstack/react-query";
import { doctorScheduleService } from "../services/schedule.service";
import type { DoctorScheduleItem } from "../types/schedule.types";

export const SCHEDULE_DETAILS_QUERY_KEY = ["doctor", "schedule", "details"] as const;

export function useScheduleDetails(scheduleId: string) {
  const query = useQuery<DoctorScheduleItem, Error>({
    queryKey: [...SCHEDULE_DETAILS_QUERY_KEY, scheduleId],
    queryFn: async () => {
      const res = await doctorScheduleService.getScheduleById(scheduleId);
      return res.data;
    },
    enabled: Boolean(scheduleId),
    staleTime: 30 * 1000,
  });

  return {
    schedule: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useScheduleDetails;
