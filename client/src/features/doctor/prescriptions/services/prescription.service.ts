import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  DoctorPrescriptionItem,
  CreatePrescriptionPayload,
} from "../types/prescription.types";

interface PrescriptionBackendPayload {
  prescription?: DoctorPrescriptionItem;
  [key: string]: unknown;
}

export const doctorPrescriptionService = {
  createPrescription: async (
    payload: CreatePrescriptionPayload,
  ): Promise<ApiResponse<DoctorPrescriptionItem>> => {
    const response = await apiClient.post<ApiResponse<PrescriptionBackendPayload>>(
      API_ENDPOINTS.PRESCRIPTIONS.CREATE,
      payload,
    );
    const rawData = response.data?.data;
    const prescription = (rawData?.prescription ?? rawData) as DoctorPrescriptionItem;
    return {
      ...response.data,
      data: prescription,
    };
  },

  getPrescriptionById: async (
    prescriptionId: string,
  ): Promise<ApiResponse<DoctorPrescriptionItem>> => {
    const response = await apiClient.get<ApiResponse<PrescriptionBackendPayload>>(
      API_ENDPOINTS.PRESCRIPTIONS.BY_ID(prescriptionId),
    );
    const rawData = response.data?.data;
    const prescription = (rawData?.prescription ?? rawData) as DoctorPrescriptionItem;
    return {
      ...response.data,
      data: prescription,
    };
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

export default doctorPrescriptionService;
