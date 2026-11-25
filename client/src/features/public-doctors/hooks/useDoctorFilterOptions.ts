"use client";

import { useQuery } from "@tanstack/react-query";
import { publicDoctorService } from "../services/doctor.service";
import type { DoctorFilterOptionsResponse } from "../types/doctor.types";

export const DOCTOR_FILTER_OPTIONS_QUERY_KEY = [
  "public",
  "doctors",
  "filter-options",
] as const;

export function useDoctorFilterOptions() {
  const query = useQuery<DoctorFilterOptionsResponse, Error>({
    queryKey: DOCTOR_FILTER_OPTIONS_QUERY_KEY,
    queryFn: async () => {
      const res = await publicDoctorService.getFilterOptions();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    specializations: query.data?.specializations ?? [],
    experienceOptions: query.data?.experienceOptions ?? [
      { label: "Any Experience", value: 0 },
    ],
    feeOptions: query.data?.feeOptions ?? [{ label: "Any Fee", value: 0 }],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export default useDoctorFilterOptions;
