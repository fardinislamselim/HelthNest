import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminService } from "../services/admin.service";
import { getApiErrorMessage } from "@/lib/api/errors";
import type {
  CreateAdminPayload,
  RejectDoctorPayload,
  PatientFilterQuery,
} from "../types/admin.types";

export const ADMIN_QUERY_KEYS = {
  dashboard: ["admin", "dashboard"] as const,
  superDashboard: ["admin", "super-dashboard"] as const,
  pendingDoctors: ["admin", "doctors", "pending"] as const,
  allDoctors: ["admin", "doctors", "all"] as const,
  doctor: (id: string) => ["admin", "doctors", id] as const,
  patients: (query?: PatientFilterQuery) => ["admin", "patients", query] as const,
  patient: (id: string) => ["admin", "patients", id] as const,
  admins: ["admin", "users", "admins"] as const,
  superAdmins: ["admin", "users", "super-admins"] as const,
};

// Dashboards
export function useAdminDashboard() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.dashboard,
    queryFn: adminService.getAdminDashboard,
    staleTime: 60 * 1000,
  });
}

export function useSuperAdminDashboard() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.superDashboard,
    queryFn: adminService.getSuperAdminDashboard,
    staleTime: 60 * 1000,
  });
}

// Doctors
export function usePendingDoctors() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.pendingDoctors,
    queryFn: adminService.getPendingDoctors,
  });
}

export function useAllDoctors() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.allDoctors,
    queryFn: adminService.getAllDoctors,
  });
}

export function useDoctorDetails(doctorId: string) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.doctor(doctorId),
    queryFn: () => adminService.getDoctorById(doctorId),
    enabled: Boolean(doctorId),
  });
}

export function useApproveDoctorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (doctorId: string) => adminService.approveDoctor(doctorId),
    onSuccess: (data) => {
      toast.success(`Application approved for Dr. ${data.name}`);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });
}

export function useRejectDoctorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      doctorId,
      payload,
    }: {
      doctorId: string;
      payload: RejectDoctorPayload;
    }) => adminService.rejectDoctor(doctorId, payload),
    onSuccess: () => {
      toast.success("Doctor application rejected");
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });
}

export function useBlockDoctorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (doctorId: string) => adminService.blockDoctor(doctorId),
    onSuccess: (data) => {
      toast.success(`Doctor account for Dr. ${data.name} is now blocked`);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });
}

export function useUnblockDoctorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (doctorId: string) => adminService.unblockDoctor(doctorId),
    onSuccess: (data) => {
      toast.success(`Doctor account for Dr. ${data.name} is now active`);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });
}

// Patients
export function usePatientsList(query?: PatientFilterQuery) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.patients(query),
    queryFn: () => adminService.getAllPatients(query),
  });
}

export function usePatientDetails(patientId: string) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.patient(patientId),
    queryFn: () => adminService.getPatientById(patientId),
    enabled: Boolean(patientId),
  });
}

export function useBlockPatientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patientId: string) => adminService.blockPatient(patientId),
    onSuccess: (data) => {
      toast.success(`Patient account for ${data.name} is now blocked`);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });
}

export function useUnblockPatientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patientId: string) => adminService.unblockPatient(patientId),
    onSuccess: (data) => {
      toast.success(`Patient account for ${data.name} is now active`);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });
}

// Admins & Super Admins (Super Admin Only)
export function useAdminsList() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.admins,
    queryFn: adminService.listAdmins,
  });
}

export function useSuperAdminsList() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.superAdmins,
    queryFn: adminService.listSuperAdmins,
  });
}

export function useCreateAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAdminPayload) => adminService.createAdmin(payload),
    onSuccess: (user) => {
      toast.success(
        `Administrator created for ${user.email}. Credentials sent via email.`,
      );
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.admins });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.superDashboard });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });
}

export function useCreateSuperAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAdminPayload) =>
      adminService.createSuperAdmin(payload),
    onSuccess: (user) => {
      toast.success(
        `Super Administrator created for ${user.email}. Credentials sent via email.`,
      );
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.superAdmins });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.superDashboard });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });
}

export function useBlockAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminService.blockAdmin(userId),
    onSuccess: (user) => {
      toast.success(`Administrator account for ${user.email} is now blocked`);
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.admins });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.superDashboard });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });
}

export function useUnblockAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminService.unblockAdmin(userId),
    onSuccess: (user) => {
      toast.success(`Administrator account for ${user.email} is now active`);
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.admins });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.superDashboard });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });
}

export function useBlockSuperAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminService.blockSuperAdmin(userId),
    onSuccess: (user) => {
      toast.success(`Super Administrator for ${user.email} is now blocked`);
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.superAdmins });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.superDashboard });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });
}

export function useUnblockSuperAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminService.unblockSuperAdmin(userId),
    onSuccess: (user) => {
      toast.success(`Super Administrator for ${user.email} is now active`);
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.superAdmins });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.superDashboard });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });
}
