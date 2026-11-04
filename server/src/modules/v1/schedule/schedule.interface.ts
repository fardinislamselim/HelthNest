/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

import { ScheduleStatus, AppointmentStatus } from "../../../../generated/prisma/enums";

export interface ICreateSchedulePayload {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  meetLink: string;
}

export interface IUpdateSchedulePayload {
  date?: string;
  startTime?: string;
  endTime?: string;
  meetLink?: string;
}

export interface IScheduleFilterQuery {
  page?: number | string;
  limit?: number | string;
  status?: ScheduleStatus;
  startDate?: string;
  endDate?: string;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ISlotResponse {
  id: string;
  scheduleId: string;
  serialNumber: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  createdAt: Date;
  updatedAt: Date;
  appointment?: {
    id: string;
    status: AppointmentStatus;
    patientId: string | null;
  } | null;
}

export interface IScheduleResponse {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink: string;
  status: ScheduleStatus;
  totalSlots: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  slots?: ISlotResponse[];
}

export interface ISchedulesListResult {
  schedules: IScheduleResponse[];
  meta: IPaginationMeta;
}

/**
 * Patient Schedule & Slot Discovery Interfaces
 */
export interface IPatientDoctorInfo {
  id: string;
  doctorId: string;
  name: string;
  specialization: string;
  profileImage: string | null;
  experienceYears?: number;
  consultationFee?: number | string | null;
}

export interface IPatientAvailableScheduleItem {
  id: string;
  scheduleId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ScheduleStatus;
  totalSlots: number;
  availableSlots: number;
  doctor: IPatientDoctorInfo;
}

export interface IPatientTodaySchedulesResult {
  schedules: IPatientAvailableScheduleItem[];
  meta: IPaginationMeta;
}

export interface IPatientSlotItem {
  id: string;
  slotId: string;
  serialNumber: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface IPatientScheduleSlotsResponse {
  scheduleId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalSlots: number;
  slots: IPatientSlotItem[];
}

export interface IPatientAvailableDoctorItem {
  id: string;
  doctorId: string;
  name: string;
  specialization: string;
  profileImage: string | null;
  experienceYears?: number;
  consultationFee?: number | string | null;
  availableScheduleCount: number;
  availableSlotCount: number;
}
