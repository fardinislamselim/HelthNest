import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  PatientAppointmentItem,
  CancelAppointmentResponseData,
  AppointmentQueryParams,
} from "../types/appointment.types";

export const patientAppointmentService = {
  getAppointments: async (
    params?: AppointmentQueryParams,
  ): Promise<ApiResponse<PatientAppointmentItem[]>> => {
    // Filter out empty string filters
    const cleanParams: Record<string, unknown> = {};
    if (params?.page) cleanParams.page = params.page;
    if (params?.limit) cleanParams.limit = params.limit;
    if (params?.status) cleanParams.status = params.status;
    if (params?.date) cleanParams.date = params.date;

    const response = await apiClient.get<ApiResponse<PatientAppointmentItem[]>>(
      API_ENDPOINTS.APPOINTMENTS.MY_APPOINTMENTS,
      { params: cleanParams },
    );
    return response.data;
  },

  getAppointmentById: async (
    appointmentId: string,
  ): Promise<ApiResponse<PatientAppointmentItem>> => {
    const response = await apiClient.get<ApiResponse<PatientAppointmentItem>>(
      API_ENDPOINTS.APPOINTMENTS.BY_ID(appointmentId),
    );
    return response.data;
  },

  cancelAppointment: async (
    appointmentId: string,
  ): Promise<ApiResponse<CancelAppointmentResponseData>> => {
    const response = await apiClient.patch<ApiResponse<CancelAppointmentResponseData>>(
      API_ENDPOINTS.APPOINTMENTS.CANCEL(appointmentId),
    );
    return response.data;
  },
};

export default patientAppointmentService;
