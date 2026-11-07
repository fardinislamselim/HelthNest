"use client";

import { useQuery } from "@tanstack/react-query";
import { patientPrescriptionService } from "../services/prescription.service";
import type {
  PatientPrescriptionItem,
  PrescriptionQueryParams,
} from "../types/prescription.types";

export const PRESCRIPTIONS_QUERY_KEY = ["prescriptions", "patient"] as const;

export function usePrescriptions(params: PrescriptionQueryParams = {}) {
  const query = useQuery<{
    prescriptions: PatientPrescriptionItem[];
    meta?: { page: number; limit: number; total: number; totalPage: number };
  }, Error>({
    queryKey: [...PRESCRIPTIONS_QUERY_KEY, params],
    queryFn: async () => {
      const res = await patientPrescriptionService.getMyPrescriptions(params);
      return {
        prescriptions: res.data || [],
        meta: res.meta,
      };
    },
    staleTime: 60 * 1000,
  });

  return {
    prescriptions: query.data?.prescriptions ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

export default usePrescriptions;
