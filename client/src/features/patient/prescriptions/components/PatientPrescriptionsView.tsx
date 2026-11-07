"use client";

import * as React from "react";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { usePrescriptions } from "@/features/patient/prescriptions/hooks/usePrescriptions";
import {
  PrescriptionCard,
  PrescriptionDetailsDialog,
} from "./index";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import type { PatientPrescriptionItem } from "../types/prescription.types";

export function PatientPrescriptionsView() {
  const [page, setPage] = React.useState(1);
  const [activePrescription, setActivePrescription] =
    React.useState<PatientPrescriptionItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { prescriptions, meta, isLoading, isError, error, refetch } =
    usePrescriptions({ page, limit: 9 });

  const handleOpenDetails = (rx: PatientPrescriptionItem) => {
    setActivePrescription(rx);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prescriptions & Treatment Records"
        description="View electronic prescriptions and clinical instructions issued by your doctors"
      />

      {isError ? (
        <ErrorState
          title="Failed to load prescriptions"
          message={error?.message || "Could not retrieve prescription records from the server."}
          onRetry={() => refetch()}
          className="my-8"
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-56 rounded-xl border border-border/80 bg-card p-4 animate-pulse space-y-3"
            >
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-48 bg-muted/60 rounded" />
              <div className="h-16 rounded bg-muted/40" />
            </div>
          ))}
        </div>
      ) : prescriptions.length === 0 ? (
        <EmptyState
          title="No Prescriptions Issued"
          description="Your doctors will issue digital prescriptions following completed video consultations. Once issued, you can view the medication schedule and download certified PDF documents here."
          icon={FileText}
          className="my-8 py-12"
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.map((rx) => (
              <PrescriptionCard
                key={rx.id}
                prescription={rx}
                onViewDetails={handleOpenDetails}
              />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPage > 1 && (
            <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
              <span>
                Showing page {meta.page} of {meta.totalPage} ({meta.total} prescriptions total)
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
        </div>
      )}

      <PrescriptionDetailsDialog
        prescription={activePrescription}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}

export default PatientPrescriptionsView;
