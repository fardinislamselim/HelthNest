import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type { FullPatientProfile, UpdatePatientProfilePayload } from "../types/profile.types";

export const patientProfileService = {
  getProfile: async (): Promise<ApiResponse<FullPatientProfile>> => {
    const response = await apiClient.get<ApiResponse<FullPatientProfile>>(
      API_ENDPOINTS.USERS.ME,
    );
    return response.data;
  },

  updateProfile: async (
    payload: UpdatePatientProfilePayload,
  ): Promise<ApiResponse<FullPatientProfile>> => {
    const response = await apiClient.patch<ApiResponse<FullPatientProfile>>(
      API_ENDPOINTS.USERS.UPDATE_ME,
      payload,
    );
    return response.data;
  },

  uploadProfileImage: async (file: File): Promise<ApiResponse<FullPatientProfile>> => {
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await apiClient.patch<ApiResponse<FullPatientProfile>>(
      API_ENDPOINTS.USERS.PROFILE_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};

export default patientProfileService;
