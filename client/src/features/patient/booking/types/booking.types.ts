import type { PatientScheduleItem, PatientSlotItem } from "@/features/patient/schedules/types/schedule.types";

export interface CreateAppointmentPayload {
  scheduleId: string;
  slotId: string;
}

export interface CreateAppointmentResponseData {
  id: string;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  slotId: string;
  status: "PENDING" | "BOOKED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  serialNumber?: number | null;
  createdAt: string;
}

export interface CheckoutResponseData {
  checkoutSessionId: string;
  paymentUrl: string;
}

export interface BookingSelection {
  schedule: PatientScheduleItem;
  slot: PatientSlotItem;
}
