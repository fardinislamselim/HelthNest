/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

export interface IMedicineItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface ICreatePrescriptionPayload {
  appointmentId: string;
  keyFindings: string;
  medicines: IMedicineItem[];
  additionalInstructions?: string;
}

export interface IPrescriptionQuery {
  page?: number | string;
  limit?: number | string;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IPrescriptionPdfData {
  prescription: {
    id: string;
    keyFindings: string;
    medicines: IMedicineItem[];
    additionalInstructions?: string | null;
    createdAt: Date;
  };
  doctor: {
    name: string;
    specialization: string;
    qualifications?: string;
    experienceYears?: number;
    contactNumber?: string | null;
    email?: string;
  };
  patient: {
    name: string;
    email: string;
    contactNumber?: string | null;
    address?: string | null;
  };
  appointment: {
    id: string;
    serialNumber?: number | null;
    schedule?: {
      date: string;
      startTime: string;
      endTime: string;
    } | null;
    slot?: {
      startTime: string;
      endTime: string;
      serialNumber: number;
    } | null;
  };
}

