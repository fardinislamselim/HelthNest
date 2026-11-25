import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  AppointmentCreationResult,
  CreateAppointmentPayload,
  CheckoutResponseData,
} from "../types/booking.types";

export const patientBookingService = {
  createAppointment: async (
    payload: CreateAppointmentPayload,
  ): Promise<ApiResponse<AppointmentCreationResult>> => {
    const response = await apiClient.post<ApiResponse<AppointmentCreationResult>>(
      API_ENDPOINTS.APPOINTMENTS.CREATE,
      payload,
    );
    return response.data;
  },

  createCheckoutSession: async (
    appointmentId: string,
  ): Promise<ApiResponse<CheckoutResponseData>> => {
    const response = await apiClient.post<ApiResponse<CheckoutResponseData>>(
      API_ENDPOINTS.PAYMENTS.CHECKOUT(appointmentId),
    );
    return response.data;
  },
};

export default patientBookingService;
