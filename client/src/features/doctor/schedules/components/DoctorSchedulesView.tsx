"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Clock,
  Video,
  Globe,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Send,
  EyeOff,
} from "lucide-react";
import { format } from "date-fns";
import { useDoctorSchedules } from "../hooks/useDoctorSchedules";
import { useScheduleMutations } from "../hooks/useScheduleMutations";
import { ScheduleFilters } from "./ScheduleFilters";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DoctorScheduleItem } from "../types/schedule.types";

const formatDateSafe = (dateStr?: string, pattern = "EEEE, MMMM d, yyyy") => {
  if (!dateStr) return "N/A";
  try {
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return dateStr;
    return format(parsed, pattern);
  } catch {
    return dateStr;
  }
};

export function DoctorSchedulesView() {
  const router = useRouter();
  const {
    schedules,
    meta,
    isLoading,
    isError,
    error,
    refetch,
    filters,
    setPage,
    setStatus,
    setDateRange,
    setFilters,
  } = useDoctorSchedules();

  const {
    publishSchedule,
    isPublishing,
    unpublishSchedule,
    isUnpublishing,
    deleteSchedule,
    isDeleting,
  } = useScheduleMutations();

  const [deleteTarget, setDeleteTarget] = React.useState<DoctorScheduleItem | null>(null);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSchedule(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      // Handled by mutation error toast
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consultation Schedules"
        description="Organize 20-minute patient booking windows, manage drafts, and publish active slots"
      >
        <Button size="sm" asChild className="shrink-0 gap-1.5">
          <Link href="/doctor/schedules/create">
            <Plus className="h-4 w-4" />
            <span>Create New Schedule</span>
          </Link>
        </Button>
      </PageHeader>

      <ScheduleFilters
        status={filters.status}
        startDate={filters.startDate}
        endDate={filters.endDate}
        onStatusChange={(status) => setStatus(status)}
        onDateRangeChange={(start, end) => setDateRange(start, end)}
        onReset={() => setFilters({ page: 1, limit: 10 })}
      />

      {isError && (
        <ErrorState
          title="Failed to load schedules"
          message={error?.message || "Could not retrieve doctor schedules from the server."}
          onRetry={() => refetch()}
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="shadow-xs">
              <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-9 w-28 rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : schedules.length === 0 ? (
        <EmptyState
          title="No schedules found"
          description={
            filters.status || filters.startDate || filters.endDate
              ? "No consultation schedules match your filter criteria. Try adjusting your filters."
              : "You haven't created any consultation schedules yet. Click below to draft your first schedule."
          }
          actionLabel="Create Schedule"
          onAction={() => router.push("/doctor/schedules/create")}
        />
      ) : (
        <div className="space-y-3">
          {schedules.map((schedule) => {
            const formattedDate = formatDateSafe(schedule.date);
            const isDraft = schedule.status === "DRAFT";
            const isPublished = schedule.status === "PUBLISHED";
            const isUnpublished = schedule.status === "UNPUBLISHED";

            return (
              <Card
                key={schedule.id}
                className="shadow-xs hover:border-primary/40 transition-colors"
              >
                <CardHeader className="p-4 sm:p-5 pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-semibold text-foreground">
                          {formattedDate}
                        </CardTitle>
                        <StatusBadge status={schedule.status} className="text-[11px]" />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5 text-primary" />
                          {schedule.totalSlots} Slots (20 min each)
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 self-start sm:self-auto pt-2 sm:pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-8 text-xs gap-1"
                      >
                        <Link href={`/doctor/schedules/${schedule.id}`}>
                          <Eye className="h-3.5 w-3.5" />
                          <span>View Slots</span>
                        </Link>
                      </Button>

                      {(isDraft || isUnpublished) && (
                        <Button
                          variant="default"
                          size="sm"
                          disabled={isPublishing}
                          onClick={() => publishSchedule(schedule.id)}
                          className="h-8 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Publish</span>
                        </Button>
                      )}

                      {isPublished && (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={isUnpublishing}
                          onClick={() => unpublishSchedule(schedule.id)}
                          className="h-8 text-xs gap-1"
                        >
                          <EyeOff className="h-3.5 w-3.5" />
                          <span>Unpublish</span>
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isDeleting}
                        onClick={() => setDeleteTarget(schedule)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        title="Delete schedule"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 pt-0">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50 truncate">
                    <Video className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate font-mono">
                      {schedule.meetLink}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Pagination Controls */}
          {meta && (meta.totalPages ?? meta.totalPage ?? 1) > 1 && (
            <div className="flex items-center justify-between pt-4 text-xs text-muted-foreground">
              <span>
                Page {meta.page} of {meta.totalPages ?? meta.totalPage ?? 1} ({meta.total} schedules total)
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => setPage(meta.page - 1)}
                  className="h-8 px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page >= (meta.totalPages ?? meta.totalPage ?? 1)}
                  onClick={() => setPage(meta.page + 1)}
                  className="h-8 px-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Consultation Schedule"
        description={`Are you sure you want to delete the schedule for ${
          deleteTarget ? format(new Date(deleteTarget.date), "MMMM d, yyyy") : ""
        }? Scheduless with active bookings cannot be deleted.`}
        confirmLabel="Delete Schedule"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default DoctorSchedulesView;
