"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { doctorProfileService } from "../services/profile.service";
import { AUTH_QUERY_KEY } from "@/features/auth/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { FullDoctorProfile, UpdateDoctorProfilePayload } from "../types/profile.types";

export const DOCTOR_PROFILE_QUERY_KEY = ["doctor", "profile"] as const;

export function useDoctorProfile() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery<FullDoctorProfile, Error>({
    queryKey: DOCTOR_PROFILE_QUERY_KEY,
    queryFn: async () => {
      const res = await doctorProfileService.getProfile();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateDoctorProfilePayload) =>
      doctorProfileService.updateProfile(payload),
    onSuccess: (res) => {
      toast.success(res.message || "Practitioner profile updated successfully!");
      if (res.data) {
        queryClient.setQueryData(DOCTOR_PROFILE_QUERY_KEY, res.data);
        queryClient.setQueryData(AUTH_QUERY_KEY, res.data);
      }
      queryClient.invalidateQueries({ queryKey: DOCTOR_PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => doctorProfileService.uploadProfileImage(file),
    onSuccess: (res) => {
      toast.success(res.message || "Profile photograph updated successfully!");
      if (res.data) {
        queryClient.setQueryData(DOCTOR_PROFILE_QUERY_KEY, res.data);
        queryClient.setQueryData(AUTH_QUERY_KEY, res.data);
      }
      queryClient.invalidateQueries({ queryKey: DOCTOR_PROFILE_QUERY_KEY });
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

export default useDoctorProfile;
