import type { UserProfile, PatientProfile, DoctorProfile } from "./user";

export interface RegisterPatientInput {
  name: string;
  email: string;
  password: string;
  contactNumber?: string;
  address?: string;
}

export interface RegisterDoctorInput {
  name: string;
  email: string;
  password?: string;
  specialization: string;
  licenseNumber: string;
  qualifications: string;
  experienceYears: number;
  consultationFee?: number;
  contactNumber?: string;
  address?: string;
  bio?: string;
  resume?: File | null;
  additionalFiles?: File[];
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface GoogleLoginInput {
  idToken: string;
}

export interface VerifyEmailInput {
  email: string;
  otp: string;
}

export interface ResendOtpInput {
  email: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  needPasswordChange?: boolean;
  user?: UserProfile & {
    doctor?: DoctorProfile | null;
    patient?: PatientProfile | null;
  };
}

export interface RegisterPatientResponseData {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
  patient: PatientProfile;
  devOtp?: string;
}

export interface DoctorApplicationStatusResponse {
  name: string;
  email: string;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
}
