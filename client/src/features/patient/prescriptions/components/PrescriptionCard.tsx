"use client";

import * as React from "react";
import { FileText, Calendar, Download, Eye, Pill, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { patientPrescriptionService } from "../services/prescription.service";
import type { PatientPrescriptionItem } from "../types/prescription.types";

interface PrescriptionCardProps {
  prescription: PatientPrescriptionItem;
  onViewDetails: (prescription: PatientPrescriptionItem) => void;
}

export function PrescriptionCard({
  prescription,
  onViewDetails,
}: PrescriptionCardProps) {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const formattedDate = new Date(prescription.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <Card className="shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between border-border/80 min-w-0">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-1.5 truncate">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                Dr. {prescription.doctor.name}
              </h3>
              <p className="text-xs font-semibold text-primary truncate">
                {prescription.doctor.specialization}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-[11px] font-semibold gap-1 shrink-0">
            <Pill className="h-3 w-3 text-primary" />
            {prescription.medicines.length} Meds
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>Issued on {formattedDate}</span>
        </div>

        <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
          <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider block mb-1">
            Clinical Diagnosis
          </span>
          <p className="text-foreground line-clamp-2 leading-relaxed">
            {prescription.keyFindings || "Routine consultation follow-up and prescription instructions."}
          </p>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(prescription)}
          className="gap-1.5 text-xs w-full sm:flex-1"
        >
          <Eye className="h-3.5 w-3.5" />
          View Prescription
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          disabled={isDownloading}
          className="gap-1.5 text-xs text-muted-foreground hover:text-emerald-600 w-full sm:w-auto"
          title="Download PDF"
        >
          {isDownloading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          <span>PDF</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PrescriptionCard;
