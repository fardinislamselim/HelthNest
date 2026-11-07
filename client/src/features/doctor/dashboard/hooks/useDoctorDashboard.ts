"use client";

import { useQuery } from "@tanstack/react-query";
import { doctorDashboardService } from "../services/dashboard.service";
import type { DoctorDashboardData } from "../types/dashboard.types";

export const DOCTOR_DASHBOARD_QUERY_KEY = ["doctor", "dashboard"] as const;

export function useDoctorDashboard() {
  const query = useQuery<DoctorDashboardData, Error>({
    queryKey: DOCTOR_DASHBOARD_QUERY_KEY,
    queryFn: async () => {
      const res = await doctorDashboardService.getDashboardStats();
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  return {
    dashboardData: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

export default useDoctorDashboard;
