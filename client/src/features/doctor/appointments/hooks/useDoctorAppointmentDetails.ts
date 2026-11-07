"use client";

import { useQuery } from "@tanstack/react-query";
import { doctorAppointmentService } from "../services/appointment.service";
import type { DoctorAppointmentItem } from "../types/appointment.types";

export const DOCTOR_APPOINTMENT_DETAILS_QUERY_KEY = ["doctor", "appointment", "details"] as const;

export function useDoctorAppointmentDetails(appointmentId: string) {
  const query = useQuery<DoctorAppointmentItem, Error>({
    queryKey: [...DOCTOR_APPOINTMENT_DETAILS_QUERY_KEY, appointmentId],
    queryFn: async () => {
      const res = await doctorAppointmentService.getAppointmentById(appointmentId);
      return res.data;
    },
    enabled: Boolean(appointmentId),
    staleTime: 30 * 1000,
  });

  return {
    appointment: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useDoctorAppointmentDetails;
