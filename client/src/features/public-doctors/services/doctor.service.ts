import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  PublicDoctorItem,
  PublicDoctorDetails,
  PublicDoctorFilterParams,
  PublicDoctorsListResponse,
} from "../types/doctor.types";

export const publicDoctorService = {
  getDoctors: async (
    params?: PublicDoctorFilterParams,
  ): Promise<ApiResponse<PublicDoctorsListResponse>> => {
    const response = await apiClient.get<ApiResponse<PublicDoctorItem[]>>(
      API_ENDPOINTS.DOCTORS.PUBLIC_LIST,
      { params },
    );

    const doctors = Array.isArray(response.data?.data) ? response.data.data : [];
    const meta = response.data?.meta || {
      page: 1,
      limit: 12,
      total: doctors.length,
      totalPage: 1,
    };

    return {
      ...response.data,
      data: {
        doctors,
        meta,
      },
    };
  },

  getDoctorById: async (
    doctorId: string,
  ): Promise<ApiResponse<PublicDoctorDetails>> => {
    const response = await apiClient.get<ApiResponse<PublicDoctorDetails>>(
      API_ENDPOINTS.DOCTORS.PUBLIC_BY_ID(doctorId),
    );

    return response.data;
  },
};

export default publicDoctorService;
