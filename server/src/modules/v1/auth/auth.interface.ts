/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

import type { Role } from "../../../../generated/prisma/enums";

/**
 * Register Patient Payload
 */
export interface IRegisterPatientPayload {
  name: string;
  email: string;
  password: string;
  contactNumber?: string;
  address?: string;
}

/**
 * Login User Payload
 */
export interface ILoginUserPayload {
  email: string;
  password: string;
}

/**
 * Google Login Payload
 */
export interface IGoogleLoginPayload {
  idToken: string;
}

/**
 * Refresh Token Payload
 */
export interface IRefreshTokenPayload {
  refreshToken: string;
}

/**
 * Authenticated Request User
 */
export interface IRequestUser {
  userId: string;
  email: string;
  name: string;
  role: Role;
}
