import type { ApiMeta } from "@/types/api";

export interface PublicDoctorItem {
  id: string;
  name: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  bio?: string | null;
  consultationFee?: number | null;
  profileImageUrl?: string | null;
}

export interface PublicDoctorDetails extends PublicDoctorItem {
  contactNumber?: string | null;
  address?: string | null;
  createdAt: string;
}

export interface PublicDoctorFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  minExperience?: number;
  maxFee?: number;
}

export interface PublicDoctorsListResponse {
  doctors: PublicDoctorItem[];
  meta: ApiMeta;
}

export interface DoctorFilterOption<T = number> {
  label: string;
  value: T;
}

export interface DoctorFilterOptionsResponse {
  specializations: string[];
  experienceOptions: DoctorFilterOption<number>[];
  feeOptions: DoctorFilterOption<number>[];
  bounds?: {
    minExperience: number;
    maxExperience: number;
    minFee: number;
    maxFee: number;
  };
}
