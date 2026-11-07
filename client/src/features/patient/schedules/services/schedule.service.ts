import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  PatientScheduleItem,
  PatientScheduleSlotsResponse,
} from "../types/schedule.types";

export const patientScheduleService = {
  getTodaySchedules: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PatientScheduleItem[]>> => {
    const response = await apiClient.get<ApiResponse<PatientScheduleItem[]>>(
      API_ENDPOINTS.SCHEDULES.TODAY,
      { params },
    );
    return response.data;
  },

  getScheduleSlots: async (
    scheduleId: string,
  ): Promise<ApiResponse<PatientScheduleSlotsResponse>> => {
    const response = await apiClient.get<ApiResponse<PatientScheduleSlotsResponse>>(
      API_ENDPOINTS.SCHEDULES.SLOTS(scheduleId),
    );
    return response.data;
  },
};

export default patientScheduleService;
