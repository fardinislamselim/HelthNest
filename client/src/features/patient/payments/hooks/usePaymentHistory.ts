"use client";

import { useQuery } from "@tanstack/react-query";
import { patientPaymentService } from "../services/payment.service";
import { patientAppointmentService } from "@/features/patient/appointments/services/appointment.service";
import { patientDashboardService } from "@/features/patient/dashboard/services/dashboard.service";
import type { PatientRefundRecord, RefundQueryParams } from "../types/payment.types";
import type { PatientAppointmentItem } from "@/features/patient/appointments/types/appointment.types";

export const REFUNDS_QUERY_KEY = ["refunds", "my-refunds"] as const;

export function usePaymentHistory(refundParams: RefundQueryParams = {}) {
  // Query refunds
  const refundsQuery = useQuery<{
    refunds: PatientRefundRecord[];
    meta?: { page: number; limit: number; total: number; totalPage: number };
  }, Error>({
    queryKey: [...REFUNDS_QUERY_KEY, refundParams],
    queryFn: async () => {
      const res = await patientPaymentService.getMyRefunds(refundParams);
      return {
        refunds: res.data || [],
        meta: res.meta,
      };
    },
    staleTime: 60 * 1000,
  });

  // Query appointments with payments
  const appointmentsQuery = useQuery<PatientAppointmentItem[], Error>({
    queryKey: ["appointments", "payment-history"],
    queryFn: async () => {
      const res = await patientAppointmentService.getAppointments({ limit: 100 });
      return res.data || [];
    },
    staleTime: 60 * 1000,
  });

  // Query dashboard statistics for financial summary
  const dashboardStatsQuery = useQuery({
    queryKey: ["patient", "dashboard", "financials"],
    queryFn: async () => {
      const res = await patientDashboardService.getDashboardStats();
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  // Filter appointments that have a payment record
  const paidAppointments = (appointmentsQuery.data ?? []).filter(
    (appt) => appt.payment !== null && appt.payment !== undefined,
  );

  const isLoading =
    refundsQuery.isLoading ||
    appointmentsQuery.isLoading ||
    dashboardStatsQuery.isLoading;

  return {
    refunds: refundsQuery.data?.refunds ?? [],
    refundsMeta: refundsQuery.data?.meta,
    paidAppointments,
    financialStats: {
      totalAmount: dashboardStatsQuery.data?.payments.totalAmount ?? 0,
      successfulCount: dashboardStatsQuery.data?.payments.successfulCount ?? 0,
      totalRefundedAmount: dashboardStatsQuery.data?.refunds.totalRefundedAmount ?? 0,
      completedRefunds: dashboardStatsQuery.data?.refunds.completed ?? 0,
      pendingRefunds: dashboardStatsQuery.data?.refunds.pending ?? 0,
    },
    isLoading,
    isError: refundsQuery.isError || appointmentsQuery.isError,
    error: refundsQuery.error || appointmentsQuery.error,
    refetchAll: () => {
      refundsQuery.refetch();
      appointmentsQuery.refetch();
      dashboardStatsQuery.refetch();
    },
  };
}

export default usePaymentHistory;
