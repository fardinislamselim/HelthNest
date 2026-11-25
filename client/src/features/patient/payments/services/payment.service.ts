import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  PatientRefundRecord,
  PaymentVerificationResult,
  RefundQueryParams,
} from "../types/payment.types";

export const patientPaymentService = {
  getMyRefunds: async (
    params?: RefundQueryParams,
  ): Promise<ApiResponse<PatientRefundRecord[]>> => {
    const response = await apiClient.get<ApiResponse<PatientRefundRecord[]>>(
      API_ENDPOINTS.REFUNDS.MY_REFUNDS,
      { params },
    );
    return response.data;
  },

  /**
   * Confirms a Stripe Checkout session with the backend so the appointment is
   * marked paid/booked even when the Stripe webhook cannot be delivered.
   */
  verifyPayment: async (
    appointmentId: string,
    sessionId?: string,
  ): Promise<PaymentVerificationResult> => {
    const response = await apiClient.post<ApiResponse<PaymentVerificationResult>>(
      API_ENDPOINTS.PAYMENTS.VERIFY,
      { appointmentId, sessionId },
    );
    const data = response.data?.data;
    if (!data) {
      throw new Error("Payment verification returned no data");
    }
    return data;
  },
};

export default patientPaymentService;
