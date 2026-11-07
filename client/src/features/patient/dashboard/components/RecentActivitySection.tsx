"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, User, ArrowRight, Stethoscope } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { DashboardRecentAppointment } from "../types/dashboard.types";

interface RecentActivitySectionProps {
  recentAppointments: DashboardRecentAppointment[];
  isLoading?: boolean;
}

export function RecentActivitySection({
  recentAppointments,
  isLoading = false,
}: RecentActivitySectionProps) {
  return (
    <Card className="shadow-xs h-full flex flex-col min-w-0">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3">
        <div className="min-w-0">
          <CardTitle className="text-base font-semibold truncate">
            Recent Consultations
          </CardTitle>
          <CardDescription className="text-xs">
            Your latest booking activity and visit history
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-xs self-start sm:self-auto shrink-0">
          <Link href="/dashboard/appointments">
            All Appointments <ArrowRight className="h-3.5 w-3.5" />
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
        ) : recentAppointments.length === 0 ? (
          <EmptyState
            title="No recent appointments"
            description="Your past and current consultation records will be listed here."
            icon={Clock}
            className="py-8"
          />
        ) : (
          <div className="space-y-3">
            {recentAppointments.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 sm:p-3.5 rounded-lg border border-border/70 bg-card hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground mt-0.5">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5 truncate">
                      <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      Dr. {item.doctor.name}
                    </h4>
                    <p className="text-xs text-muted-foreground font-medium truncate">
                      {item.doctor.specialization}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {item.schedule.date} at {item.schedule.startTime}
                    </p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/40">
                  <StatusBadge status={item.status} />
                  <Button asChild variant="link" size="xs" className="p-0 h-auto text-xs text-primary">
                    <Link href={`/dashboard/appointments/${item.id}`}>
                      View &rarr;
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

export default RecentActivitySection;
