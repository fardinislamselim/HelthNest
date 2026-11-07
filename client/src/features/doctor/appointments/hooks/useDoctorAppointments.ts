"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { doctorAppointmentService } from "../services/appointment.service";
import type {
  DoctorAppointmentFilterParams,
  DoctorAppointmentsListResponse,
} from "../types/appointment.types";

export const DOCTOR_APPOINTMENTS_QUERY_KEY = ["doctor", "appointments"] as const;

export function useDoctorAppointments(initialFilters: DoctorAppointmentFilterParams = {}) {
  const [filters, setFilters] = useState<DoctorAppointmentFilterParams>({
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  const query = useQuery<DoctorAppointmentsListResponse, Error>({
    queryKey: [...DOCTOR_APPOINTMENTS_QUERY_KEY, filters],
    queryFn: async () => {
      const res = await doctorAppointmentService.getMyAppointments(filters);
      return res.data;
    },
    staleTime: 30 * 1000,
  });

  return {
    appointments: query.data?.appointments ?? [],
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    filters,
    setFilters,
    setPage: (page: number) => setFilters((prev) => ({ ...prev, page })),
    setStatus: (status?: DoctorAppointmentFilterParams["status"]) =>
      setFilters((prev) => ({ ...prev, status, page: 1 })),
    setDate: (date?: string) =>
      setFilters((prev) => ({ ...prev, date, page: 1 })),
  };
}

export default useDoctorAppointments;
