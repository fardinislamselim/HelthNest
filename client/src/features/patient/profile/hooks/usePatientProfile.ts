"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { patientProfileService } from "../services/profile.service";
import { AUTH_QUERY_KEY } from "@/features/auth/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { FullPatientProfile, UpdatePatientProfilePayload } from "../types/profile.types";

export const PATIENT_PROFILE_QUERY_KEY = ["patient", "profile"] as const;

export function usePatientProfile() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery<FullPatientProfile, Error>({
    queryKey: PATIENT_PROFILE_QUERY_KEY,
    queryFn: async () => {
      const res = await patientProfileService.getProfile();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdatePatientProfilePayload) =>
      patientProfileService.updateProfile(payload),
    onSuccess: (res) => {
      toast.success(res.message || "Profile updated successfully!");
      if (res.data) {
        queryClient.setQueryData(PATIENT_PROFILE_QUERY_KEY, res.data);
        queryClient.setQueryData(AUTH_QUERY_KEY, res.data);
      }
      queryClient.invalidateQueries({ queryKey: PATIENT_PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => patientProfileService.uploadProfileImage(file),
    onSuccess: (res) => {
      toast.success(res.message || "Profile photo updated successfully!");
      if (res.data) {
        queryClient.setQueryData(PATIENT_PROFILE_QUERY_KEY, res.data);
        queryClient.setQueryData(AUTH_QUERY_KEY, res.data);
      }
      queryClient.invalidateQueries({ queryKey: PATIENT_PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  return {
    profile: profileQuery.data ?? null,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
    // Mutations
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    uploadProfileImage: uploadImageMutation.mutateAsync,
    isUploadingImage: uploadImageMutation.isPending,
  };
}

export default usePatientProfile;
