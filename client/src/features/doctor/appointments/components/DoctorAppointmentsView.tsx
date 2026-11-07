"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDoctorAppointments } from "../hooks/useDoctorAppointments";
import { useConsultationLifecycle } from "../hooks/useConsultationLifecycle";
import { DoctorAppointmentFilters } from "./DoctorAppointmentFilters";
import { DoctorAppointmentTable } from "./DoctorAppointmentTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DoctorAppointmentsView() {
  const router = useRouter();
  const {
    appointments,
    meta,
    isLoading,
    isError,
    error,
    refetch,
    filters,
    setPage,
    setStatus,
    setDate,
    setFilters,
  } = useDoctorAppointments();

  const {
    startAppointment,
    isStarting,
    completeAppointment,
    isCompleting,
  } = useConsultationLifecycle();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Consultations"
        description="Track booked consultations, conduct live video visits, and complete clinical sessions"
      />

      <DoctorAppointmentFilters
        status={filters.status}
        date={filters.date}
        onStatusChange={(status) => setStatus(status)}
        onDateChange={(date) => setDate(date)}
        onReset={() => setFilters({ page: 1, limit: 10 })}
      />

      {isError && (
        <ErrorState
          title="Failed to load consultations"
          message={error?.message || "Could not retrieve doctor appointments from the server."}
          onRetry={() => refetch()}
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="shadow-xs">
              <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-9 w-28 rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          title="No consultations found"
          description={
            filters.status || filters.date
              ? "No patient bookings match your filter criteria. Try adjusting your filters."
              : "You have no consultation bookings right now. Make sure your schedules are published."
          }
          actionLabel="Manage Schedules"
          onAction={() => router.push("/doctor/schedules")}
        />
      ) : (
        <div className="space-y-4">
          <DoctorAppointmentTable
            appointments={appointments}
            onStart={startAppointment}
            isStarting={isStarting}
            onComplete={completeAppointment}
            isCompleting={isCompleting}
          />

          {/* Pagination Controls */}
          {meta && (meta.totalPages ?? meta.totalPage ?? 1) > 1 && (
            <div className="flex items-center justify-between pt-4 text-xs text-muted-foreground">
              <span>
                Page {meta.page} of {meta.totalPages ?? meta.totalPage ?? 1} ({meta.total} consultations total)
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => setPage(meta.page - 1)}
                  className="h-8 px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page >= (meta.totalPages ?? meta.totalPage ?? 1)}
                  onClick={() => setPage(meta.page + 1)}
                  className="h-8 px-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DoctorAppointmentsView;
