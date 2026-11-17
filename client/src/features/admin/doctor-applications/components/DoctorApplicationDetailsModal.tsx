"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  X,
  FileText,
  Mail,
  ShieldCheck,
  ExternalLink,
  Award,
  DollarSign,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useModalFocusTrap } from "@/hooks/useModalFocusTrap";
import type { DoctorAdminRecord } from "../../types/admin.types";

interface DoctorApplicationDetailsModalProps {
  doctor: DoctorAdminRecord | null;
  open: boolean;
  onClose: () => void;
  onApprove: (doc: DoctorAdminRecord) => void;
  onReject: (doc: DoctorAdminRecord) => void;
}

export function DoctorApplicationDetailsModal({
  doctor,
  open,
  onClose,
  onApprove,
  onReject,
}: DoctorApplicationDetailsModalProps) {
  const dialogRef = useModalFocusTrap<HTMLDivElement>({
    isOpen: open,
    onClose,
  });

  // Lock background scroll
  React.useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  if (!open || !doctor) return null;

  const formatDateSafe = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? "N/A" : format(d, "MMMM d, yyyy · h:mm a");
    } catch {
      return "N/A";
    }
  };

  const isPending = doctor.verificationStatus === "PENDING";

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
        aria-labelledby="doctor-application-modal-title"
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card p-4 sm:p-6 shadow-xl transition-all"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
              {doctor.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="doctor-application-modal-title" className="text-xl font-bold tracking-tight">Dr. {doctor.name}</h2>
                <StatusBadge status={doctor.verificationStatus} />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {doctor.specialization} · Applied {formatDateSafe(doctor.createdAt)}
              </p>
            </div>
          </div>

          {/* Review actions if pending */}
          {isPending && (
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                onClick={() => onReject(doctor)}
              >
                Reject
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => onApprove(doctor)}
              >
                Approve
              </Button>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="space-y-6 pt-4 text-sm">
          {/* Rejection notice if rejected */}
          {doctor.verificationStatus === "REJECTED" && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              <p className="font-semibold">Application Rejected</p>
              <p className="mt-0.5">
                Reason: {doctor.rejectionReason || "No rejection reason provided."}
              </p>
              {doctor.reviewedAt && (
                <p className="mt-1 opacity-80">Reviewed on: {formatDateSafe(doctor.reviewedAt)}</p>
              )}
            </div>
          )}

          {/* Contact & Verification Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-muted/40 p-3 space-y-2">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" /> Contact Details
              </p>
              <p className="text-muted-foreground truncate">
                <strong>Email:</strong> {doctor.email}
              </p>
              <p className="text-muted-foreground truncate">
                <strong>Phone:</strong> {doctor.contactNumber}
              </p>
              <p className="text-muted-foreground truncate">
                <strong>Address:</strong> {doctor.address || "N/A"}
              </p>
            </div>

            <div className="rounded-lg bg-muted/40 p-3 space-y-2">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Credentials & Status
              </p>
              <p className="text-muted-foreground">
                <strong>Medical License:</strong>{" "}
                <span className="font-mono text-foreground font-medium">{doctor.licenseNumber}</span>
              </p>
              <p className="text-muted-foreground">
                <strong>Email Verified:</strong>{" "}
                {doctor.user?.emailVerified ? (
                  <span className="text-emerald-600 font-medium">Verified</span>
                ) : (
                  <span className="text-amber-600 font-medium">Unverified</span>
                )}
              </p>
              <p className="text-muted-foreground">
                <strong>Account Status:</strong> <StatusBadge status={doctor.user?.status || "ACTIVE"} />
              </p>
            </div>
          </div>

          {/* Practice & Qualifications */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-border p-3 text-center">
              <Briefcase className="h-4 w-4 mx-auto text-primary mb-1" />
              <p className="text-xs text-muted-foreground">Clinical Experience</p>
              <p className="text-base font-bold text-foreground">{doctor.experienceYears} Years</p>
            </div>

            <div className="rounded-lg border border-border p-3 text-center">
              <DollarSign className="h-4 w-4 mx-auto text-primary mb-1" />
              <p className="text-xs text-muted-foreground">Consultation Fee</p>
              <p className="text-base font-bold text-foreground">${doctor.consultationFee}</p>
            </div>

            <div className="rounded-lg border border-border p-3 text-center">
              <Award className="h-4 w-4 mx-auto text-primary mb-1" />
              <p className="text-xs text-muted-foreground">Specialization</p>
              <p className="text-base font-bold text-foreground truncate">{doctor.specialization}</p>
            </div>
          </div>

          {/* Qualifications List */}
          {doctor.qualifications && doctor.qualifications.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Degrees & Medical Certifications
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {doctor.qualifications.map((q, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Biography */}
          {doctor.bio && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Professional Statement & Bio
              </h3>
              <p className="rounded-lg bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
                {doctor.bio}
              </p>
            </div>
          )}

          {/* Uploaded Documents */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Submitted Documents & Certificates
            </h3>
            <div className="space-y-2">
              {doctor.resume ? (
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-xs font-medium truncate">Curriculum Vitae / Medical Resume</span>
                  </div>
                  <Button size="sm" variant="outline" asChild className="h-7 text-xs gap-1">
                    <a href={doctor.resume} target="_blank" rel="noopener noreferrer">
                      View Document <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No resume URL uploaded.</p>
              )}

              {doctor.additionalFiles && doctor.additionalFiles.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-medium text-muted-foreground">Additional Supporting Certificates:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {doctor.additionalFiles.map((file, i) => (
                      <div key={i} className="flex items-center justify-between rounded-md border border-border p-2">
                        <span className="text-xs truncate max-w-40">Certificate #{i + 1}</span>
                        <Button size="sm" variant="ghost" asChild className="h-6 text-xs px-2 gap-1">
                          <a href={file} target="_blank" rel="noopener noreferrer">
                            Inspect <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

export default DoctorApplicationDetailsModal;
