"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { patientAppointmentService } from "../services/appointment.service";
import { getApiErrorMessage } from "@/lib/api/errors";
import { APPOINTMENTS_QUERY_KEY } from "./useAppointments";
import { APPOINTMENT_DETAIL_QUERY_KEY } from "./useAppointmentDetails";
import { PATIENT_DASHBOARD_QUERY_KEY } from "@/features/patient/dashboard/hooks/usePatientDashboard";
import { REFUNDS_QUERY_KEY } from "@/features/patient/payments/hooks/usePaymentHistory";
import type { CancelAppointmentResponseData } from "../types/appointment.types";

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  const mutation = useMutation<CancelAppointmentResponseData, Error, string>({
    mutationFn: async (appointmentId: string) => {
      const res = await patientAppointmentService.cancelAppointment(appointmentId);
      return res.data;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_DETAIL_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PATIENT_DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: REFUNDS_QUERY_KEY });

      // Display authoritative backend message
      if (data.refundEligible) {
        toast.success(data.message || "Appointment cancelled. Eligible refund processed.");
      } else {
        toast.info(data.message || "Appointment cancelled. No refund issued as per policy.");
      }
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  return {
    cancelAppointment: mutation.mutateAsync,
    isCancelling: mutation.isPending,
    error: mutation.error,
  };
}

export default useCancelAppointment;
