"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { patientScheduleService } from "../services/schedule.service";
import type { PatientScheduleItem } from "../types/schedule.types";

export const TODAY_SCHEDULES_QUERY_KEY = ["schedules", "today"] as const;

const EMPTY_SCHEDULES: PatientScheduleItem[] = [];

export function useTodaySchedules(page = 1, limit = 50) {
  const queryKey = React.useMemo(
    () => [...TODAY_SCHEDULES_QUERY_KEY, page, limit] as const,
    [page, limit],
  );

  const query = useQuery<PatientScheduleItem[], Error>({
    queryKey,
    queryFn: async () => {
      const res = await patientScheduleService.getTodaySchedules({ page, limit });
      return res.data || [];
    },
    staleTime: 30 * 1000, // 30 seconds fresh
    refetchInterval: 60 * 1000, // Background poll every minute to keep slots current
  });

  const schedules = React.useMemo(
    () => query.data ?? EMPTY_SCHEDULES,
    [query.data],
  );

  return {
    schedules,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

export default useTodaySchedules;
