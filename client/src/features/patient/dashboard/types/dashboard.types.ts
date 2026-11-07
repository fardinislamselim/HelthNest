/**
 * Types for the Patient Dashboard Feature
 * Matches backend `GET /api/v1/dashboard/patient` contract
 */

export interface DashboardAppointments {
  total: number;
  today: number;
  booked: number;
  ongoing: number;
  completed: number;
  cancelled: number;
}

export interface DashboardPayments {
  successfulCount: number;
  totalAmount: number;
}

export interface DashboardRefundItem {
  id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | string;
  createdAt: string;
}

export interface DashboardRefunds {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  totalRefundedAmount: number;
  recent: DashboardRefundItem[];
}

export interface DashboardPrescriptionItem {
  id: string;
  createdAt: string;
  doctor: {
    id: string;
    name: string;
  };
}

export interface DashboardPrescriptions {
  total: number;
  recent: DashboardPrescriptionItem[];
}

export interface DashboardRecentAppointment {
  id: string;
  status: "PENDING" | "BOOKED" | "ONGOING" | "COMPLETED" | "CANCELLED" | string;
  createdAt: string;
  doctor: {
    id: string;
    name: string;
    specialization: string;
  };
  schedule: {
    date: string;
    startTime: string;
    endTime: string;
  };
}

export interface DashboardUpcomingAppointment {
  id: string;
  status: "PENDING" | "BOOKED" | "ONGOING" | "COMPLETED" | "CANCELLED" | string;
  doctor: {
    id: string;
    name: string;
  };
  schedule: {
    date: string;
    startTime: string;
    endTime: string;
  };
}

export interface PatientDashboardData {
  appointments: DashboardAppointments;
  prescriptions: DashboardPrescriptions;
  payments: DashboardPayments;
  refunds: DashboardRefunds;
  recent: {
    appointments: DashboardRecentAppointment[];
    upcomingAppointments: DashboardUpcomingAppointment[];
  };
}
