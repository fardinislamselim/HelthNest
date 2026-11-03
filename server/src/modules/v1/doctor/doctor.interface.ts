export interface TApplyAsDoctor {
  name: string;
  email: string;
  password?: string;
  address?: string;
  specialization: string;
  licenseNumber: string;
  qualifications: string;
  experienceYears: number;
  bio?: string;
  consultationFee?: number;
  contactNumber?: string;
}

export interface TVerifyDoctorEmail {
  email: string;
  otp: string;
}

export interface TGetApplicationStatusQuery {
  userId?: string;
  email?: string;
}

export interface TRejectDoctorApplication {
  rejectionReason?: string;
}
