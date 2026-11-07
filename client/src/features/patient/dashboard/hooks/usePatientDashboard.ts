"use client";

import { useQuery } from "@tanstack/react-query";
import { patientDashboardService } from "../services/dashboard.service";
import type { PatientDashboardData } from "../types/dashboard.types";

export const PATIENT_DASHBOARD_QUERY_KEY = ["patient", "dashboard"] as const;

export function usePatientDashboard() {
  const query = useQuery<PatientDashboardData, Error>({
    queryKey: PATIENT_DASHBOARD_QUERY_KEY,
    queryFn: async () => {
      const res = await patientDashboardService.getDashboardStats();
      return res.data;
    },
    staleTime: 60 * 1000, // 1 minute
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

export default usePatientDashboard;
