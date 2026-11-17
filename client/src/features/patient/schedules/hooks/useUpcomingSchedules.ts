"use client";

import { useQuery } from "@tanstack/react-query";
import { patientScheduleService } from "../services/schedule.service";
import type {
  PatientScheduleItem,
  UpcomingScheduleFilterParams,
} from "../types/schedule.types";

export const UPCOMING_SCHEDULES_QUERY_KEY = ["schedules", "upcoming"] as const;

export function useUpcomingSchedules(params?: UpcomingScheduleFilterParams) {
  const query = useQuery<PatientScheduleItem[], Error>({
    queryKey: [...UPCOMING_SCHEDULES_QUERY_KEY, params],
    queryFn: async () => {
      const res = await patientScheduleService.getUpcomingSchedules(params);
      return res.data || [];
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
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

export default useUpcomingSchedules;
