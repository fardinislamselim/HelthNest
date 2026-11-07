"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Stethoscope,
  Search,
  RefreshCw,
  Eye,
  Ban,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllDoctors } from "../../hooks/useAdmin";
import { DoctorApplicationDetailsModal } from "../../doctor-applications/components/DoctorApplicationDetailsModal";
import { DoctorApplicationReviewDialog } from "../../doctor-applications/components/DoctorApplicationReviewDialog";
import { DoctorBlockDialog } from "./DoctorBlockDialog";
import type { DoctorAdminRecord } from "../../types/admin.types";

export function DoctorManagementView() {
  const { data: doctors = [], isLoading, isFetching, refetch } = useAllDoctors();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [accountStatusFilter, setAccountStatusFilter] = React.useState<"ALL" | "ACTIVE" | "BLOCKED">("ALL");
  const [verificationFilter, setVerificationFilter] = React.useState<"ALL" | "APPROVED" | "PENDING" | "REJECTED">("ALL");

  const [selectedDoctor, setSelectedDoctor] = React.useState<DoctorAdminRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  const [blockDoctor, setBlockDoctor] = React.useState<DoctorAdminRecord | null>(null);
  const [blockMode, setBlockMode] = React.useState<"block" | "unblock" | null>(null);

  const [reviewDoctor, setReviewDoctor] = React.useState<DoctorAdminRecord | null>(null);
  const [reviewMode, setReviewMode] = React.useState<"approve" | "reject" | null>(null);

  const filteredDoctors = React.useMemo(() => {
    let result = Array.isArray(doctors) ? doctors : [];

    if (accountStatusFilter !== "ALL") {
      result = result.filter((doc) => doc.user?.status === accountStatusFilter);
    }

    if (verificationFilter !== "ALL") {
      result = result.filter((doc) => doc.verificationStatus === verificationFilter);
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
  }, [doctors, accountStatusFilter, verificationFilter, searchQuery]);

  const formatDateSafe = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? "N/A" : format(d, "MMM d, yyyy");
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Doctor Directory & Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage practicing specialists, inspect credentials, and manage active or blocked account states.
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
          Refresh Directory
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-xs">
        <CardContent className="p-3 sm:p-4 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by doctor name, email, specialization, or license..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs sm:text-sm"
              />
            </div>

            {/* Account Status Filter */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/60 rounded-lg text-xs self-start md:self-auto">
              <span className="text-[11px] font-medium text-muted-foreground px-2">Account:</span>
              <Button
                size="sm"
                variant={accountStatusFilter === "ALL" ? "default" : "ghost"}
                className="h-7 text-xs px-2.5 rounded-md"
                onClick={() => setAccountStatusFilter("ALL")}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={accountStatusFilter === "ACTIVE" ? "default" : "ghost"}
                className="h-7 text-xs px-2.5 rounded-md"
                onClick={() => setAccountStatusFilter("ACTIVE")}
              >
                Active
              </Button>
              <Button
                size="sm"
                variant={accountStatusFilter === "BLOCKED" ? "default" : "ghost"}
                className="h-7 text-xs px-2.5 rounded-md"
                onClick={() => setAccountStatusFilter("BLOCKED")}
              >
                Blocked
              </Button>
            </div>
          </div>

          {/* Verification Status Sub-filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border/40">
            <span className="font-medium mr-1">Verification:</span>
            {(["ALL", "APPROVED", "PENDING", "REJECTED"] as const).map((v) => (
              <Button
                key={v}
                size="sm"
                variant={verificationFilter === v ? "secondary" : "ghost"}
                className="h-6 text-[11px] px-2 py-0"
                onClick={() => setVerificationFilter(v)}
              >
                {v}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Doctors Table Card */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Practitioners ({filteredDoctors.length})
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              Total registered doctors: {doctors.length}
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
                icon={Stethoscope}
                title="No doctors found"
                description={
                  searchQuery
                    ? `No doctors matched "${searchQuery}".`
                    : "No doctors match the selected account status filters."
                }
              />
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                    <tr>
                      <th className="p-3 font-semibold">Doctor</th>
                      <th className="p-3 font-semibold">Specialization</th>
                      <th className="p-3 font-semibold">License #</th>
                      <th className="p-3 font-semibold">Account Status</th>
                      <th className="p-3 font-semibold">Verification</th>
                      <th className="p-3 font-semibold">Joined</th>
                      <th className="p-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredDoctors.map((doc) => {
                      const isBlocked = doc.user?.status === "BLOCKED";
                      return (
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
                          <td className="p-3">
                            <StatusBadge status={doc.user?.status || "ACTIVE"} />
                          </td>
                          <td className="p-3">
                            <StatusBadge status={doc.verificationStatus} />
                          </td>
                          <td className="p-3 text-muted-foreground">{formatDateSafe(doc.createdAt)}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 px-2 text-xs"
                                onClick={() => {
                                  setSelectedDoctor(doc);
                                  setIsDetailsOpen(true);
                                }}
                                title="Inspect Details"
                              >
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>

                              {isBlocked ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                                  onClick={() => {
                                    setBlockDoctor(doc);
                                    setBlockMode("unblock");
                                  }}
                                  title="Unblock Doctor"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Unblock
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                  onClick={() => {
                                    setBlockDoctor(doc);
                                    setBlockMode("block");
                                  }}
                                  title="Block Doctor"
                                >
                                  <Ban className="h-3.5 w-3.5 mr-1" /> Block
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (< 640px) */}
              <div className="sm:hidden divide-y divide-border">
                {filteredDoctors.map((doc) => {
                  const isBlocked = doc.user?.status === "BLOCKED";
                  return (
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
                        <div className="flex flex-col items-end gap-1">
                          <StatusBadge status={doc.user?.status || "ACTIVE"} />
                          <StatusBadge status={doc.verificationStatus} />
                        </div>
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
                          onClick={() => {
                            setSelectedDoctor(doc);
                            setIsDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> View Details
                        </Button>

                        {isBlocked ? (
                          <Button
                            size="sm"
                            className="flex-1 h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => {
                              setBlockDoctor(doc);
                              setBlockMode("unblock");
                            }}
                          >
                            Unblock
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1 h-8 text-xs"
                            onClick={() => {
                              setBlockDoctor(doc);
                              setBlockMode("block");
                            }}
                          >
                            Block
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Doctor Details Modal */}
      <DoctorApplicationDetailsModal
        doctor={selectedDoctor}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onApprove={(doc: DoctorAdminRecord) => {
          setIsDetailsOpen(false);
          setReviewDoctor(doc);
          setReviewMode("approve");
        }}
        onReject={(doc: DoctorAdminRecord) => {
          setIsDetailsOpen(false);
          setReviewDoctor(doc);
          setReviewMode("reject");
        }}
      />

      {/* Block / Unblock Dialog */}
      <DoctorBlockDialog
        doctor={blockDoctor}
        mode={blockMode}
        open={Boolean(blockMode)}
        onClose={() => {
          setBlockMode(null);
          setBlockDoctor(null);
        }}
        onSuccess={() => {
          refetch();
        }}
      />

      {/* Review Dialog if triggered from details */}
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

export default DoctorManagementView;
