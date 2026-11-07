"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Plus,
  Download,
  Eye,
  Calendar,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PrescriptionDetailsModal } from "./PrescriptionDetailsModal";
import { doctorPrescriptionService } from "../services/prescription.service";
import { doctorDashboardService } from "@/features/doctor/dashboard/services/dashboard.service";
import { doctorAppointmentService } from "@/features/doctor/appointments/services/appointment.service";
import type { DoctorPrescriptionItem } from "../types/prescription.types";

export function DoctorPrescriptionsView() {
  const router = useRouter();
  const [selectedPrescription, setSelectedPrescription] =
    React.useState<DoctorPrescriptionItem | null>(null);
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null);

  // 1. Fetch dashboard to get recent prescriptions
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["doctor", "dashboard"],
    queryFn: async () => {
      const res = await doctorDashboardService.getDashboardStats();
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  // 2. Fetch completed appointments that might need prescriptions
  const { data: completedAptsData } = useQuery({
    queryKey: ["doctor", "appointments", "completed-for-rx"],
    queryFn: async () => {
      const res = await doctorAppointmentService.getMyAppointments({
        status: "COMPLETED",
        limit: 10,
      });
      return res.data.appointments;
    },
    staleTime: 60 * 1000,
  });

  const handleDownloadPdf = async (id: string) => {
    try {
      setDownloadingId(id);
      const blob = await doctorPrescriptionService.downloadPdf(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Prescription-${id.slice(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Prescription PDF downloaded successfully!");
    } catch {
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleOpenDetails = async (id: string) => {
    try {
      const res = await doctorPrescriptionService.getPrescriptionById(id);
      setSelectedPrescription(res.data);
    } catch {
      toast.error("Could not load prescription details.");
    }
  };

  const recentPrescriptions = dashboardData?.prescriptions.recent || [];
  const completedApts = completedAptsData || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Digital Prescriptions"
        description="Issue verified pharmaceutical prescriptions for completed sessions and generate official downloadable PDFs"
      >
        <Button size="sm" asChild className="gap-1.5 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white">
          <Link href="/doctor/prescriptions/create">
            <Plus className="h-4 w-4" />
            <span>Create Prescription</span>
          </Link>
        </Button>
      </PageHeader>

      {/* Section 1: Completed Consultations Ready for Rx */}
      {completedApts.length > 0 && (
        <Card className="shadow-xs border-indigo-500/20 bg-indigo-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                <CardTitle className="text-sm font-semibold">
                  Completed Consultations Ready for Prescribing ({completedApts.length})
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {completedApts.slice(0, 3).map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 rounded-lg border border-border/70 bg-card flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                      {apt.patient?.name || "Patient"}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate font-mono">
                      {apt.schedule?.date} • Slot #{apt.slot?.serialNumber}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    asChild
                    className="h-7 text-xs gap-1 bg-indigo-600 hover:bg-indigo-700 text-white w-full"
                  >
                    <Link href={`/doctor/prescriptions/create?appointmentId=${apt.id}`}>
                      <Plus className="h-3 w-3" />
                      <span>Issue Prescription</span>
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 2: Recent Prescriptions Issued */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span>Issued Digital Prescriptions</span>
        </h3>

        {isDashboardLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="shadow-xs">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentPrescriptions.length === 0 ? (
          <EmptyState
            title="No prescriptions issued yet"
            description="When you finish a patient consultation, you can prescribe medications and generate an official PDF here."
            actionLabel="Issue First Prescription"
            onAction={() => router.push("/doctor/prescriptions/create")}
          />
        ) : (
          <div className="space-y-3">
            {recentPrescriptions.map((rx) => {
              const formattedDate = rx.createdAt
                ? format(new Date(rx.createdAt), "MMMM d, yyyy")
                : "Recent";
              const isDownloading = downloadingId === rx.id;

              return (
                <Card
                  key={rx.id}
                  className="shadow-xs hover:border-primary/40 transition-colors"
                >
                  <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-semibold text-foreground truncate">
                            {rx.patient?.name || "Patient"}
                          </h4>
                          <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            Rx #{rx.id.slice(0, 8)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-primary" />
                            Issued on {formattedDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto pt-2 sm:pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDetails(rx.id)}
                        className="h-8 text-xs gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Rx</span>
                      </Button>

                      <Button
                        variant="default"
                        size="sm"
                        disabled={isDownloading}
                        onClick={() => handleDownloadPdf(rx.id)}
                        className="h-8 text-xs gap-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        {isDownloading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                        <span>PDF</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Prescription Details Modal */}
      <PrescriptionDetailsModal
        prescription={selectedPrescription}
        open={Boolean(selectedPrescription)}
        onOpenChange={(open) => !open && setSelectedPrescription(null)}
      />
    </div>
  );
}

export default DoctorPrescriptionsView;
