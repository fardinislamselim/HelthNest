"use client";

import { useQuery } from "@tanstack/react-query";
import { publicDoctorService } from "../services/doctor.service";
import type { PublicDoctorSchedulesResponse } from "../types/doctor.types";

export const PUBLIC_DOCTOR_SCHEDULES_QUERY_KEY = [
  "public",
  "doctors",
  "schedules",
] as const;

export function usePublicDoctorSchedules(doctorId: string, date: string) {
  const query = useQuery<PublicDoctorSchedulesResponse, Error>({
    queryKey: [...PUBLIC_DOCTOR_SCHEDULES_QUERY_KEY, doctorId, date],
    queryFn: async () => {
      const res = await publicDoctorService.getDoctorSchedules(doctorId, date);
      return res.data;
    },
    enabled: Boolean(doctorId && date),
    staleTime: 30 * 1000,
  });

  return {
    schedule: query.data?.schedule ?? null,
    slots: query.data?.slots ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export default usePublicDoctorSchedules;
