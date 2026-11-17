"use client";

import { useQuery } from "@tanstack/react-query";
import { publicDoctorService } from "../services/doctor.service";
import type { PublicDoctorDetails } from "../types/doctor.types";

export const PUBLIC_DOCTOR_DETAILS_QUERY_KEY = ["public", "doctor", "details"] as const;

export function usePublicDoctorDetails(doctorId: string) {
  const query = useQuery<PublicDoctorDetails, Error>({
    queryKey: [...PUBLIC_DOCTOR_DETAILS_QUERY_KEY, doctorId],
    queryFn: async () => {
      const res = await publicDoctorService.getDoctorById(doctorId);
      return res.data;
    },
    enabled: Boolean(doctorId),
    staleTime: 60 * 1000,
  });

  return {
    doctor: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

export default usePublicDoctorDetails;
