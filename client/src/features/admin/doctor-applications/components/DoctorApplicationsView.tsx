"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  FileCheck,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { usePendingDoctors, useAllDoctors } from "../../hooks/useAdmin";
import { DoctorApplicationDetailsModal } from "./DoctorApplicationDetailsModal";
import { DoctorApplicationReviewDialog } from "./DoctorApplicationReviewDialog";
import type { DoctorAdminRecord } from "../../types/admin.types";

export function DoctorApplicationsView() {
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDoctor, setSelectedDoctor] = React.useState<DoctorAdminRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [reviewDoctor, setReviewDoctor] = React.useState<DoctorAdminRecord | null>(null);
  const [reviewMode, setReviewMode] = React.useState<"approve" | "reject" | null>(null);

  // When filtering PENDING, use the pending query which checks emailVerified; otherwise all doctors
  const pendingQuery = usePendingDoctors();
  const allDoctorsQuery = useAllDoctors();

  const isPendingView = statusFilter === "PENDING";
  const activeQuery = isPendingView ? pendingQuery : allDoctorsQuery;
  const { data: rawDoctors = [], isLoading, isFetching, refetch } = activeQuery;

  // Filter and search
  const filteredDoctors = React.useMemo(() => {
    let result = Array.isArray(rawDoctors) ? rawDoctors : [];

    // Filter status if not using the pending endpoint
    if (!isPendingView && statusFilter !== "ALL") {
      result = result.filter((doc) => doc.verificationStatus === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.email.toLowerCase().includes(q) ||
          doc.specialization.toLowerCase().includes(q) ||
          doc.licenseNumber.toLowerCase().includes(q),
      );
    }

    return result;
  }, [rawDoctors, isPendingView, statusFilter, searchQuery]);

  const formatDateSafe = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? "N/A" : format(d, "MMM d, yyyy");
    } catch {
      return "N/A";
    }
  };

  const handleOpenDetails = (doc: DoctorAdminRecord) => {
    setSelectedDoctor(doc);
    setIsDetailsOpen(true);
  };

  const handleOpenReview = (doc: DoctorAdminRecord, mode: "approve" | "reject") => {
    setReviewDoctor(doc);
    setReviewMode(mode);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Doctor Application Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Audit medical credentials, verify state medical council licenses, and approve or reject applications.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2 self-start sm:self-auto shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="shadow-xs">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by practitioner name, email, specialization, or license..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs sm:text-sm"
              />
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/60 rounded-lg text-xs self-start md:self-auto">
              <Button
                size="sm"
                variant={statusFilter === "PENDING" ? "default" : "ghost"}
                className="h-8 text-xs px-3 rounded-md"
                onClick={() => setStatusFilter("PENDING")}
              >
                Pending
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "APPROVED" ? "default" : "ghost"}
                className="h-8 text-xs px-3 rounded-md"
                onClick={() => setStatusFilter("APPROVED")}
              >
                Approved
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "REJECTED" ? "default" : "ghost"}
                className="h-8 text-xs px-3 rounded-md"
                onClick={() => setStatusFilter("REJECTED")}
              >
                Rejected
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "ALL" ? "default" : "ghost"}
                className="h-8 text-xs px-3 rounded-md"
                onClick={() => setStatusFilter("ALL")}
              >
                All Applications
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Applications ({filteredDoctors.length})
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              Showing {statusFilter.toLowerCase()} applications
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          {isLoading ? (
            <div className="space-y-3 p-4 sm:p-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={FileCheck}
                title="No applications found"
                description={
                  searchQuery
                    ? `No applications matched "${searchQuery}". Try modifying your search criteria.`
                    : `There are currently no ${statusFilter.toLowerCase()} doctor applications.`
                }
              />
            </div>
          ) : (
            <>
              {/* Desktop / Tablet Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                    <tr>
                      <th className="p-3 font-semibold">Doctor</th>
                      <th className="p-3 font-semibold">Specialization</th>
                      <th className="p-3 font-semibold">License #</th>
                      <th className="p-3 font-semibold">Experience</th>
                      <th className="p-3 font-semibold">Submitted</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredDoctors.map((doc) => (
                      <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                              {doc.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">Dr. {doc.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{doc.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground truncate max-w-[150px]">
                          {doc.specialization}
                        </td>
                        <td className="p-3 font-mono text-xs">{doc.licenseNumber}</td>
                        <td className="p-3 text-muted-foreground">{doc.experienceYears} Years</td>
                        <td className="p-3 text-muted-foreground">{formatDateSafe(doc.createdAt)}</td>
                        <td className="p-3">
                          <StatusBadge status={doc.verificationStatus} />
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2 text-xs"
                              onClick={() => handleOpenDetails(doc)}
                              title="Inspect Application"
                            >
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>

                            {doc.verificationStatus === "PENDING" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                                  onClick={() => handleOpenReview(doc, "approve")}
                                  title="Approve Practitioner"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                  onClick={() => handleOpenReview(doc, "reject")}
                                  title="Reject Application"
                                >
                                  <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (< 640px) */}
              <div className="sm:hidden divide-y divide-border">
                {filteredDoctors.map((doc) => (
                  <div key={doc.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                          {doc.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">Dr. {doc.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{doc.email}</p>
                        </div>
                      </div>
                      <StatusBadge status={doc.verificationStatus} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-muted/30 p-2.5 rounded-lg">
                      <div>
                        <span className="text-muted-foreground">Specialization:</span>
                        <p className="font-medium truncate">{doc.specialization}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">License:</span>
                        <p className="font-mono font-medium truncate">{doc.licenseNumber}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Experience:</span>
                        <p className="font-medium">{doc.experienceYears} Years</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fee:</span>
                        <p className="font-medium">${doc.consultationFee}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 text-xs"
                        onClick={() => handleOpenDetails(doc)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> Details
                      </Button>

                      {doc.verificationStatus === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            className="flex-1 h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleOpenReview(doc, "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 px-2.5 text-xs"
                            onClick={() => handleOpenReview(doc, "reject")}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <DoctorApplicationDetailsModal
        doctor={selectedDoctor}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onApprove={(doc) => {
          setIsDetailsOpen(false);
          handleOpenReview(doc, "approve");
        }}
        onReject={(doc) => {
          setIsDetailsOpen(false);
          handleOpenReview(doc, "reject");
        }}
      />

      {/* Review Dialog */}
      <DoctorApplicationReviewDialog
        doctor={reviewDoctor}
        mode={reviewMode}
        open={Boolean(reviewMode)}
        onClose={() => {
          setReviewMode(null);
          setReviewDoctor(null);
        }}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}

export default DoctorApplicationsView;
