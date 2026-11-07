"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { doctorAppointmentService } from "../services/appointment.service";
import { DOCTOR_APPOINTMENTS_QUERY_KEY } from "./useDoctorAppointments";
import { DOCTOR_APPOINTMENT_DETAILS_QUERY_KEY } from "./useDoctorAppointmentDetails";
import { DOCTOR_DASHBOARD_QUERY_KEY } from "@/features/doctor/dashboard/hooks/useDoctorDashboard";
import { getApiErrorMessage } from "@/lib/api/errors";

export function useConsultationLifecycle() {
  const queryClient = useQueryClient();

  const invalidateAppointments = () => {
    queryClient.invalidateQueries({ queryKey: DOCTOR_APPOINTMENTS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: DOCTOR_APPOINTMENT_DETAILS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: DOCTOR_DASHBOARD_QUERY_KEY });
  };

  const startMutation = useMutation({
    mutationFn: (appointmentId: string) =>
      doctorAppointmentService.startAppointment(appointmentId),
    onSuccess: (res) => {
      toast.success(res.message || "Consultation started! Status is now ONGOING.");
      invalidateAppointments();
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  const completeMutation = useMutation({
    mutationFn: (appointmentId: string) =>
      doctorAppointmentService.completeAppointment(appointmentId),
    onSuccess: (res) => {
      toast.success(res.message || "Consultation marked as COMPLETED! You can now write a digital prescription.");
      invalidateAppointments();
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  return {
    startAppointment: startMutation.mutateAsync,
    isStarting: startMutation.isPending,
    completeAppointment: completeMutation.mutateAsync,
    isCompleting: completeMutation.isPending,
  };
}

export default useConsultationLifecycle;
