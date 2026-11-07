"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { doctorPrescriptionService } from "../services/prescription.service";
import { DOCTOR_DASHBOARD_QUERY_KEY } from "@/features/doctor/dashboard/hooks/useDoctorDashboard";
import { DOCTOR_APPOINTMENTS_QUERY_KEY } from "@/features/doctor/appointments/hooks/useDoctorAppointments";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { CreatePrescriptionPayload } from "../types/prescription.types";

export function useCreatePrescription() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (payload: CreatePrescriptionPayload) =>
      doctorPrescriptionService.createPrescription(payload),
    onSuccess: (res) => {
      toast.success(res.message || "Digital prescription issued successfully!");
      queryClient.invalidateQueries({ queryKey: DOCTOR_DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DOCTOR_APPOINTMENTS_QUERY_KEY });
      router.push("/doctor/prescriptions");
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  return {
    createPrescription: mutation.mutateAsync,
    isCreating: mutation.isPending,
  };
}

export default useCreatePrescription;
