"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { doctorScheduleService } from "../services/schedule.service";
import { DOCTOR_SCHEDULES_QUERY_KEY } from "./useDoctorSchedules";
import { SCHEDULE_DETAILS_QUERY_KEY } from "./useScheduleDetails";
import { DOCTOR_DASHBOARD_QUERY_KEY } from "@/features/doctor/dashboard/hooks/useDoctorDashboard";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { CreateSchedulePayload, UpdateSchedulePayload } from "../types/schedule.types";

export function useScheduleMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const invalidateSchedules = () => {
    queryClient.invalidateQueries({ queryKey: DOCTOR_SCHEDULES_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: SCHEDULE_DETAILS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: DOCTOR_DASHBOARD_QUERY_KEY });
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateSchedulePayload) =>
      doctorScheduleService.createSchedule(payload),
    onSuccess: (res) => {
      toast.success(res.message || "Consultation schedule draft created successfully!");
      invalidateSchedules();
      router.push("/doctor/schedules");
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSchedulePayload }) =>
      doctorScheduleService.updateSchedule(id, payload),
    onSuccess: (res) => {
      toast.success(res.message || "Schedule updated successfully!");
      invalidateSchedules();
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => doctorScheduleService.publishSchedule(id),
    onSuccess: (res) => {
      toast.success(res.message || "Schedule published successfully! Slots are now bookable.");
      invalidateSchedules();
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: string) => doctorScheduleService.unpublishSchedule(id),
    onSuccess: (res) => {
      toast.success(res.message || "Schedule unpublished successfully.");
      invalidateSchedules();
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => doctorScheduleService.deleteSchedule(id),
    onSuccess: (res) => {
      toast.success(res.message || "Schedule deleted successfully.");
      invalidateSchedules();
      router.push("/doctor/schedules");
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  return {
    createSchedule: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateSchedule: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    publishSchedule: publishMutation.mutateAsync,
    isPublishing: publishMutation.isPending,
    unpublishSchedule: unpublishMutation.mutateAsync,
    isUnpublishing: unpublishMutation.isPending,
    deleteSchedule: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export default useScheduleMutations;
