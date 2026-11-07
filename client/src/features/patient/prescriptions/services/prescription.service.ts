import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  PatientPrescriptionItem,
  PrescriptionQueryParams,
} from "../types/prescription.types";

export const patientPrescriptionService = {
  getMyPrescriptions: async (
    params?: PrescriptionQueryParams,
  ): Promise<ApiResponse<PatientPrescriptionItem[]>> => {
    const response = await apiClient.get<ApiResponse<PatientPrescriptionItem[]>>(
      API_ENDPOINTS.PRESCRIPTIONS.MY_PRESCRIPTIONS,
      { params },
    );
    return response.data;
  },

  getPrescriptionById: async (
    prescriptionId: string,
  ): Promise<ApiResponse<PatientPrescriptionItem>> => {
    const response = await apiClient.get<ApiResponse<PatientPrescriptionItem>>(
      API_ENDPOINTS.PRESCRIPTIONS.BY_ID(prescriptionId),
    );
    return response.data;
  },

  downloadPdf: async (prescriptionId: string): Promise<Blob> => {
    const response = await apiClient.get(
      API_ENDPOINTS.PRESCRIPTIONS.PDF(prescriptionId),
      {
        responseType: "blob",
      },
    );
    return response.data as Blob;
  },
};

export default patientPrescriptionService;
