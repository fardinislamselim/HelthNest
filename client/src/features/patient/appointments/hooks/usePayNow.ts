"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { patientAppointmentService } from "../services/appointment.service";
import { getApiErrorMessage } from "@/lib/api/errors";
import { APPOINTMENTS_QUERY_KEY } from "./useAppointments";
import { APPOINTMENT_DETAIL_QUERY_KEY } from "./useAppointmentDetails";
import { PATIENT_DASHBOARD_QUERY_KEY } from "@/features/patient/dashboard/hooks/usePatientDashboard";

/**
 * Re-initiates payment for an existing appointment left in PENDING status and
 * redirects the patient to a fresh Stripe Checkout session.
 */
export function usePayNow() {
  const queryClient = useQueryClient();
  const [payingAppointmentId, setPayingAppointmentId] =
    React.useState<string | null>(null);

  const mutation = useMutation<{ paymentUrl: string }, Error, string>({
    mutationFn: async (appointmentId: string) => {
      const res = await patientAppointmentService.initiatePayment(appointmentId);
      const paymentUrl = res.data?.paymentUrl;
      if (!paymentUrl) {
        throw new Error("Failed to generate secure checkout link");
      }
      return { paymentUrl };
    },
    onMutate: (appointmentId) => {
      setPayingAppointmentId(appointmentId);
    },
    onSuccess: ({ paymentUrl }) => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_DETAIL_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PATIENT_DASHBOARD_QUERY_KEY });

      toast.success("Redirecting to secure Stripe Checkout...");
      window.location.href = paymentUrl;
    },
    onError: (err: unknown) => {
      setPayingAppointmentId(null);
      toast.error(getApiErrorMessage(err));
    },
  });

  return {
    payNow: mutation.mutate,
    payingAppointmentId,
    isInitiatingPayment: mutation.isPending,
  };
}

export default usePayNow;
