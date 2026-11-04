/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

export interface TCreateAdmin {
  organizationEmail: string;
  personalEmail: string;
  name: string;
}

export interface TAdminUserParams {
  userId: string;
}

export interface TRejectDoctorApplication {
  rejectionReason?: string;
}

/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

import { Role, UserStatus } from "../../../../generated/prisma/enums";

export interface IPatientFilterQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  searchTerm?: string;
  status?: UserStatus;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IPatientUserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
  profileImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPatientResponse {
  id: string;
  name: string;
  email: string;
  contactNumber: string | null;
  address: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  status: UserStatus;
  user?: IPatientUserSummary;
}

export interface IPatientStatusUpdateResponse {
  id: string;
  status: UserStatus;
  userId?: string;
  name?: string;
  email?: string;
  contactNumber?: string | null;
  address?: string | null;
}

export interface IPatientsListResult {
  patients: IPatientResponse[];
  meta: IPaginationMeta;
}

