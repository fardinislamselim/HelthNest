"use client";

import { useQuery } from "@tanstack/react-query";
import { patientScheduleService } from "../services/schedule.service";
import type { PatientScheduleItem } from "../types/schedule.types";

export const TODAY_SCHEDULES_QUERY_KEY = ["schedules", "today"] as const;

export function useTodaySchedules(page = 1, limit = 50) {
  const query = useQuery<PatientScheduleItem[], Error>({
    queryKey: [...TODAY_SCHEDULES_QUERY_KEY, { page, limit }],
    queryFn: async () => {
      const res = await patientScheduleService.getTodaySchedules({ page, limit });
      return res.data || [];
    },
    staleTime: 30 * 1000, // 30 seconds fresh
    refetchInterval: 60 * 1000, // Background poll every minute to keep slots current
  });

  return {
    schedules: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

export default useTodaySchedules;
