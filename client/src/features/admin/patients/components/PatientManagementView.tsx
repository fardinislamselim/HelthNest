"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Users,
  Search,
  RefreshCw,
  Eye,
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { usePatientsList } from "../../hooks/useAdmin";
import { PatientBlockDialog } from "./PatientBlockDialog";
import { PatientDetailsModal } from "./PatientDetailsModal";
import type { PatientAdminRecord } from "../../types/admin.types";
import type { UserStatus } from "@/types/user";

export function PatientManagementView() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<UserStatus | undefined>(undefined);

  const [selectedPatient, setSelectedPatient] = React.useState<PatientAdminRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  const [blockPatient, setBlockPatient] = React.useState<PatientAdminRecord | null>(null);
  const [blockMode, setBlockMode] = React.useState<"block" | "unblock" | null>(null);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching, refetch } = usePatientsList({
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter,
  });

  const patients = data?.patients || [];
  const meta = data?.meta || { page: 1, limit: 10, total: 0, totalPages: 0 };

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Patient Account Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Audit registered patients, account verifications, and manage account statuses across the platform.
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
          Refresh List
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-xs">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patient by name, email, phone number, or address..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 text-xs sm:text-sm"
              />
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/60 rounded-lg text-xs self-start md:self-auto">
              <span className="text-[11px] font-medium text-muted-foreground px-2">Status:</span>
              <Button
                size="sm"
                variant={statusFilter === undefined ? "default" : "ghost"}
                className="h-7 text-xs px-2.5 rounded-md"
                onClick={() => {
                  setStatusFilter(undefined);
                  setPage(1);
                }}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "ACTIVE" ? "default" : "ghost"}
                className="h-7 text-xs px-2.5 rounded-md"
                onClick={() => {
                  setStatusFilter("ACTIVE");
                  setPage(1);
                }}
              >
                Active
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "BLOCKED" ? "default" : "ghost"}
                className="h-7 text-xs px-2.5 rounded-md"
                onClick={() => {
                  setStatusFilter("BLOCKED");
                  setPage(1);
                }}
              >
                Blocked
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Table Card */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Patients ({meta.total})
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              Page {meta.page} of {Math.max(1, meta.totalPages)}
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
          ) : patients.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={Users}
                title="No patients found"
                description={
                  searchTerm
                    ? `No patient records match "${searchTerm}".`
                    : "No patients currently found with the selected filter."
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
                      <th className="p-3 font-semibold">Patient</th>
                      <th className="p-3 font-semibold">Contact Phone</th>
                      <th className="p-3 font-semibold">Account Status</th>
                      <th className="p-3 font-semibold">Email Verified</th>
                      <th className="p-3 font-semibold">Registered</th>
                      <th className="p-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {patients.map((pat) => {
                      const isBlocked = pat.status === "BLOCKED";
                      return (
                        <tr key={pat.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-semibold text-xs">
                                {pat.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate">{pat.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{pat.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-muted-foreground font-mono text-xs">
                            {pat.contactNumber || "N/A"}
                          </td>
                          <td className="p-3">
                            <StatusBadge status={pat.status} />
                          </td>
                          <td className="p-3">
                            {pat.user?.emailVerified ? (
                              <span className="inline-flex items-center text-xs text-emerald-600 font-medium">
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Verified
                              </span>
                            ) : (
                              <span className="text-xs text-amber-600 font-medium">Unverified</span>
                            )}
                          </td>
                          <td className="p-3 text-muted-foreground">{formatDateSafe(pat.createdAt)}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 px-2 text-xs"
                                onClick={() => {
                                  setSelectedPatient(pat);
                                  setIsDetailsOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>

                              {isBlocked ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                                  onClick={() => {
                                    setBlockPatient(pat);
                                    setBlockMode("unblock");
                                  }}
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Unblock
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                  onClick={() => {
                                    setBlockPatient(pat);
                                    setBlockMode("block");
                                  }}
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
                {patients.map((pat) => {
                  const isBlocked = pat.status === "BLOCKED";
                  return (
                    <div key={pat.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-semibold text-xs">
                            {pat.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">{pat.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{pat.email}</p>
                          </div>
                        </div>
                        <StatusBadge status={pat.status} />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-muted/30 p-2.5 rounded-lg">
                        <div>
                          <span className="text-muted-foreground">Phone:</span>
                          <p className="font-medium truncate">{pat.contactNumber || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Registered:</span>
                          <p className="font-medium">{formatDateSafe(pat.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-8 text-xs"
                          onClick={() => {
                            setSelectedPatient(pat);
                            setIsDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> Details
                        </Button>

                        {isBlocked ? (
                          <Button
                            size="sm"
                            className="flex-1 h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => {
                              setBlockPatient(pat);
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
                              setBlockPatient(pat);
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

              {/* Pagination Controls */}
              {meta.totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Showing {((meta.page - 1) * meta.limit) + 1} to{" "}
                    {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} patients
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      disabled={meta.page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs px-2 font-medium">
                      {meta.page} / {meta.totalPages}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      disabled={meta.page >= meta.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Patient Details Modal */}
      <PatientDetailsModal
        patient={selectedPatient}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onToggleBlock={(pat, action) => {
          setIsDetailsOpen(false);
          setBlockPatient(pat);
          setBlockMode(action);
        }}
      />

      {/* Block Confirmation Dialog */}
      <PatientBlockDialog
        patient={blockPatient}
        mode={blockMode}
        open={Boolean(blockMode)}
        onClose={() => {
          setBlockMode(null);
          setBlockPatient(null);
        }}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}

export default PatientManagementView;
