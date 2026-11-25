"use client";

import * as React from "react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { formatDoctorName } from "@/lib/format-name";
import type { PatientAppointmentItem } from "../types/appointment.types";

interface AppointmentCancellationDialogProps {
  appointment: PatientAppointmentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isCancelling?: boolean;
}

export function AppointmentCancellationDialog({
  appointment,
  open,
  onOpenChange,
  onConfirm,
  isCancelling = false,
}: AppointmentCancellationDialogProps) {
  if (!appointment) return null;

  const doctorName = formatDoctorName(appointment.doctor?.name);
  const scheduleTime = `${appointment.schedule?.date ?? "the scheduled date"} at ${
    appointment.schedule?.startTime ?? "the scheduled time"
  }`;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Cancel Consultation Appointment?"
      description={`Are you sure you want to cancel your consultation with ${doctorName} scheduled for ${scheduleTime}? Please note: Cancellations made more than 1 hour prior to the schedule start time are eligible for a refund. Cancellations within 1 hour or during the consultation are strictly non-refundable.`}
      confirmLabel="Yes, Cancel Appointment"
      cancelLabel="Keep Appointment"
      variant="destructive"
      isLoading={isCancelling}
      onConfirm={onConfirm}
    />
  );
}

export default AppointmentCancellationDialog;
