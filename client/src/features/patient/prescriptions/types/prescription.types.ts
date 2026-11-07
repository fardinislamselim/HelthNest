export interface MedicineItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface PrescriptionDoctor {
  id: string;
  name: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  contactNumber?: string | null;
  email: string;
}

export interface PatientPrescriptionItem {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  keyFindings: string;
  medicines: MedicineItem[];
  additionalInstructions?: string | null;
  createdAt: string;
  updatedAt: string;
  doctor: PrescriptionDoctor;
  appointment?: {
    id: string;
    serialNumber?: number | null;
    schedule?: {
      date: string;
      startTime: string;
      endTime: string;
    };
  };
}

export interface PrescriptionQueryParams {
  page?: number;
  limit?: number;
}
