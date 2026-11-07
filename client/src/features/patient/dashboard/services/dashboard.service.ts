import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type { PatientDashboardData } from "../types/dashboard.types";

export const patientDashboardService = {
  getDashboardStats: async (): Promise<ApiResponse<PatientDashboardData>> => {
    const response = await apiClient.get<ApiResponse<PatientDashboardData>>(
      API_ENDPOINTS.DASHBOARD.PATIENT,
    );
    return response.data;
  },
};

export default patientDashboardService;
