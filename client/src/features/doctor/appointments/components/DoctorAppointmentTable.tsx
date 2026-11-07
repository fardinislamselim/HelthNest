"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  Clock,
  Video,
  User,
  Play,
  CheckCircle2,
  FilePlus,
  Eye,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { DoctorAppointmentItem } from "../types/appointment.types";

interface DoctorAppointmentTableProps {
  appointments: DoctorAppointmentItem[];
  onStart: (id: string) => void;
  isStarting?: boolean;
  onComplete: (id: string) => void;
  isCompleting?: boolean;
}

const formatDateSafe = (dateStr?: string, pattern = "EEE, MMM d, yyyy") => {
  if (!dateStr) return "N/A";
  try {
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return dateStr;
    return format(parsed, pattern);
  } catch {
    return dateStr;
  }
};

export function DoctorAppointmentTable({
  appointments,
  onStart,
  isStarting = false,
  onComplete,
  isCompleting = false,
}: DoctorAppointmentTableProps) {
  return (
    <div className="space-y-3">
      {appointments.map((apt) => {
        const formattedDate = formatDateSafe(apt.schedule?.date);
        const isBooked = apt.status === "BOOKED";
        const isOngoing = apt.status === "ONGOING";
        const isCompleted = apt.status === "COMPLETED";

        return (
          <Card
            key={apt.id}
            className="shadow-xs hover:border-primary/40 transition-colors"
          >
            <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Patient info */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="h-11 w-11 rounded-full border border-border bg-muted/60 overflow-hidden flex items-center justify-center shrink-0">
                  {apt.patient?.user?.profileImageUrl ? (
                    <Image
                      src={apt.patient.user.profileImageUrl}
                      alt={apt.patient.name || "Patient"}
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <User className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-semibold text-foreground truncate">
                      {apt.patient?.name || "Patient"}
                    </h4>
                    <StatusBadge status={apt.status} className="text-[11px]" />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {apt.slot?.startTime} - {apt.slot?.endTime} (Slot #{apt.slot?.serialNumber})
                    </span>
                  </div>
                </div>
              </div>

              {/* Consultation Lifecycle Action buttons */}
              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-border/50">
                {isBooked && (
                  <Button
                    variant="default"
                    size="sm"
                    disabled={isStarting}
                    onClick={() => onStart(apt.id)}
                    className="h-8 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Start Session</span>
                  </Button>
                )}

                {isOngoing && (
                  <>
                    {apt.schedule?.meetLink && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-8 text-xs gap-1.5 border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10"
                      >
                        <a
                          href={apt.schedule.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Video className="h-3.5 w-3.5" />
                          <span>Join Video</span>
                        </a>
                      </Button>
                    )}

                    <Button
                      variant="default"
                      size="sm"
                      disabled={isCompleting}
                      onClick={() => onComplete(apt.id)}
                      className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Complete Session</span>
                    </Button>
                  </>
                )}

                {isCompleted && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-8 text-xs gap-1.5 border-indigo-500/40 text-indigo-600 hover:bg-indigo-500/10"
                  >
                    <Link href={`/doctor/prescriptions/create?appointmentId=${apt.id}`}>
                      <FilePlus className="h-3.5 w-3.5" />
                      <span>Write Rx</span>
                    </Link>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 text-xs gap-1"
                >
                  <Link href={`/doctor/appointments/${apt.id}`}>
                    <Eye className="h-3.5 w-3.5" />
                    <span>Details</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default DoctorAppointmentTable;
