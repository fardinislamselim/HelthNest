"use client";

import { useQuery } from "@tanstack/react-query";
import { doctorDashboardService } from "@/features/doctor/dashboard/services/dashboard.service";
import type { DoctorDashboardData } from "@/features/doctor/dashboard/types/dashboard.types";

export const DOCTOR_ANALYTICS_QUERY_KEY = ["doctor", "analytics"] as const;

export function useDoctorAnalytics() {
  const query = useQuery<DoctorDashboardData, Error>({
    queryKey: DOCTOR_ANALYTICS_QUERY_KEY,
    queryFn: async () => {
      const res = await doctorDashboardService.getDashboardStats();
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  const appointments = query.data?.appointments;
  const schedules = query.data?.schedules;

  const totalAppointments = appointments?.total ?? 0;
  const completedAppointments = appointments?.completed ?? 0;
  const cancelledAppointments = appointments?.cancelled ?? 0;

  const completionRate =
    totalAppointments > 0
      ? Math.round((completedAppointments / totalAppointments) * 100)
      : 0;

  const cancellationRate =
    totalAppointments > 0
      ? Math.round((cancelledAppointments / totalAppointments) * 100)
      : 0;

  const totalSlots = schedules?.totalSlots ?? 0;
  const bookedSlots = schedules?.bookedSlots ?? 0;

  const slotUtilizationRate =
    totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;

  return {
    dashboardData: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    metrics: {
      completionRate,
      cancellationRate,
      slotUtilizationRate,
      totalPatients: query.data?.patients.totalUnique ?? 0,
      totalPrescriptions: query.data?.prescriptions.total ?? 0,
    },
  };
}

export default useDoctorAnalytics;
