export type AppointmentStatus =
  | "PENDING"
  | "BOOKED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED";

export interface AppointmentDoctor {
  id: string;
  name: string;
  specialization: string;
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
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "EXPIRED" | string;
  amount: number;
  currency: string;
  invoiceNumber?: string | null;
}

export interface PatientAppointmentItem {
  id: string;
  serialNumber?: number | null;
  status: AppointmentStatus;
  startedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  doctor: AppointmentDoctor;
  schedule: AppointmentSchedule;
  slot: AppointmentSlot;
  payment?: AppointmentPayment | null;
}

export interface CancelAppointmentResponseData {
  appointment: PatientAppointmentItem;
  cancellationTime: string;
  scheduleStartTime: string;
  refundEligible: boolean;
  refund?: {
    id: string;
    amount: number;
    currency: string;
    status: string;
  } | null;
  message: string;
}

export interface AppointmentQueryParams {
  page?: number;
  limit?: number;
  status?: AppointmentStatus | "";
  date?: string;
}
