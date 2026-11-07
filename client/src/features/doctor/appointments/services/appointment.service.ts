import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse, ApiMeta } from "@/types/api";
import type {
  DoctorAppointmentItem,
  DoctorAppointmentsListResponse,
  DoctorAppointmentFilterParams,
} from "../types/appointment.types";

interface AppointmentBackendPayload {
  appointment?: DoctorAppointmentItem;
  appointments?: DoctorAppointmentItem[];
  meta?: ApiMeta;
  [key: string]: unknown;
}

export const doctorAppointmentService = {
  getMyAppointments: async (
    params?: DoctorAppointmentFilterParams,
  ): Promise<ApiResponse<DoctorAppointmentsListResponse>> => {
    const response = await apiClient.get<ApiResponse<AppointmentBackendPayload | DoctorAppointmentItem[]>>(
      API_ENDPOINTS.APPOINTMENTS.DOCTOR_APPOINTMENTS,
      { params },
    );
    const rawData = response.data?.data;
    let appointments: DoctorAppointmentItem[] = [];
    let meta = response.data?.meta;

    if (Array.isArray(rawData)) {
      appointments = rawData;
    } else if (rawData && typeof rawData === "object") {
      appointments = (rawData.appointments as DoctorAppointmentItem[]) || [];
      meta = meta || (rawData.meta as ApiMeta);
    }

    return {
      ...response.data,
      data: {
        appointments,
        meta: meta || { page: 1, limit: 10, total: appointments.length, totalPage: 1 },
      },
    };
  },

  getAppointmentById: async (
    appointmentId: string,
  ): Promise<ApiResponse<DoctorAppointmentItem>> => {
    const response = await apiClient.get<ApiResponse<AppointmentBackendPayload>>(
      API_ENDPOINTS.APPOINTMENTS.BY_ID(appointmentId),
    );
    const rawData = response.data?.data;
    const appointment = (rawData?.appointment ?? rawData) as DoctorAppointmentItem;
    return {
      ...response.data,
      data: appointment,
    };
  },

  startAppointment: async (
    appointmentId: string,
  ): Promise<ApiResponse<DoctorAppointmentItem>> => {
    const response = await apiClient.patch<ApiResponse<AppointmentBackendPayload>>(
      API_ENDPOINTS.APPOINTMENTS.START(appointmentId),
    );
    const rawData = response.data?.data;
    const appointment = (rawData?.appointment ?? rawData) as DoctorAppointmentItem;
    return {
      ...response.data,
      data: appointment,
    };
  },

  completeAppointment: async (
    appointmentId: string,
  ): Promise<ApiResponse<DoctorAppointmentItem>> => {
    const response = await apiClient.patch<ApiResponse<AppointmentBackendPayload>>(
      API_ENDPOINTS.APPOINTMENTS.COMPLETE(appointmentId),
    );
    const rawData = response.data?.data;
    const appointment = (rawData?.appointment ?? rawData) as DoctorAppointmentItem;
    return {
      ...response.data,
      data: appointment,
    };
  },
};

export default doctorAppointmentService;
