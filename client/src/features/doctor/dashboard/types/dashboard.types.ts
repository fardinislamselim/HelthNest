export interface DoctorDashboardAppointmentsSummary {
  total: number;
  today: number;
  booked: number;
  ongoing: number;
  completed: number;
  cancelled: number;
}

export interface DoctorDashboardSchedulesSummary {
  total: number;
  published: number;
  draft: number;
  today: number;
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
}

export interface DashboardPatientInfo {
  id: string;
  name: string;
}

export interface DoctorDashboardRecentPrescription {
  id: string;
  createdAt: string;
  patient: DashboardPatientInfo;
  appointment: {
    id: string;
  };
}

export interface DoctorDashboardRecentAppointment {
  id: string;
  status: string;
  createdAt?: string;
  patient: DashboardPatientInfo;
  schedule: {
    date: string;
    startTime: string;
    endTime: string;
  };
}

export interface DoctorDashboardData {
  appointments: DoctorDashboardAppointmentsSummary;
  schedules: DoctorDashboardSchedulesSummary;
  prescriptions: {
    total: number;
    recent: DoctorDashboardRecentPrescription[];
  };
  patients: {
    totalUnique: number;
    recent: Array<{ patient: DashboardPatientInfo }>;
  };
  recent: {
    appointments: DoctorDashboardRecentAppointment[];
    upcomingAppointments: DoctorDashboardRecentAppointment[];
  };
}
