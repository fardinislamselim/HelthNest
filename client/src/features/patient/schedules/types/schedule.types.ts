export interface PatientDoctorSummary {
  id: string;
  name: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  consultationFee: number | null;
  user?: {
    profileImageUrl?: string | null;
  };
}

export interface PatientScheduleItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink?: string | null;
  totalSlots: number;
  availableSlots: number;
  doctor: PatientDoctorSummary;
}

export interface PatientSlotItem {
  id: string;
  serialNumber: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  isAvailable: boolean;
}

export interface PatientScheduleSlotsResponse {
  schedule: PatientScheduleItem;
  slots: PatientSlotItem[];
}
