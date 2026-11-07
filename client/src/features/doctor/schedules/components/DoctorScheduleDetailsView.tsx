"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Video,
  ArrowLeft,
  Send,
  EyeOff,
  Trash2,
  ExternalLink,
  User,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useScheduleDetails } from "../hooks/useScheduleDetails";
import { useScheduleMutations } from "../hooks/useScheduleMutations";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DoctorScheduleDetailsViewProps {
  scheduleId: string;
}

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

export function DoctorScheduleDetailsView({ scheduleId }: DoctorScheduleDetailsViewProps) {
  const { schedule, isLoading, isError, error, refetch } = useScheduleDetails(scheduleId);

  const {
    publishSchedule,
    isPublishing,
    unpublishSchedule,
    isUnpublishing,
    deleteSchedule,
    isDeleting,
  } = useScheduleMutations();

  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  if (isError) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild className="gap-1.5 -ml-2 text-xs">
          <Link href="/doctor/schedules">
            <ArrowLeft className="h-4 w-4" />
            Back to Schedules
          </Link>
        </Button>
        <ErrorState
          title="Schedule Not Found"
          message={error?.message || "Could not retrieve schedule details from the server."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (isLoading || !schedule) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-44 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const formattedDate = formatDateSafe(schedule?.date);
  const isDraft = schedule?.status === "DRAFT";
  const isPublished = schedule?.status === "PUBLISHED";
  const isUnpublished = schedule?.status === "UNPUBLISHED";
  const slots = Array.isArray(schedule?.slots) ? schedule.slots : [];
  const bookedSlotsCount = slots.filter((s) => s.isBooked).length;
  const availableSlotsCount = slots.length - bookedSlotsCount;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" asChild className="gap-1.5 -ml-2 text-xs">
          <Link href="/doctor/schedules">
            <ArrowLeft className="h-4 w-4" />
            Back to All Schedules
          </Link>
        </Button>
      </div>

      {/* Main Schedule Info Card */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                  {formattedDate}
                </CardTitle>
                <StatusBadge status={schedule.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  {schedule.startTime} - {schedule.endTime}
                </span>
                <span className="flex items-center gap-1 font-sans">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  {schedule.totalSlots} Slots total
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {(isDraft || isUnpublished) && (
                <Button
                  variant="default"
                  size="sm"
                  disabled={isPublishing}
                  onClick={() => publishSchedule(schedule.id)}
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Publish Schedule</span>
                </Button>
              )}

              {isPublished && (
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isUnpublishing}
                  onClick={() => unpublishSchedule(schedule.id)}
                  className="gap-1.5"
                >
                  <EyeOff className="h-3.5 w-3.5" />
                  <span>Unpublish</span>
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                disabled={isDeleting || bookedSlotsCount > 0}
                onClick={() => setIsDeleteOpen(true)}
                className="gap-1.5 text-destructive hover:bg-destructive/10"
                title={bookedSlotsCount > 0 ? "Cannot delete schedule with active bookings" : "Delete schedule"}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* Slot Breakdown Statistics */}
          <div className="grid grid-cols-3 gap-3 bg-muted/40 p-3 rounded-lg border border-border/50 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Total 20-min Slots</p>
              <p className="text-lg font-bold text-foreground">{slots.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Available Slots</p>
              <p className="text-lg font-bold text-emerald-600">{availableSlotsCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Booked Slots</p>
              <p className="text-lg font-bold text-primary">{bookedSlotsCount}</p>
            </div>
          </div>

          {/* Meeting Link Room */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-card border border-border/80">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground min-w-0">
              <Video className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate">{schedule.meetLink}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8 text-xs gap-1 self-start sm:self-auto shrink-0"
            >
              <a href={schedule.meetLink} target="_blank" rel="noopener noreferrer">
                <span>Test Meet Room</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Slots Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            20-Minute Consultation Slots ({slots.length})
          </h3>
          <span className="text-xs text-muted-foreground">
            Sequenced automatically from {schedule.startTime} to {schedule.endTime}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {slots.map((slot) => {
            const hasAppointment = slot.appointments && slot.appointments.length > 0;
            const appointment = hasAppointment ? slot.appointments![0] : null;

            return (
              <Card
                key={slot.id}
                className={`shadow-xs transition-colors border ${
                  slot.isBooked
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/60 bg-card hover:border-emerald-500/40"
                }`}
              >
                <CardContent className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Slot #{slot.serialNumber}
                    </span>
                    {slot.isBooked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3" />
                        Booked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <AlertCircle className="h-3 w-3" />
                        Available
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-sm font-bold font-mono text-foreground">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>

                  {appointment && (
                    <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                        <User className="h-3 w-3" />
                        Patient Booked
                      </span>
                      <Button variant="ghost" size="sm" asChild className="h-6 px-1.5 text-[10px]">
                        <Link href={`/doctor/appointments/${appointment.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Schedule"
        description="Are you sure you want to delete this schedule? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={async () => {
          await deleteSchedule(schedule.id);
          setIsDeleteOpen(false);
        }}
      />
    </div>
  );
}

export default DoctorScheduleDetailsView;
