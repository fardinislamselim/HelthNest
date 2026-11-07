"use client";

import * as React from "react";
import { X, Download, FileText, User, Calendar, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PrescriptionMedicinesTable } from "./PrescriptionMedicinesTable";
import { patientPrescriptionService } from "../services/prescription.service";
import type { PatientPrescriptionItem } from "../types/prescription.types";

interface PrescriptionDetailsDialogProps {
  prescription: PatientPrescriptionItem | null;
  open: boolean;
  onClose: () => void;
}

export function PrescriptionDetailsDialog({
  prescription,
  open,
  onClose,
}: PrescriptionDetailsDialogProps) {
  const [isDownloading, setIsDownloading] = React.useState(false);

  // Prevent background scroll when dialog is open
  React.useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !prescription) return null;

  const formattedDate = new Date(prescription.createdAt).toLocaleDateString("en-US", {
    dateStyle: "full",
  });

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const blob = await patientPrescriptionService.downloadPdf(prescription.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription-${prescription.id.slice(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Prescription PDF downloaded successfully");
    } catch {
      toast.error("Failed to generate and download prescription PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-50 w-full max-w-2xl rounded-xl border border-border bg-card p-4 sm:p-6 shadow-2xl space-y-5 animate-in fade-in-0 zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/60 pb-3 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-9 sm:h-10 w-9 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileText className="h-4 sm:h-5 w-4 sm:w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
                Digital Prescription
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                Issued by Dr. {prescription.doctor.name} ({prescription.doctor.specialization})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground shrink-0"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Doctor & Date Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs">
          <div>
            <span className="font-semibold text-muted-foreground uppercase text-[10px]">
              Prescribing Doctor
            </span>
            <p className="font-bold text-foreground text-sm flex items-center gap-1.5 mt-0.5 truncate">
              <User className="h-3.5 w-3.5 text-primary shrink-0" />
              Dr. {prescription.doctor.name}
            </p>
            <p className="text-muted-foreground truncate">
              {prescription.doctor.qualifications} • {prescription.doctor.specialization}
            </p>
          </div>
          <div className="sm:text-right">
            <span className="font-semibold text-muted-foreground uppercase text-[10px]">
              Consultation Date
            </span>
            <p className="font-bold text-foreground text-sm flex items-center sm:justify-end gap-1.5 mt-0.5">
              <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
              {formattedDate}
            </p>
            <p className="text-muted-foreground font-mono text-[11px]">
              Ref: #{prescription.id.slice(0, 8)}
            </p>
          </div>
        </div>

        {/* Clinical Findings & Diagnosis */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Clinical Findings & Diagnosis
          </h4>
          <div className="p-3.5 rounded-lg border border-border/70 bg-card text-xs text-foreground whitespace-pre-wrap leading-relaxed">
            {prescription.keyFindings || "No clinical observations noted."}
          </div>
        </div>

        {/* Prescribed Medicines Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Prescribed Medications (Rx)
          </h4>
          <PrescriptionMedicinesTable medicines={prescription.medicines} />
        </div>

        {/* Additional Doctor Instructions */}
        {prescription.additionalInstructions && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Doctor Advice & Follow-Up
            </h4>
            <div className="p-3.5 rounded-lg border border-border/70 bg-card text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {prescription.additionalInstructions}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border/60 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto text-xs"
          >
            Close
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="w-full sm:w-auto gap-2 shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF Document
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PrescriptionDetailsDialog;
