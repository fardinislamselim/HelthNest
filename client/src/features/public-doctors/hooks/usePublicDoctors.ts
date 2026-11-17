"use client";

import { useQuery } from "@tanstack/react-query";
import { publicDoctorService } from "../services/doctor.service";
import type {
  PublicDoctorFilterParams,
  PublicDoctorsListResponse,
} from "../types/doctor.types";

export const PUBLIC_DOCTORS_QUERY_KEY = ["public", "doctors"] as const;

export function usePublicDoctors(filters?: PublicDoctorFilterParams) {
  const query = useQuery<PublicDoctorsListResponse, Error>({
    queryKey: [...PUBLIC_DOCTORS_QUERY_KEY, filters],
    queryFn: async () => {
      const res = await publicDoctorService.getDoctors(filters);
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  return {
    doctors: query.data?.doctors ?? [],
    meta: query.data?.meta ?? {
      page: 1,
      limit: 12,
      total: 0,
      totalPage: 1,
    },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

export default usePublicDoctors;
