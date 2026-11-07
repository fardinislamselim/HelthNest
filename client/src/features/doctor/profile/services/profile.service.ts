import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type { FullDoctorProfile, UpdateDoctorProfilePayload } from "../types/profile.types";

export const doctorProfileService = {
  getProfile: async (): Promise<ApiResponse<FullDoctorProfile>> => {
    const response = await apiClient.get<ApiResponse<FullDoctorProfile>>(
      API_ENDPOINTS.USERS.ME,
    );
    return response.data;
  },

  updateProfile: async (
    payload: UpdateDoctorProfilePayload,
  ): Promise<ApiResponse<FullDoctorProfile>> => {
    const response = await apiClient.patch<ApiResponse<FullDoctorProfile>>(
      API_ENDPOINTS.USERS.UPDATE_ME,
      payload,
    );
    return response.data;
  },

  uploadProfileImage: async (file: File): Promise<ApiResponse<FullDoctorProfile>> => {
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await apiClient.patch<ApiResponse<FullDoctorProfile>>(
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

export default doctorProfileService;
