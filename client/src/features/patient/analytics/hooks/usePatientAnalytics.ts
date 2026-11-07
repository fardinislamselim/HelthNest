"use client";

import { useQuery } from "@tanstack/react-query";
import { patientDashboardService } from "@/features/patient/dashboard/services/dashboard.service";
import { patientAppointmentService } from "@/features/patient/appointments/services/appointment.service";
import type { PatientAppointmentItem } from "@/features/patient/appointments/types/appointment.types";

export function usePatientAnalytics() {
  const dashboardQuery = useQuery({
    queryKey: ["patient", "dashboard", "analytics"],
    queryFn: async () => {
      const res = await patientDashboardService.getDashboardStats();
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  const appointmentsQuery = useQuery<PatientAppointmentItem[], Error>({
    queryKey: ["patient", "appointments", "all-analytics"],
    queryFn: async () => {
      const res = await patientAppointmentService.getAppointments({ limit: 100 });
      return res.data || [];
    },
    staleTime: 60 * 1000,
  });

  const appointments = appointmentsQuery.data ?? [];
  const d = dashboardQuery.data;

  const total = d?.appointments.total ?? appointments.length;
  const completed = d?.appointments.completed ?? appointments.filter((a) => a.status === "COMPLETED").length;
  const cancelled = d?.appointments.cancelled ?? appointments.filter((a) => a.status === "CANCELLED").length;
  const booked = d?.appointments.booked ?? appointments.filter((a) => a.status === "BOOKED").length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const cancellationRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;

  // Breakdown by doctor specialization
  const specialtyCounts: Record<string, number> = {};
  appointments.forEach((appt) => {
    const spec = appt.doctor?.specialization || "General Medicine";
    specialtyCounts[spec] = (specialtyCounts[spec] || 0) + 1;
  });

  const specialties = Object.entries(specialtyCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const isLoading = dashboardQuery.isLoading || appointmentsQuery.isLoading;
  const isError = dashboardQuery.isError || appointmentsQuery.isError;
  const error = dashboardQuery.error || appointmentsQuery.error;

  return {
    total,
    completed,
    cancelled,
    booked,
    completionRate,
    cancellationRate,
    totalPaidAmount: d?.payments.totalAmount ?? 0,
    totalRefundedAmount: d?.refunds.totalRefundedAmount ?? 0,
    successfulCount: d?.payments.successfulCount ?? 0,
    specialties,
    hasData: total > 0,
    isLoading,
    isError,
    error,
    refetch: () => {
      dashboardQuery.refetch();
      appointmentsQuery.refetch();
    },
  };
}

export default usePatientAnalytics;
