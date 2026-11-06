import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type { UserProfile } from "@/types/user";
import type {
  RegisterPatientInput,
  RegisterDoctorInput,
  LoginInput,
  VerifyEmailInput,
  ResendOtpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  LoginResponseData,
  RegisterPatientResponseData,
} from "@/types/auth";

export const authService = {
  // Patient Registration
  registerPatient: async (
    payload: RegisterPatientInput,
  ): Promise<ApiResponse<RegisterPatientResponseData>> => {
    const response = await apiClient.post<
      ApiResponse<RegisterPatientResponseData>
    >(API_ENDPOINTS.AUTH.REGISTER, payload);
    return response.data;
  },
  
  // Doctor Application / Registration (multipart with resume & files)
  registerDoctor: async (
    payload: RegisterDoctorInput,
  ): Promise<ApiResponse<unknown>> => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("email", payload.email);
    if (payload.password) formData.append("password", payload.password);
    formData.append("specialization", payload.specialization);
    formData.append("licenseNumber", payload.licenseNumber);
    formData.append("qualifications", payload.qualifications);
    formData.append("experienceYears", String(payload.experienceYears));
    if (payload.consultationFee !== undefined) {
      formData.append("consultationFee", String(payload.consultationFee));
    }
    if (payload.contactNumber)
      formData.append("contactNumber", payload.contactNumber);
    if (payload.address) formData.append("address", payload.address);
    if (payload.bio) formData.append("bio", payload.bio);

    if (payload.resume) {
      formData.append("resume", payload.resume);
    }
    if (payload.additionalFiles && payload.additionalFiles.length > 0) {
      payload.additionalFiles.forEach((file) => {
        formData.append("additionalFiles", file);
      });
    }

    const response = await apiClient.post<ApiResponse<unknown>>(
      API_ENDPOINTS.DOCTORS.APPLY,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  // Login
  login: async (
    payload: LoginInput,
  ): Promise<ApiResponse<LoginResponseData>> => {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload,
    );
    return response.data;
  },

  // Google Login
  googleLogin: async (
    idToken: string,
  ): Promise<ApiResponse<LoginResponseData>> => {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>(
      API_ENDPOINTS.AUTH.GOOGLE_LOGIN,
      { idToken },
    );
    return response.data;
  },

  // Verify Patient Email
  verifyPatientEmail: async (
    payload: VerifyEmailInput,
  ): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post<ApiResponse<unknown>>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      payload,
    );
    return response.data;
  },

  // Verify Doctor Email
  verifyDoctorEmail: async (
    payload: VerifyEmailInput,
  ): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post<ApiResponse<unknown>>(
      API_ENDPOINTS.DOCTORS.VERIFY_EMAIL,
      payload,
    );
    return response.data;
  },

  // Resend Patient OTP
  resendPatientOtp: async (
    payload: ResendOtpInput,
  ): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post<ApiResponse<unknown>>(
      API_ENDPOINTS.AUTH.RESEND_OTP,
      payload,
    );
    return response.data;
  },

  // Resend Doctor OTP
  resendDoctorOtp: async (
    payload: ResendOtpInput,
  ): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post<ApiResponse<unknown>>(
      API_ENDPOINTS.DOCTORS.RESEND_OTP,
      payload,
    );
    return response.data;
  },

  // Get Current User (loads full profile with patient & doctor data)
  getCurrentUser: async (): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
      API_ENDPOINTS.AUTH.ME,
    );
    return response.data;
  },

  // Request Password Reset OTP
  forgotPassword: async (
    payload: ForgotPasswordInput,
  ): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post<ApiResponse<unknown>>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      payload,
    );
    return response.data;
  },

  // Reset Password using OTP
  resetPassword: async (
    payload: ResetPasswordInput,
  ): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.patch<ApiResponse<unknown>>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      payload,
    );
    return response.data;
  },

  // Logout (clears HTTP-only cookies on backend)
  logout: async (): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post<ApiResponse<unknown>>(
      API_ENDPOINTS.AUTH.LOGOUT,
    );
    return response.data;
  },
};

export default authService;
