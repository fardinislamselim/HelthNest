"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { patientScheduleService } from "../services/schedule.service";
import type {
  PatientScheduleItem,
  UpcomingScheduleFilterParams,
} from "../types/schedule.types";

export const UPCOMING_SCHEDULES_QUERY_KEY = ["schedules", "upcoming"] as const;

const EMPTY_SCHEDULES: PatientScheduleItem[] = [];

export function useUpcomingSchedules(params?: UpcomingScheduleFilterParams) {
  const startDate = params?.startDate ?? "";
  const specialization = params?.specialization ?? "";
  const doctorId = params?.doctorId ?? "";
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 50;

  const queryKey = React.useMemo(
    () => [
      ...UPCOMING_SCHEDULES_QUERY_KEY,
      startDate,
      specialization,
      doctorId,
      page,
      limit,
    ] as const,
    [startDate, specialization, doctorId, page, limit],
  );

  const queryParams = React.useMemo(
    () => ({
      startDate: startDate || undefined,
      specialization: specialization || undefined,
      doctorId: doctorId || undefined,
      page,
      limit,
    }),
    [startDate, specialization, doctorId, page, limit],
  );

  const query = useQuery<PatientScheduleItem[], Error>({
    queryKey,
    queryFn: async () => {
      const res = await patientScheduleService.getUpcomingSchedules(queryParams);
      return res.data || [];
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
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

export default useUpcomingSchedules;
