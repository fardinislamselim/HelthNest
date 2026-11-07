export interface PrescriptionMedicineItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface DoctorPrescriptionItem {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  keyFindings: string;
  medicines: PrescriptionMedicineItem[];
  additionalInstructions?: string | null;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: string;
    name: string;
    email: string;
    contactNumber?: string | null;
  };
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

export interface CreatePrescriptionPayload {
  appointmentId: string;
  keyFindings: string;
  medicines: PrescriptionMedicineItem[];
  additionalInstructions?: string;
}
