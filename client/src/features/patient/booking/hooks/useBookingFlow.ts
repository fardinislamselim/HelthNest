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
import type {
  AppointmentCreationResult,
  CreateAppointmentResponseData,
} from "../types/booking.types";

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
      // 1. Create appointment in PENDING status.
      // The backend responds with `data: { appointment, payment }`, where
      // `payment` is the Stripe Checkout session created along with it.
      const apptRes = await patientBookingService.createAppointment({
        scheduleId,
        slotId,
      });

      // Handle both `{ success, data: { appointment, payment } }` and direct `{ appointment, payment }` or flat `{ id, paymentUrl }` shapes
      const rawBody = apptRes as unknown as Record<string, unknown>;
      const dataLayer = (
        rawBody?.data && typeof rawBody.data === "object" ? rawBody.data : rawBody
      ) as Partial<AppointmentCreationResult> &
        Partial<CreateAppointmentResponseData> & {
          appointmentId?: string;
          paymentUrl?: string;
          url?: string;
          payment?: { paymentUrl?: string; url?: string } | null;
        };

      const appointmentObj = (dataLayer?.appointment ?? dataLayer) as
        | (Partial<CreateAppointmentResponseData> & { appointmentId?: string })
        | undefined;

      const appointmentId =
        appointmentObj?.id ||
        appointmentObj?.appointmentId ||
        dataLayer?.appointmentId ||
        dataLayer?.id;

      if (!appointmentId) {
        throw new Error("Failed to initialize appointment record");
      }

      // 2. Use the checkout session returned with the appointment; only request
      // a new one when the backend did not include it.
      let paymentUrl =
        dataLayer?.payment?.paymentUrl ||
        dataLayer?.payment?.url ||
        dataLayer?.paymentUrl ||
        dataLayer?.url;
      if (!paymentUrl) {
        const checkoutRes = await patientBookingService.createCheckoutSession(
          appointmentId,
        );
        paymentUrl = checkoutRes.data?.paymentUrl;
      }

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
