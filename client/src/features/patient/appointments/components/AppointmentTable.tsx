"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Video,
  User,
  XCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { PatientAppointmentItem } from "../types/appointment.types";

interface AppointmentTableProps {
  appointments: PatientAppointmentItem[];
  isLoading?: boolean;
  onRequestCancel: (appointment: PatientAppointmentItem) => void;
}

export function AppointmentTable({
  appointments,
  isLoading = false,
  onRequestCancel,
}: AppointmentTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="h-20 rounded-xl border border-border/80 bg-card p-4 animate-pulse space-y-2"
          >
            <div className="h-4 w-48 bg-muted rounded" />
            <div className="h-3 w-72 bg-muted/60 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <EmptyState
        title="No appointments found"
        description="No consultation records matched your active filter criteria."
        icon={Calendar}
        className="my-8 py-12"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop & Tablet Table View (hidden on mobile < 768px) */}
      <div className="hidden md:block rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Serial #</th>
                <th className="py-3 px-4 whitespace-nowrap">Doctor</th>
                <th className="py-3 px-4 whitespace-nowrap">Date & Time</th>
                <th className="py-3 px-4 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 whitespace-nowrap">Payment</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {appointments.map((appt) => {
                const isCancellable =
                  appt.status === "BOOKED" || appt.status === "PENDING";
                const canJoinMeet =
                  (appt.status === "BOOKED" || appt.status === "ONGOING") &&
                  Boolean(appt.schedule.meetLink);

                return (
                  <tr
                    key={appt.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-foreground whitespace-nowrap">
                      {appt.serialNumber ? `#${appt.serialNumber}` : "Pending"}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-primary/20 bg-muted flex items-center justify-center">
                          {appt.doctor.user?.profileImageUrl ? (
                            <Image
                              src={appt.doctor.user.profileImageUrl}
                              alt={appt.doctor.name}
                              width={36}
                              height={36}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <User className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            Dr. {appt.doctor.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {appt.doctor.specialization}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        {appt.schedule.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
                        <Clock className="h-3.5 w-3.5" />
                        {appt.slot.startTime} – {appt.slot.endTime}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                      {appt.payment ? (
                        <div>
                          <span className="font-semibold text-foreground">
                            ${Number(appt.payment.amount).toFixed(2)}
                          </span>
                          <div className="mt-0.5">
                            <StatusBadge status={appt.payment.status} className="text-[10px] py-0 px-1.5" />
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {canJoinMeet && (
                          <Button
                            asChild
                            variant="outline"
                            size="xs"
                            className="gap-1 text-xs text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          >
                            <a
                              href={appt.schedule.meetLink!}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Video className="h-3.5 w-3.5" />
                              Join
                            </a>
                          </Button>
                        )}
                        <Button asChild variant="ghost" size="xs" className="gap-1">
                          <Link href={`/dashboard/appointments/${appt.id}`}>
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>
                        </Button>
                        {isCancellable && (
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => onRequestCancel(appt)}
                            className="text-destructive hover:bg-destructive/10 text-xs gap-1"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Cancel
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
      </div>

      {/* Mobile Cards View (shown on mobile < 768px) */}
      <div className="md:hidden space-y-3">
        {appointments.map((appt) => {
          const isCancellable =
            appt.status === "BOOKED" || appt.status === "PENDING";
          const canJoinMeet =
            (appt.status === "BOOKED" || appt.status === "ONGOING") &&
            Boolean(appt.schedule.meetLink);

          return (
            <div
              key={appt.id}
              className="p-4 rounded-xl border border-border/80 bg-card space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-primary uppercase">
                    {appt.serialNumber ? `Serial #${appt.serialNumber}` : "Pending"}
                  </span>
                  <h4 className="text-sm font-bold text-foreground truncate mt-0.5">
                    Dr. {appt.doctor.name}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {appt.doctor.specialization}
                  </p>
                </div>
                <StatusBadge status={appt.status} className="shrink-0" />
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs py-2 border-y border-border/60">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{appt.schedule.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>
                    {appt.slot.startTime} - {appt.slot.endTime}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="text-xs">
                  {appt.payment && (
                    <span className="font-semibold text-foreground">
                      Fee: ${Number(appt.payment.amount).toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {canJoinMeet && (
                    <Button asChild size="xs" variant="outline" className="text-xs text-emerald-600">
                      <a href={appt.schedule.meetLink!} target="_blank" rel="noopener noreferrer">
                        <Video className="h-3 w-3 mr-1" />
                        Join Meet
                      </a>
                    </Button>
                  )}
                  <Button asChild size="xs" variant="outline">
                    <Link href={`/dashboard/appointments/${appt.id}`}>Details</Link>
                  </Button>
                  {isCancellable && (
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => onRequestCancel(appt)}
                      className="text-destructive text-xs"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AppointmentTable;
