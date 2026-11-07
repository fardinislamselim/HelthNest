import type { UserProfile, PatientProfile } from "@/types/user";

export interface FullPatientProfile extends UserProfile {
  patient?: PatientProfile | null;
}

export interface UpdatePatientProfilePayload {
  name?: string;
  email?: string;
  contactNumber?: string;
  address?: string;
}
