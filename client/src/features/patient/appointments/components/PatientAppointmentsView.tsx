"use client";

import * as React from "react";
import Link from "next/link";
import { PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppointments } from "@/features/patient/appointments/hooks/useAppointments";
import { useCancelAppointment } from "@/features/patient/appointments/hooks/useCancelAppointment";
import {
  AppointmentFilters,
  AppointmentTable,
  AppointmentCancellationDialog,
} from "./index";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/ErrorState";
import type {
  AppointmentStatus,
  PatientAppointmentItem,
} from "../types/appointment.types";

export function PatientAppointmentsView() {
  const [status, setStatus] = React.useState<AppointmentStatus | "">("");
  const [date, setDate] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);
  const [selectedToCancel, setSelectedToCancel] = React.useState<PatientAppointmentItem | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState<boolean>(false);

  const { appointments, meta, isLoading, isError, error, refetch } = useAppointments({
    status,
    date,
    page,
    limit: 10,
  });

  const { cancelAppointment, isCancelling } = useCancelAppointment();

  const handleRequestCancel = (appt: PatientAppointmentItem) => {
    setSelectedToCancel(appt);
    setIsCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedToCancel) return;
    try {
      await cancelAppointment(selectedToCancel.id);
      setIsCancelDialogOpen(false);
      setSelectedToCancel(null);
    } catch {
      // Error handled by hook toast
    }
  };

  const handleResetFilters = () => {
    setStatus("");
    setDate("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="My Consultations"
          description="View, manage, and join your scheduled and past doctor video appointments"
        />
        <Button asChild className="gap-2 shadow-xs self-start sm:self-auto">
          <Link href="/dashboard/schedules">
            <PlusCircle className="h-4 w-4" />
            Book Consultation
          </Link>
        </Button>
      </div>

      <AppointmentFilters
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        date={date}
        onDateChange={(val) => {
          setDate(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {isError ? (
        <ErrorState
          title="Failed to load appointments"
          message={error?.message || "Could not retrieve appointments from the server."}
          onRetry={() => refetch()}
          className="my-8"
        />
      ) : (
        <AppointmentTable
          appointments={appointments}
          isLoading={isLoading}
          onRequestCancel={handleRequestCancel}
        />
      )}

      {/* Pagination Controls */}
      {meta && meta.totalPage > 1 && (
        <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <span>
            Showing page {meta.page} of {meta.totalPage} ({meta.total} appointments total)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="gap-1 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPage || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="gap-1 text-xs"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      <AppointmentCancellationDialog
        appointment={selectedToCancel}
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        onConfirm={handleConfirmCancel}
        isCancelling={isCancelling}
      />
    </div>
  );
}

export default PatientAppointmentsView;
