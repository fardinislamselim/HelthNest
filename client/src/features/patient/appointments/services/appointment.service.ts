import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  PatientAppointmentItem,
  CancelAppointmentResponseData,
  AppointmentQueryParams,
} from "../types/appointment.types";
import type { CheckoutResponseData } from "@/features/patient/booking/types/booking.types";

interface AppointmentDetailPayload {
  appointment?: PatientAppointmentItem;
  [key: string]: unknown;
}

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
    const response = await apiClient.get<ApiResponse<AppointmentDetailPayload>>(
      API_ENDPOINTS.APPOINTMENTS.BY_ID(appointmentId),
    );
    // The API wraps the record as { data: { appointment } }; tolerate a flat
    // payload as well so a shape change can never crash the details page.
    const rawData = response.data?.data;
    const appointment = (rawData?.appointment ?? rawData) as
      | PatientAppointmentItem
      | undefined;
    if (!appointment || typeof appointment !== "object" || Array.isArray(appointment)) {
      throw new Error("Appointment details are unavailable");
    }
    return {
      ...response.data,
      data: appointment,
    };
  },

  cancelAppointment: async (
    appointmentId: string,
  ): Promise<ApiResponse<CancelAppointmentResponseData>> => {
    const response = await apiClient.patch<ApiResponse<CancelAppointmentResponseData>>(
      API_ENDPOINTS.APPOINTMENTS.CANCEL(appointmentId),
    );
    return response.data;
  },

  /**
   * Creates a fresh Stripe Checkout session for an existing appointment whose
   * payment is still pending (e.g. the patient abandoned the payment page).
   */
  initiatePayment: async (
    appointmentId: string,
  ): Promise<ApiResponse<CheckoutResponseData>> => {
    const response = await apiClient.post<ApiResponse<CheckoutResponseData>>(
      API_ENDPOINTS.PAYMENTS.CHECKOUT(appointmentId),
    );
    return response.data;
  },
};

export default patientAppointmentService;
