import type { ApiMeta } from "@/types/api";

export type DoctorAppointmentStatus =
  | "PENDING"
  | "BOOKED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED";

export interface AppointmentPatient {
  id: string;
  name: string;
  email: string;
  contactNumber?: string | null;
  user?: {
    profileImageUrl?: string | null;
  };
}

export interface AppointmentSchedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink?: string | null;
}

export interface AppointmentSlot {
  id: string;
  serialNumber: number;
  startTime: string;
  endTime: string;
}

export interface AppointmentPayment {
  status: string;
  amount: number;
  currency: string;
  invoiceNumber?: string | null;
}

export interface DoctorAppointmentItem {
  id: string;
  serialNumber?: number | null;
  status: DoctorAppointmentStatus;
  startedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  patient: AppointmentPatient;
  schedule: AppointmentSchedule;
  slot: AppointmentSlot;
  payment?: AppointmentPayment | null;
}

export interface DoctorAppointmentsListResponse {
  appointments: DoctorAppointmentItem[];
  meta: ApiMeta;
}

export interface DoctorAppointmentFilterParams {
  page?: number;
  limit?: number;
  status?: DoctorAppointmentStatus;
  date?: string;
}
