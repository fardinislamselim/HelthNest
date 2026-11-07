import type { UserProfile, DoctorProfile } from "@/types/user";

export interface FullDoctorProfile extends UserProfile {
  doctor?: DoctorProfile | null;
}

export interface UpdateDoctorProfilePayload {
  name?: string;
  email?: string;
  contactNumber?: string;
  address?: string;
}
