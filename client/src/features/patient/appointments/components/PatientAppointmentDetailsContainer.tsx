"use client";

import * as React from "react";
import { useAppointmentDetails } from "@/features/patient/appointments/hooks/useAppointmentDetails";
import { useCancelAppointment } from "@/features/patient/appointments/hooks/useCancelAppointment";
import {
  AppointmentDetailsView,
  AppointmentCancellationDialog,
} from "./index";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface PatientAppointmentDetailsContainerProps {
  appointmentId: string;
}

export function PatientAppointmentDetailsContainer({
  appointmentId,
}: PatientAppointmentDetailsContainerProps) {
  const { appointment, isLoading, isError, error, refetch } =
    useAppointmentDetails(appointmentId);
  const { cancelAppointment, isCancelling } = useCancelAppointment();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false);

  const handleConfirmCancel = async () => {
    if (!appointment) return;
    try {
      await cancelAppointment(appointment.id);
      setIsCancelDialogOpen(false);
      refetch();
    } catch {
      // Handled by hook toast
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Consultation Details"
          description="Review video consultation information and doctor instructions"
        />
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner size="lg" label="Loading appointment records..." />
        </div>
      </div>
    );
  }

  if (isError || !appointment) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Consultation Details"
          description="Review video consultation information and doctor instructions"
        />
        <ErrorState
          title="Appointment not found"
          message={error?.message || "Could not retrieve appointment details from the server."}
          onRetry={() => refetch()}
          className="my-8"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consultation Details"
        description={`Record for appointment #${appointment.serialNumber ?? "—"}`}
      />

      <AppointmentDetailsView
        appointment={appointment}
        onRequestCancel={() => setIsCancelDialogOpen(true)}
      />

      <AppointmentCancellationDialog
        appointment={appointment}
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        onConfirm={handleConfirmCancel}
        isCancelling={isCancelling}
      />
    </div>
  );
}

export default PatientAppointmentDetailsContainer;
