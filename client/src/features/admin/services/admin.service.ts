import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  AdminDashboardData,
  SuperAdminDashboardData,
  DoctorAdminRecord,
  PatientAdminRecord,
  AdminUserRecord,
  CreateAdminPayload,
  RejectDoctorPayload,
  PatientsListResult,
  PatientFilterQuery,
} from "../types/admin.types";

interface BackendDoctorPayload {
  doctor?: DoctorAdminRecord;
  doctors?: DoctorAdminRecord[];
  [key: string]: unknown;
}

interface BackendPatientPayload {
  patient?: PatientAdminRecord;
  patients?: PatientAdminRecord[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  [key: string]: unknown;
}

interface BackendUserPayload {
  user?: AdminUserRecord;
  users?: AdminUserRecord[];
  [key: string]: unknown;
}

export const adminService = {
  // Dashboards
  getAdminDashboard: async (): Promise<AdminDashboardData> => {
    const response = await apiClient.get<ApiResponse<AdminDashboardData>>(
      API_ENDPOINTS.DASHBOARD.ADMIN,
    );
    return response.data.data;
  },

  getSuperAdminDashboard: async (): Promise<SuperAdminDashboardData> => {
    const response = await apiClient.get<ApiResponse<SuperAdminDashboardData>>(
      API_ENDPOINTS.DASHBOARD.SUPER_ADMIN,
    );
    return response.data.data;
  },

  // Doctors / Applications
  getPendingDoctors: async (): Promise<DoctorAdminRecord[]> => {
    const response = await apiClient.get<
      ApiResponse<DoctorAdminRecord[] | BackendDoctorPayload>
    >(API_ENDPOINTS.ADMIN.PENDING_DOCTORS);
    const data = response.data?.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as BackendDoctorPayload).doctors)) {
      return (data as BackendDoctorPayload).doctors as DoctorAdminRecord[];
    }
    return [];
  },

  getAllDoctors: async (): Promise<DoctorAdminRecord[]> => {
    const response = await apiClient.get<
      ApiResponse<DoctorAdminRecord[] | BackendDoctorPayload>
    >(API_ENDPOINTS.ADMIN.DOCTORS);
    const data = response.data?.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as BackendDoctorPayload).doctors)) {
      return (data as BackendDoctorPayload).doctors as DoctorAdminRecord[];
    }
    return [];
  },

  getDoctorById: async (doctorId: string): Promise<DoctorAdminRecord> => {
    const response = await apiClient.get<
      ApiResponse<DoctorAdminRecord | BackendDoctorPayload>
    >(API_ENDPOINTS.ADMIN.DOCTOR_BY_ID(doctorId));
    const data = response.data?.data;
    if (data && "doctor" in data && (data as BackendDoctorPayload).doctor) {
      return (data as BackendDoctorPayload).doctor as DoctorAdminRecord;
    }
    return data as DoctorAdminRecord;
  },

  approveDoctor: async (doctorId: string): Promise<DoctorAdminRecord> => {
    const response = await apiClient.patch<
      ApiResponse<DoctorAdminRecord | BackendDoctorPayload>
    >(API_ENDPOINTS.ADMIN.APPROVE_DOCTOR(doctorId));
    const data = response.data?.data;
    if (data && "doctor" in data && (data as BackendDoctorPayload).doctor) {
      return (data as BackendDoctorPayload).doctor as DoctorAdminRecord;
    }
    return data as DoctorAdminRecord;
  },

  rejectDoctor: async (
    doctorId: string,
    payload: RejectDoctorPayload,
  ): Promise<DoctorAdminRecord> => {
    const response = await apiClient.patch<
      ApiResponse<DoctorAdminRecord | BackendDoctorPayload>
    >(API_ENDPOINTS.ADMIN.REJECT_DOCTOR(doctorId), payload);
    const data = response.data?.data;
    if (data && "doctor" in data && (data as BackendDoctorPayload).doctor) {
      return (data as BackendDoctorPayload).doctor as DoctorAdminRecord;
    }
    return data as DoctorAdminRecord;
  },

  blockDoctor: async (doctorId: string): Promise<DoctorAdminRecord> => {
    const response = await apiClient.patch<
      ApiResponse<DoctorAdminRecord | BackendDoctorPayload>
    >(API_ENDPOINTS.ADMIN.BLOCK_DOCTOR(doctorId));
    const data = response.data?.data;
    if (data && "doctor" in data && (data as BackendDoctorPayload).doctor) {
      return (data as BackendDoctorPayload).doctor as DoctorAdminRecord;
    }
    return data as DoctorAdminRecord;
  },

  unblockDoctor: async (doctorId: string): Promise<DoctorAdminRecord> => {
    const response = await apiClient.patch<
      ApiResponse<DoctorAdminRecord | BackendDoctorPayload>
    >(API_ENDPOINTS.ADMIN.UNBLOCK_DOCTOR(doctorId));
    const data = response.data?.data;
    if (data && "doctor" in data && (data as BackendDoctorPayload).doctor) {
      return (data as BackendDoctorPayload).doctor as DoctorAdminRecord;
    }
    return data as DoctorAdminRecord;
  },

  // Patients
  getAllPatients: async (
    query?: PatientFilterQuery,
  ): Promise<PatientsListResult> => {
    const response = await apiClient.get<
      ApiResponse<BackendPatientPayload | PatientAdminRecord[]>
    >(API_ENDPOINTS.ADMIN.PATIENTS, { params: query });

    const rawData = response.data?.data;
    let patients: PatientAdminRecord[] = [];
    let meta = {
      page: query?.page ?? 1,
      limit: query?.limit ?? 10,
      total: 0,
      totalPages: 0,
    };

    if (rawData && "patients" in rawData && Array.isArray((rawData as BackendPatientPayload).patients)) {
      patients = (rawData as BackendPatientPayload).patients as PatientAdminRecord[];
      if ((rawData as BackendPatientPayload).meta) {
        meta = (rawData as BackendPatientPayload).meta!;
      }
    } else if (Array.isArray(rawData)) {
      patients = rawData;
    }

    if (response.data?.meta) {
      meta = {
        page: response.data.meta.page ?? meta.page,
        limit: response.data.meta.limit ?? meta.limit,
        total: response.data.meta.total ?? meta.total,
        totalPages: response.data.meta.totalPage ?? meta.totalPages,
      };
    }

    return { patients, meta };
  },

  getPatientById: async (patientId: string): Promise<PatientAdminRecord> => {
    const response = await apiClient.get<
      ApiResponse<PatientAdminRecord | BackendPatientPayload>
    >(API_ENDPOINTS.ADMIN.PATIENT_BY_ID(patientId));
    const data = response.data?.data;
    if (data && "patient" in data && (data as BackendPatientPayload).patient) {
      return (data as BackendPatientPayload).patient as PatientAdminRecord;
    }
    return data as PatientAdminRecord;
  },

  blockPatient: async (patientId: string): Promise<PatientAdminRecord> => {
    const response = await apiClient.patch<
      ApiResponse<PatientAdminRecord | BackendPatientPayload>
    >(API_ENDPOINTS.ADMIN.BLOCK_PATIENT(patientId));
    const data = response.data?.data;
    if (data && "patient" in data && (data as BackendPatientPayload).patient) {
      return (data as BackendPatientPayload).patient as PatientAdminRecord;
    }
    return data as PatientAdminRecord;
  },

  unblockPatient: async (patientId: string): Promise<PatientAdminRecord> => {
    const response = await apiClient.patch<
      ApiResponse<PatientAdminRecord | BackendPatientPayload>
    >(API_ENDPOINTS.ADMIN.UNBLOCK_PATIENT(patientId));
    const data = response.data?.data;
    if (data && "patient" in data && (data as BackendPatientPayload).patient) {
      return (data as BackendPatientPayload).patient as PatientAdminRecord;
    }
    return data as PatientAdminRecord;
  },

  // Admin & Super Admin Management
  listAdmins: async (): Promise<AdminUserRecord[]> => {
    const response = await apiClient.get<
      ApiResponse<AdminUserRecord[] | BackendUserPayload>
    >(API_ENDPOINTS.ADMIN.ADMINS);
    const data = response.data?.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as BackendUserPayload).users)) {
      return (data as BackendUserPayload).users as AdminUserRecord[];
    }
    return [];
  },

  listSuperAdmins: async (): Promise<AdminUserRecord[]> => {
    const response = await apiClient.get<
      ApiResponse<AdminUserRecord[] | BackendUserPayload>
    >(API_ENDPOINTS.ADMIN.SUPER_ADMINS);
    const data = response.data?.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as BackendUserPayload).users)) {
      return (data as BackendUserPayload).users as AdminUserRecord[];
    }
    return [];
  },

  createAdmin: async (payload: CreateAdminPayload): Promise<AdminUserRecord> => {
    const response = await apiClient.post<
      ApiResponse<AdminUserRecord | BackendUserPayload>
    >(API_ENDPOINTS.ADMIN.ADMINS, payload);
    const data = response.data?.data;
    if (data && "user" in data && (data as BackendUserPayload).user) {
      return (data as BackendUserPayload).user as AdminUserRecord;
    }
    return data as AdminUserRecord;
  },

  createSuperAdmin: async (
    payload: CreateAdminPayload,
  ): Promise<AdminUserRecord> => {
    const response = await apiClient.post<
      ApiResponse<AdminUserRecord | BackendUserPayload>
    >(API_ENDPOINTS.ADMIN.SUPER_ADMINS, payload);
    const data = response.data?.data;
    if (data && "user" in data && (data as BackendUserPayload).user) {
      return (data as BackendUserPayload).user as AdminUserRecord;
    }
    return data as AdminUserRecord;
  },

  blockAdmin: async (userId: string): Promise<AdminUserRecord> => {
    const response = await apiClient.patch<
      ApiResponse<AdminUserRecord | BackendUserPayload>
    >(API_ENDPOINTS.ADMIN.BLOCK_ADMIN(userId));
    const data = response.data?.data;
    if (data && "user" in data && (data as BackendUserPayload).user) {
      return (data as BackendUserPayload).user as AdminUserRecord;
    }
    return data as AdminUserRecord;
  },

  unblockAdmin: async (userId: string): Promise<AdminUserRecord> => {
    const response = await apiClient.patch<
      ApiResponse<AdminUserRecord | BackendUserPayload>
    >(API_ENDPOINTS.ADMIN.UNBLOCK_ADMIN(userId));
    const data = response.data?.data;
    if (data && "user" in data && (data as BackendUserPayload).user) {
      return (data as BackendUserPayload).user as AdminUserRecord;
    }
    return data as AdminUserRecord;
  },

  blockSuperAdmin: async (userId: string): Promise<AdminUserRecord> => {
    const response = await apiClient.patch<
      ApiResponse<AdminUserRecord | BackendUserPayload>
    >(API_ENDPOINTS.ADMIN.BLOCK_SUPER_ADMIN(userId));
    const data = response.data?.data;
    if (data && "user" in data && (data as BackendUserPayload).user) {
      return (data as BackendUserPayload).user as AdminUserRecord;
    }
    return data as AdminUserRecord;
  },

  unblockSuperAdmin: async (userId: string): Promise<AdminUserRecord> => {
    const response = await apiClient.patch<
      ApiResponse<AdminUserRecord | BackendUserPayload>
    >(API_ENDPOINTS.ADMIN.UNBLOCK_SUPER_ADMIN(userId));
    const data = response.data?.data;
    if (data && "user" in data && (data as BackendUserPayload).user) {
      return (data as BackendUserPayload).user as AdminUserRecord;
    }
    return data as AdminUserRecord;
  },
};
