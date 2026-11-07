"use client";

import { useQuery } from "@tanstack/react-query";
import { patientAppointmentService } from "../services/appointment.service";
import type { PatientAppointmentItem } from "../types/appointment.types";

export const APPOINTMENT_DETAIL_QUERY_KEY = ["appointment", "detail"] as const;

export function useAppointmentDetails(appointmentId: string) {
  const query = useQuery<PatientAppointmentItem, Error>({
    queryKey: [...APPOINTMENT_DETAIL_QUERY_KEY, appointmentId],
    queryFn: async () => {
      if (!appointmentId) throw new Error("Appointment ID is required");
      const res = await patientAppointmentService.getAppointmentById(appointmentId);
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

export default useAppointmentDetails;
