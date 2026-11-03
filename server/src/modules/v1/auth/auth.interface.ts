import type { Role } from "../../../../generated/prisma/enums";

// Register Patient Payload
export interface IRegisterPatientPayload {
  name: string;
  email: string;
  password: string;
  contactNumber?: string;
  address?: string;
}

// Login User Payload
export interface ILoginUserPayload {
  email: string;
  password: string;
}

// Google Login Payload
export interface IGoogleLoginPayload {
  idToken: string;
}

// Refresh Token Payload
export interface IRefreshTokenPayload {
  refreshToken: string;
}

// Forgot Password Payload
export interface IForgotPasswordPayload {
  email: string;
}

// Reset Password Payload
export interface IResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface IVerifyEmailPayload {
  email: string;
  otp: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ISetPasswordPayload {
  newPassword: string;
}

// Request User Interface
export interface IRequestUser {
  userId: string;
  email: string;
  name: string;
  role: Role;
}
