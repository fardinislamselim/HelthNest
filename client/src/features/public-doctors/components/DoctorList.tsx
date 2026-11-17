"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Stethoscope } from "lucide-react";
import { DoctorCard } from "./DoctorCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import type { PublicDoctorItem } from "../types/doctor.types";
import type { ApiMeta } from "@/types/api";

interface DoctorListProps {
  doctors: PublicDoctorItem[];
  meta: ApiMeta;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  onPageChange: (newPage: number) => void;
  onResetFilters?: () => void;
}

export function DoctorList({
  doctors,
  meta,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onPageChange,
  onResetFilters,
}: DoctorListProps) {
  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Doctors"
        message={errorMessage || "Could not retrieve doctor directory from the server."}
        onRetry={onRetry}
        className="my-8"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <Skeleton className="h-14 w-14 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-border/50">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-4/5" />
            </div>
            <div className="pt-2 flex justify-between items-center border-t border-border/50">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <EmptyState
        title="No Practitioners Found"
        description="We couldn't find any verified healthcare practitioners matching your search criteria. Try adjusting your filters or search keywords."
        icon={Stethoscope}
        actionLabel={onResetFilters ? "Reset Filters" : undefined}
        onAction={onResetFilters}
        className="my-8"
      />
    );
  }

  const hasPagination = meta.totalPage > 1;

  return (
    <div className="space-y-6">
      {/* Grid of Doctor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>

      {/* Pagination Controls */}
      {hasPagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-border/60">
          <p className="text-xs text-muted-foreground order-2 sm:order-1">
            Page <strong className="text-foreground">{meta.page}</strong> of{" "}
            <strong className="text-foreground">{meta.totalPage}</strong> (Total {meta.total} doctors)
          </p>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => onPageChange(meta.page - 1)}
              className="text-xs gap-1 h-8"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPage}
              onClick={() => onPageChange(meta.page + 1)}
              className="text-xs gap-1 h-8"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorList;
