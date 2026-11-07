import type { Role, UserStatus } from "@/types/user";

export type DoctorVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface DoctorAdminRecord {
  id: string;
  name: string;
  email: string;
  address?: string | null;
  specialization: string;
  licenseNumber: string;
  qualifications: string[];
  experienceYears: number;
  bio?: string | null;
  consultationFee: number;
  contactNumber: string;
  verificationStatus: DoctorVerificationStatus;
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  resume?: string | null;
  additionalFiles?: string[] | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    emailVerified: boolean;
    status: UserStatus;
    role: Role;
  };
}

export interface PatientAdminRecord {
  id: string;
  name: string;
  email: string;
  contactNumber?: string | null;
  address?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  status: UserStatus;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: UserStatus;
    emailVerified: boolean;
    profileImageUrl?: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AdminUserRecord {
  id: string;
  name: string | null;
  email: string;
  personalEmail: string | null;
  role: Role;
  status: UserStatus;
  needPasswordChange: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminPayload {
  organizationEmail: string;
  personalEmail: string;
  name?: string;
}

export interface RejectDoctorPayload {
  rejectionReason?: string;
}

export interface RecentDoctorApplication {
  id: string;
  name: string;
  specialization?: string;
  verificationStatus: DoctorVerificationStatus;
  createdAt: string;
}

export interface RecentAppointment {
  id: string;
  status: string;
  createdAt: string;
  schedule?: {
    date: string;
    startTime: string;
  } | null;
  doctor?: {
    id: string;
    name: string;
  } | null;
  patient?: {
    id: string;
    name: string;
  } | null;
}

export interface RecentPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  appointment?: {
    doctor?: { id: string; name: string } | null;
    patient?: { id: string; name: string } | null;
  } | null;
}

export interface RecentRefund {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  patient?: {
    id: string;
    name: string;
  } | null;
}

export interface RecentUser {
  id: string;
  name: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

export interface AdminDashboardData {
  users: {
    totalPatients: number;
    totalDoctors: number;
    activePatients: number;
    blockedPatients: number;
    activeDoctors: number;
    blockedDoctors: number;
  };
  doctorApplications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  appointments: {
    total: number;
    today: number;
    booked: number;
    ongoing: number;
    completed: number;
    cancelled: number;
  };
  payments: {
    successfulCount: number;
    totalAmount: number;
  };
  refunds: {
    total: number;
    completed: number;
    pending: number;
    failed: number;
    totalRefundedAmount: number;
  };
  recent: {
    doctorApplications: RecentDoctorApplication[];
    appointments: RecentAppointment[];
    payments: RecentPayment[];
    refunds: RecentRefund[];
  };
}

export interface SuperAdminDashboardData {
  users: {
    totalUsers: number;
    totalPatients: number;
    totalDoctors: number;
    totalAdmins: number;
    totalSuperAdmins: number;
    activeUsers: number;
    blockedUsers: number;
  };
  doctorApplications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    activeDoctors: number;
    blockedDoctors: number;
  };
  appointments: {
    total: number;
    today: number;
    booked: number;
    ongoing: number;
    completed: number;
    cancelled: number;
  };
  financial: {
    successfulCount: number;
    totalAmount: number;
    completedRefunds: number;
    totalRefundedAmount: number;
    pendingRefunds: number;
    failedRefunds: number;
    netCollectedAmount: number;
  };
  recent: {
    users: RecentUser[];
    doctorApplications: RecentDoctorApplication[];
    appointments: RecentAppointment[];
    payments: RecentPayment[];
    refunds: RecentRefund[];
  };
}

export interface PatientsListResult {
  patients: PatientAdminRecord[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PatientFilterQuery {
  page?: number;
  limit?: number;
  search?: string;
  searchTerm?: string;
  status?: UserStatus;
}
