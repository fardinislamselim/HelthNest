import * as React from "react";
import Link from "next/link";
import { Calendar, ArrowRight, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { DoctorDashboardRecentAppointment } from "../types/dashboard.types";

export interface DoctorUpcomingAppointmentsCardProps {
  upcomingAppointments?: DoctorDashboardRecentAppointment[];
  isLoading?: boolean;
}

export function DoctorUpcomingAppointmentsCard({
  upcomingAppointments = [],
  isLoading = false,
}: DoctorUpcomingAppointmentsCardProps) {
  if (isLoading) {
    return (
      <Card className="shadow-xs">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xs flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-semibold">Upcoming Consultations</CardTitle>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {upcomingAppointments.length} scheduled
        </span>
      </CardHeader>

      <CardContent className="space-y-3">
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm space-y-1">
            <p className="font-medium text-foreground">No upcoming appointments</p>
            <p className="text-xs">Upcoming patient bookings will appear here in chronological order.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-card hover:bg-muted/40 transition-colors gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                      {apt.patient?.name || "Patient"}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {apt.schedule?.date} • {apt.schedule?.startTime} - {apt.schedule?.endTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={apt.status} className="text-[10px] px-2 py-0.5" />
                  <Button variant="ghost" size="sm" asChild className="h-8 px-2 text-xs">
                    <Link href={`/doctor/appointments/${apt.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t border-border/40">
        <Button variant="outline" size="sm" asChild className="w-full">
          <Link href="/doctor/appointments" className="flex items-center justify-center gap-1.5">
            <span>View All Consultations</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default DoctorUpcomingAppointmentsCard;
