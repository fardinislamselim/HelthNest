"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Calendar,
  Search,
  RefreshCw,
  Eye,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAdminDashboard, useSuperAdminDashboard } from "../../hooks/useAdmin";
import { isSuperAdmin } from "../../utils/permissions";
import { AdminAppointmentDetailsModal } from "./AdminAppointmentDetailsModal";
import type { RecentAppointment } from "../../types/admin.types";

export function AdminAppointmentsView() {
  const { user } = useAuth();
  const superAdminRole = isSuperAdmin(user);

  const adminQuery = useAdminDashboard();
  const superAdminQuery = useSuperAdminDashboard();
  const activeQuery = superAdminRole ? superAdminQuery : adminQuery;

  const { data, isLoading, isFetching, refetch } = activeQuery;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | "BOOKED" | "ONGOING" | "COMPLETED" | "CANCELLED">("ALL");
  const [selectedAppointment, setSelectedAppointment] = React.useState<RecentAppointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  const appointmentStats = data?.appointments || {
    total: 0,
    today: 0,
    booked: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0,
  };

  const filteredAppointments = React.useMemo(() => {
    let list: RecentAppointment[] = data?.recent?.appointments || [];

    if (statusFilter !== "ALL") {
      list = list.filter((apt) => apt.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (apt) =>
          (apt.patient?.name && apt.patient.name.toLowerCase().includes(q)) ||
          (apt.doctor?.name && apt.doctor.name.toLowerCase().includes(q)) ||
          apt.id.toLowerCase().includes(q),
      );
    }

    return list;
  }, [data?.recent?.appointments, statusFilter, searchQuery]);

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
            Administrative Appointments Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Platform-wide consultation booking records, schedule fulfillment, and clinical lifecycle statuses.
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
          Refresh Appointments
        </Button>
      </div>

      {/* Appointment Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="shadow-xs p-3 text-center">
          <p className="text-xs text-muted-foreground">Total Bookings</p>
          <p className="text-xl font-bold text-foreground mt-0.5">{appointmentStats.total}</p>
        </Card>
        <Card className="shadow-xs p-3 text-center">
          <p className="text-xs text-muted-foreground">Today&apos;s Sessions</p>
          <p className="text-xl font-bold text-primary mt-0.5">{appointmentStats.today}</p>
        </Card>
        <Card className="shadow-xs p-3 text-center">
          <p className="text-xs text-muted-foreground">Upcoming (Booked)</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">{appointmentStats.booked}</p>
        </Card>
        <Card className="shadow-xs p-3 text-center">
          <p className="text-xs text-muted-foreground">Active (Ongoing)</p>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{appointmentStats.ongoing}</p>
        </Card>
        <Card className="shadow-xs p-3 text-center">
          <p className="text-xs text-muted-foreground">Completed</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{appointmentStats.completed}</p>
        </Card>
        <Card className="shadow-xs p-3 text-center">
          <p className="text-xs text-muted-foreground">Cancelled</p>
          <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">{appointmentStats.cancelled}</p>
        </Card>
      </div>

      {/* Filter and Search */}
      <Card className="shadow-xs">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, doctor name, or appointment ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs sm:text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/60 rounded-lg text-xs self-start md:self-auto">
              {(["ALL", "BOOKED", "ONGOING", "COMPLETED", "CANCELLED"] as const).map((st) => (
                <Button
                  key={st}
                  size="sm"
                  variant={statusFilter === st ? "default" : "ghost"}
                  className="h-7 text-xs px-2.5 rounded-md"
                  onClick={() => setStatusFilter(st)}
                >
                  {st === "ALL" ? "All Statuses" : st}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Platform Consultations ({filteredAppointments.length})
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              Real-time platform activity records
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
          ) : filteredAppointments.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={Calendar}
                title="No appointments found"
                description={
                  searchQuery
                    ? `No consultation records matched "${searchQuery}".`
                    : "No appointments currently match the selected filter."
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
                      <th className="p-3 font-semibold">Reference ID</th>
                      <th className="p-3 font-semibold">Patient</th>
                      <th className="p-3 font-semibold">Attending Doctor</th>
                      <th className="p-3 font-semibold">Scheduled Date & Time</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold">Booked On</th>
                      <th className="p-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono text-xs text-muted-foreground">
                          {apt.id.slice(0, 8)}...
                        </td>
                        <td className="p-3 font-medium text-foreground">
                          {apt.patient?.name || "Patient Account"}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          Dr. {apt.doctor?.name || "Practitioner"}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {apt.schedule?.date ? `${apt.schedule.date} · ${apt.schedule.startTime}` : "Pending assignment"}
                        </td>
                        <td className="p-3">
                          <StatusBadge status={apt.status} />
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {formatDateSafe(apt.createdAt)}
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-xs"
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (< 640px) */}
              <div className="sm:hidden divide-y divide-border">
                {filteredAppointments.map((apt) => (
                  <div key={apt.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm">
                          {apt.patient?.name || "Patient Account"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Doctor: Dr. {apt.doctor?.name || "Practitioner"}
                        </p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>

                    <div className="text-xs bg-muted/30 p-2.5 rounded-lg space-y-1">
                      <p className="text-muted-foreground">
                        Schedule: <span className="font-medium text-foreground">{apt.schedule ? `${apt.schedule.date} at ${apt.schedule.startTime}` : "N/A"}</span>
                      </p>
                      <p className="text-muted-foreground">
                        Booked: <span className="text-foreground">{formatDateSafe(apt.createdAt)}</span>
                      </p>
                      <p className="text-muted-foreground font-mono text-[10px]">
                        ID: {apt.id}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-8 text-xs"
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> Inspect Consultation
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <AdminAppointmentDetailsModal
        appointment={selectedAppointment}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
}

export default AdminAppointmentsView;
