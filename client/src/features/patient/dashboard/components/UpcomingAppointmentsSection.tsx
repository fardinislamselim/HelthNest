"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Clock, User, ArrowRight, Video } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { DashboardUpcomingAppointment } from "../types/dashboard.types";

interface UpcomingAppointmentsSectionProps {
  upcomingAppointments: DashboardUpcomingAppointment[];
  isLoading?: boolean;
}

export function UpcomingAppointmentsSection({
  upcomingAppointments,
  isLoading = false,
}: UpcomingAppointmentsSectionProps) {
  return (
    <Card className="shadow-xs h-full flex flex-col min-w-0">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3">
        <div className="min-w-0">
          <CardTitle className="text-base font-semibold truncate">
            Upcoming Consultations
          </CardTitle>
          <CardDescription className="text-xs">
            Your upcoming confirmed sessions
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-xs self-start sm:self-auto shrink-0">
          <Link href="/dashboard/appointments">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-muted/60 animate-pulse" />
            ))}
          </div>
        ) : upcomingAppointments.length === 0 ? (
          <EmptyState
            title="No upcoming consultations"
            description="You don't have any consultation booked for today or future dates."
            icon={Calendar}
            actionLabel="Discover Today's Schedules"
            onAction={() => {}}
            className="py-8"
          />
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 sm:p-3.5 rounded-lg border border-border/70 bg-card hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                    <Video className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5 truncate">
                      <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      Dr. {item.doctor.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                        {item.schedule.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                        {item.schedule.startTime} - {item.schedule.endTime}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/40">
                  <StatusBadge status={item.status} />
                  <Button asChild variant="link" size="xs" className="p-0 h-auto text-xs text-primary">
                    <Link href={`/dashboard/appointments/${item.id}`}>
                      Details &rarr;
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UpcomingAppointmentsSection;
