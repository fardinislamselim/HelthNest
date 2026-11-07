import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  PatientRefundRecord,
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
};

export default patientPaymentService;
