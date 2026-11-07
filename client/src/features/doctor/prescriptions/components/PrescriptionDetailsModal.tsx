"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  FileText,
  Download,
  Loader2,
  X,
  Pill,
  User,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { doctorPrescriptionService } from "../services/prescription.service";
import type { DoctorPrescriptionItem } from "../types/prescription.types";

interface PrescriptionDetailsModalProps {
  prescription: DoctorPrescriptionItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrescriptionDetailsModal({
  prescription,
  open,
  onOpenChange,
}: PrescriptionDetailsModalProps) {
  const [isDownloading, setIsDownloading] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open || !prescription) return null;

  const formattedDate = prescription.createdAt
    ? format(new Date(prescription.createdAt), "MMMM d, yyyy")
    : "N/A";

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      const blob = await doctorPrescriptionService.downloadPdf(prescription.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Prescription-${prescription.id.slice(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Prescription PDF downloaded successfully!");
    } catch {
      toast.error("Failed to download prescription PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card p-4 sm:p-6 shadow-xl space-y-5 animate-in fade-in-0 zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Digital Medical Prescription
              </h3>
              <p className="text-xs text-muted-foreground">
                Ref: {prescription.id}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Patient & Date Meta */}
        <div className="grid grid-cols-2 gap-3 bg-muted/30 p-3 rounded-lg border border-border/50 text-xs">
          <div className="space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3 text-primary" />
              Patient
            </span>
            <p className="font-semibold text-foreground">
              {prescription.patient?.name || "Patient"}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3 text-primary" />
              Date Issued
            </span>
            <p className="font-semibold text-foreground">{formattedDate}</p>
          </div>
        </div>

        {/* Clinical Findings */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Clinical Diagnosis &amp; Findings
          </h4>
          <div className="bg-muted/40 p-3 rounded-lg border border-border/50 text-xs text-foreground whitespace-pre-wrap leading-relaxed">
            {prescription.keyFindings}
          </div>
        </div>

        {/* Medications Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Pill className="h-3.5 w-3.5 text-primary" />
            Prescribed Medications ({prescription.medicines?.length || 0})
          </h4>

          <div className="rounded-lg border border-border/70 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border/60 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-2 px-3">Medicine</th>
                    <th className="py-2 px-3">Dosage</th>
                    <th className="py-2 px-3">Frequency</th>
                    <th className="py-2 px-3">Duration</th>
                    <th className="py-2 px-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-foreground">
                  {prescription.medicines?.map((med, i) => (
                    <tr key={i} className="hover:bg-muted/20">
                      <td className="py-2.5 px-3 font-semibold text-primary">{med.name}</td>
                      <td className="py-2.5 px-3 font-mono">{med.dosage}</td>
                      <td className="py-2.5 px-3">{med.frequency}</td>
                      <td className="py-2.5 px-3">{med.duration}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{med.instructions || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Additional Instructions */}
        {prescription.additionalInstructions && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Additional Clinical Guidance
            </h4>
            <div className="bg-muted/40 p-3 rounded-lg border border-border/50 text-xs text-foreground whitespace-pre-wrap leading-relaxed">
              {prescription.additionalInstructions}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            size="sm"
            disabled={isDownloading}
            onClick={handleDownloadPdf}
            className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Downloading PDF...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download Official PDF</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PrescriptionDetailsModal;
