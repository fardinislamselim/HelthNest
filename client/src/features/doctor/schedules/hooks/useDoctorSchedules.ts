"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { doctorScheduleService } from "../services/schedule.service";
import type { ScheduleFilterParams, DoctorSchedulesListResponse } from "../types/schedule.types";

export const DOCTOR_SCHEDULES_QUERY_KEY = ["doctor", "schedules"] as const;

export function useDoctorSchedules(initialFilters: ScheduleFilterParams = {}) {
  const [filters, setFilters] = useState<ScheduleFilterParams>({
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  const query = useQuery<DoctorSchedulesListResponse, Error>({
    queryKey: [...DOCTOR_SCHEDULES_QUERY_KEY, filters],
    queryFn: async () => {
      const res = await doctorScheduleService.getMySchedules(filters);
      return res.data;
    },
    staleTime: 30 * 1000,
  });

  return {
    schedules: query.data?.schedules ?? [],
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    filters,
    setFilters,
    setPage: (page: number) => setFilters((prev) => ({ ...prev, page })),
    setStatus: (status?: ScheduleFilterParams["status"]) =>
      setFilters((prev) => ({ ...prev, status, page: 1 })),
    setDateRange: (startDate?: string, endDate?: string) =>
      setFilters((prev) => ({ ...prev, startDate, endDate, page: 1 })),
  };
}

export default useDoctorSchedules;
