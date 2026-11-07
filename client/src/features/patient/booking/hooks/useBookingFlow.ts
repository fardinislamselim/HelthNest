"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { patientBookingService } from "../services/booking.service";
import { getApiErrorMessage } from "@/lib/api/errors";
import { TODAY_SCHEDULES_QUERY_KEY } from "@/features/patient/schedules/hooks/useTodaySchedules";
import { SCHEDULE_SLOTS_QUERY_KEY } from "@/features/patient/schedules/hooks/useScheduleSlots";
import { APPOINTMENTS_QUERY_KEY } from "@/features/patient/appointments/hooks/useAppointments";
import { PATIENT_DASHBOARD_QUERY_KEY } from "@/features/patient/dashboard/hooks/usePatientDashboard";

export function useBookingFlow() {
  const queryClient = useQueryClient();
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  const bookingMutation = useMutation({
    mutationFn: async ({
      scheduleId,
      slotId,
    }: {
      scheduleId: string;
      slotId: string;
    }) => {
      // 1. Create appointment in PENDING status
      const apptRes = await patientBookingService.createAppointment({
        scheduleId,
        slotId,
      });

      const appointmentId = apptRes.data?.id;
      if (!appointmentId) {
        throw new Error("Failed to initialize appointment record");
      }

      // 2. Initiate Stripe Checkout session
      const checkoutRes = await patientBookingService.createCheckoutSession(
        appointmentId,
      );

      const paymentUrl = checkoutRes.data?.paymentUrl;
      if (!paymentUrl) {
        throw new Error("Failed to generate secure checkout link");
      }

      return {
        appointmentId,
        paymentUrl,
      };
    },
    onSuccess: (data) => {
      // Invalidate schedule and slot queries so UI reflects slot reservation
      queryClient.invalidateQueries({ queryKey: TODAY_SCHEDULES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SCHEDULE_SLOTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PATIENT_DASHBOARD_QUERY_KEY });

      toast.success("Booking initiated! Redirecting to secure Stripe Checkout...");
      setIsRedirecting(true);

      // Redirect to Stripe Checkout
      window.location.href = data.paymentUrl;
    },
    onError: (err: unknown) => {
      setIsRedirecting(false);
      toast.error(getApiErrorMessage(err));
    },
  });

  return {
    initiateBooking: bookingMutation.mutateAsync,
    isBooking: bookingMutation.isPending || isRedirecting,
    error: bookingMutation.error,
  };
}

export default useBookingFlow;
