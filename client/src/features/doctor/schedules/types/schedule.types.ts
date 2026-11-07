import type { ApiMeta } from "@/types/api";

export type ScheduleStatusType = "DRAFT" | "PUBLISHED" | "UNPUBLISHED";

export interface ScheduleSlot {
  id: string;
  scheduleId: string;
  serialNumber: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  appointments?: Array<{
    id: string;
    status: string;
    patientId: string;
  }>;
}

export interface DoctorScheduleItem {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink: string;
  status: ScheduleStatusType;
  totalSlots: number;
  createdAt: string;
  updatedAt: string;
  slots?: ScheduleSlot[];
}

export interface DoctorSchedulesListResponse {
  schedules: DoctorScheduleItem[];
  meta: ApiMeta;
}

export interface CreateSchedulePayload {
  date: string;
  startTime: string;
  endTime: string;
  meetLink: string;
}

export interface UpdateSchedulePayload {
  date?: string;
  startTime?: string;
  endTime?: string;
  meetLink?: string;
}

export interface ScheduleFilterParams {
  page?: number;
  limit?: number;
  status?: ScheduleStatusType;
  startDate?: string;
  endDate?: string;
}
