"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  X,
  Calendar,
  Clock,
  User,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useModalFocusTrap } from "@/hooks/useModalFocusTrap";
import type { RecentAppointment } from "../../types/admin.types";

interface AdminAppointmentDetailsModalProps {
  appointment: RecentAppointment | null;
  open: boolean;
  onClose: () => void;
}

export function AdminAppointmentDetailsModal({
  appointment,
  open,
  onClose,
}: AdminAppointmentDetailsModalProps) {
  const dialogRef = useModalFocusTrap<HTMLDivElement>({
    isOpen: open,
    onClose,
  });

  React.useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  if (!open || !appointment) return null;

  const formatDateSafe = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? "N/A" : format(d, "MMMM d, yyyy · h:mm a");
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-appointment-modal-title"
        className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-card p-4 sm:p-6 shadow-xl transition-all"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-border/60">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="admin-appointment-modal-title" className="text-lg font-bold tracking-tight">Consultation Record</h2>
              <StatusBadge status={appointment.status} />
            </div>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">
              Ref ID: {appointment.id}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 pt-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Patient Card */}
            <div className="rounded-lg bg-muted/40 p-3 space-y-1.5">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" /> Patient Information
              </p>
              <p className="text-sm font-medium text-foreground">
                {appointment.patient?.name || "Registered Patient"}
              </p>
              {appointment.patient?.id && (
                <p className="text-muted-foreground font-mono text-[11px]">
                  ID: {appointment.patient.id.slice(0, 12)}...
                </p>
              )}
            </div>

            {/* Doctor Card */}
            <div className="rounded-lg bg-muted/40 p-3 space-y-1.5">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5 text-primary" /> Attending Specialist
              </p>
              <p className="text-sm font-medium text-foreground">
                Dr. {appointment.doctor?.name || "Assigned Practitioner"}
              </p>
              {appointment.doctor?.id && (
                <p className="text-muted-foreground font-mono text-[11px]">
                  ID: {appointment.doctor.id.slice(0, 12)}...
                </p>
              )}
            </div>
          </div>

          {/* Schedule Info */}
          <div className="rounded-lg border border-border p-3.5 space-y-2">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" /> Consultation Slot
            </p>
            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <div>
                <span>Consultation Date:</span>
                <p className="font-medium text-foreground">
                  {appointment.schedule?.date || "N/A"}
                </p>
              </div>
              <div>
                <span>Start Time:</span>
                <p className="font-medium text-foreground">
                  {appointment.schedule?.startTime || "N/A"}
                </p>
              </div>
              <div className="col-span-2 pt-1 border-t border-border/40">
                <span>Booked On:</span>
                <p className="text-foreground">{formatDateSafe(appointment.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 mt-6 border-t border-border/60">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminAppointmentDetailsModal;
