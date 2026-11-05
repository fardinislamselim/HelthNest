export type Role = "PATIENT" | "DOCTOR" | "ADMIN" | "SUPER_ADMIN";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export type AuthProvider = "CREDENTIAL" | "GOOGLE";

export type DoctorVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  authProvider: AuthProvider;
  emailVerified: boolean;
  needPasswordChange?: boolean;
  profileImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PatientProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  contactNumber?: string | null;
  address?: string | null;
  isDeleted: boolean;
  user?: UserProfile;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  qualifications: string;
  experienceYears: number;
  consultationFee?: number | null;
  contactNumber?: string | null;
  address?: string | null;
  bio?: string | null;
  verificationStatus: DoctorVerificationStatus;
  rejectionReason?: string | null;
  user?: UserProfile;
}

export interface CurrentUserResponse {
  user: UserProfile;
  patient?: PatientProfile | null;
  doctor?: DoctorProfile | null;
}

