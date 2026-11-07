"use client";

import { useQuery } from "@tanstack/react-query";
import { patientAppointmentService } from "../services/appointment.service";
import type {
  PatientAppointmentItem,
  AppointmentQueryParams,
} from "../types/appointment.types";

export const APPOINTMENTS_QUERY_KEY = ["appointments", "patient"] as const;

export function useAppointments(params: AppointmentQueryParams = {}) {
  const query = useQuery<{
    appointments: PatientAppointmentItem[];
    meta?: { page: number; limit: number; total: number; totalPage: number };
  }, Error>({
    queryKey: [...APPOINTMENTS_QUERY_KEY, params],
    queryFn: async () => {
      const res = await patientAppointmentService.getAppointments(params);
      return {
        appointments: res.data || [],
        meta: res.meta,
      };
    },
    staleTime: 30 * 1000,
  });

  return {
    appointments: query.data?.appointments ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

export default useAppointments;
