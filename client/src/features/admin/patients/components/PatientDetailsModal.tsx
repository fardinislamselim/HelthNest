"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  X,
  User,
  ShieldCheck,
  Ban,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useModalFocusTrap } from "@/hooks/useModalFocusTrap";
import type { PatientAdminRecord } from "../../types/admin.types";

interface PatientDetailsModalProps {
  patient: PatientAdminRecord | null;
  open: boolean;
  onClose: () => void;
  onToggleBlock: (patient: PatientAdminRecord, action: "block" | "unblock") => void;
}

export function PatientDetailsModal({
  patient,
  open,
  onClose,
  onToggleBlock,
}: PatientDetailsModalProps) {
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

  if (!open || !patient) return null;

  const formatDateSafe = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? "N/A" : format(d, "MMMM d, yyyy · h:mm a");
    } catch {
      return "N/A";
    }
  };

  const isBlocked = patient.status === "BLOCKED";

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
        aria-labelledby="patient-details-modal-title"
        className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card p-4 sm:p-6 shadow-xl transition-all"
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
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-lg">
            {patient.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="patient-details-modal-title" className="text-xl font-bold tracking-tight">{patient.name}</h2>
              <StatusBadge status={patient.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Patient Account · Registered {formatDateSafe(patient.createdAt)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 pt-4 text-sm">
          {/* Account Details Card */}
          <div className="rounded-lg bg-muted/40 p-3.5 space-y-2.5 text-xs">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" /> Profile Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">Email Address:</span>
                <p className="truncate">{patient.email}</p>
              </div>
              <div>
                <span className="font-medium text-foreground">Contact Phone:</span>
                <p className="truncate">{patient.contactNumber || "Not provided"}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="font-medium text-foreground">Physical Address:</span>
                <p className="truncate">{patient.address || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Account Security & Status */}
          <div className="rounded-lg border border-border p-3.5 space-y-2 text-xs">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Verification & Security
            </p>
            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <div>
                <span>Email Status:</span>
                <p className="font-medium text-foreground">
                  {patient.user.emailVerified ? "Verified Email" : "Unverified"}
                </p>
              </div>
              <div>
                <span>Account Status:</span>
                <p className="font-medium text-foreground">{patient.status}</p>
              </div>
              <div>
                <span>User ID:</span>
                <p className="font-mono text-[11px] text-foreground truncate">{patient.userId}</p>
              </div>
              <div>
                <span>Last Updated:</span>
                <p className="text-[11px] text-foreground">{formatDateSafe(patient.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-6 border-t border-border/60">
          <div>
            {isBlocked ? (
              <Button
                size="sm"
                variant="outline"
                className="text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                onClick={() => onToggleBlock(patient, "unblock")}
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Unblock Patient
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                onClick={() => onToggleBlock(patient, "block")}
              >
                <Ban className="h-3.5 w-3.5 mr-1" /> Block Patient
              </Button>
            )}
          </div>

          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PatientDetailsModal;
