import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type { DoctorDashboardData } from "../types/dashboard.types";

export const doctorDashboardService = {
  getDashboardStats: async (): Promise<ApiResponse<DoctorDashboardData>> => {
    const response = await apiClient.get<ApiResponse<DoctorDashboardData>>(
      API_ENDPOINTS.DASHBOARD.DOCTOR,
    );
    return response.data;
  },
};

export default doctorDashboardService;
