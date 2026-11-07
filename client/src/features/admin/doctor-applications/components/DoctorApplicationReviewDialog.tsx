"use client";

import * as React from "react";
import { X, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  useApproveDoctorMutation,
  useRejectDoctorMutation,
} from "../../hooks/useAdmin";
import type { DoctorAdminRecord } from "../../types/admin.types";

interface DoctorApplicationReviewDialogProps {
  doctor: DoctorAdminRecord | null;
  mode: "approve" | "reject" | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DoctorApplicationReviewDialog({
  doctor,
  mode,
  open,
  onClose,
  onSuccess,
}: DoctorApplicationReviewDialogProps) {
  const [rejectionReason, setRejectionReason] = React.useState("");
  const approveMutation = useApproveDoctorMutation();
  const rejectMutation = useRejectDoctorMutation();

  const isSubmitting = approveMutation.isPending || rejectMutation.isPending;

  const handleClose = React.useCallback(() => {
    setRejectionReason("");
    onClose();
  }, [onClose]);

  // Lock background scroll when open
  React.useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  // Handle Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !isSubmitting) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, isSubmitting, handleClose]);

  if (!open || !doctor || !mode) return null;

  const isApprove = mode === "approve";
  const isEmailVerified = doctor.user?.emailVerified;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isApprove) {
      await approveMutation.mutateAsync(doctor.id);
      onSuccess?.();
      handleClose();
    } else {
      await rejectMutation.mutateAsync({
        doctorId: doctor.id,
        payload: { rejectionReason: rejectionReason.trim() || undefined },
      });
      onSuccess?.();
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && handleClose()}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-card p-4 sm:p-6 shadow-xl transition-all">
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground hover:bg-muted focus:outline-hidden"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                isApprove ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
              }`}
            >
              {isApprove ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <AlertTriangle className="h-6 w-6" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                {isApprove ? "Approve Doctor Application" : "Reject Doctor Application"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Dr. {doctor.name} · {doctor.specialization}
              </p>
            </div>
          </div>

          {isApprove ? (
            <div className="space-y-3 pt-2 text-sm text-muted-foreground">
              <p>
                Approving this application will activate <strong className="text-foreground">{doctor.name}</strong>&apos;s
                practitioner account and dispatch their welcome credential notification to{" "}
                <span className="font-mono text-xs text-foreground">{doctor.email}</span>.
              </p>

              {!isEmailVerified && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    Warning: The doctor has not completed email verification yet. The backend requires email verification before approval can succeed.
                  </span>
                </div>
              )}

              <div className="rounded-lg bg-muted/50 p-3 space-y-1 text-xs">
                <p><strong>License Number:</strong> {doctor.licenseNumber}</p>
                <p><strong>Experience:</strong> {doctor.experienceYears} Years</p>
                <p><strong>Fee:</strong> ${doctor.consultationFee}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">
                Rejecting this application will mark it as rejected. You can optionally provide a reason for administrative records and communication.
              </p>

              <div className="space-y-1.5">
                <Label htmlFor="rejectionReason" className="text-xs font-medium">
                  Rejection Reason (Optional)
                </Label>
                <textarea
                  id="rejectionReason"
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. License could not be verified with the medical council, document unreadable..."
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              variant={isApprove ? "default" : "destructive"}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isApprove ? "Confirm Approval" : "Confirm Rejection"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DoctorApplicationReviewDialog;
