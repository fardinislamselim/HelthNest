import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type { RegisterDoctorInput } from "@/types/auth";
import { authService } from "@/features/auth/services/auth.service";

export const doctorService = {
  // Apply as Doctor
  apply: (payload: RegisterDoctorInput) => authService.registerDoctor(payload),

  // Verify Doctor Email
  verifyEmail: (payload: { email: string; otp: string }) =>
    authService.verifyDoctorEmail(payload),

  // Resend Doctor Verification OTP
  resendOtp: (payload: { email: string }) =>
    authService.resendDoctorOtp(payload),

  // Get Doctors Available Today
  getDoctorsAvailableToday: async () => {
    const response = await apiClient.get<ApiResponse<unknown>>(
      API_ENDPOINTS.DOCTORS.AVAILABLE_TODAY,
    );
    return response.data;
  },
};

export default doctorService;
