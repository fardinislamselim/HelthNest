"use client";

import * as React from "react";
import { CheckCircle2, Clock, XCircle, PieChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface AppointmentStatusDistributionProps {
  total: number;
  completed: number;
  booked: number;
  cancelled: number;
}

export function AppointmentStatusDistribution({
  total,
  completed,
  booked,
  cancelled,
}: AppointmentStatusDistributionProps) {
  const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const bookedPct = total > 0 ? Math.round((booked / total) * 100) : 0;
  const cancelledPct = total > 0 ? Math.round((cancelled / total) * 100) : 0;

  const segments = [
    {
      label: "Completed Visits",
      count: completed,
      pct: completedPct,
      color: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
      icon: CheckCircle2,
    },
    {
      label: "Upcoming / Booked",
      count: booked,
      pct: bookedPct,
      color: "bg-blue-500",
      textColor: "text-blue-600 dark:text-blue-400",
      icon: Clock,
    },
    {
      label: "Cancelled Appointments",
      count: cancelled,
      pct: cancelledPct,
      color: "bg-rose-500",
      textColor: "text-rose-600 dark:text-rose-400",
      icon: XCircle,
    },
  ];

  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <PieChart className="h-4 w-4 text-primary" />
          Appointment Lifecycle Distribution
        </CardTitle>
        <CardDescription className="text-xs">
          Ratio of attended, upcoming, and cancelled consultations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Progress Bar Spectrum */}
        <div className="h-4 w-full rounded-full bg-muted/60 overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${completedPct}%` }}
            className="bg-emerald-500 transition-all duration-500"
            title={`Completed: ${completedPct}%`}
          />
          <div
            style={{ width: `${bookedPct}%` }}
            className="bg-blue-500 transition-all duration-500"
            title={`Upcoming: ${bookedPct}%`}
          />
          <div
            style={{ width: `${cancelledPct}%` }}
            className="bg-rose-500 transition-all duration-500"
            title={`Cancelled: ${cancelledPct}%`}
          />
        </div>

        {/* Breakdown Items */}
        <div className="space-y-3">
          {segments.map((seg) => {
            const Icon = seg.icon;
            return (
              <div
                key={seg.label}
                className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-border/60 bg-muted/20 min-w-0"
              >
                <div className="flex items-center gap-2 sm:gap-2.5 text-xs min-w-0">
                  <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${seg.color}`} />
                  <Icon className={`h-4 w-4 shrink-0 ${seg.textColor}`} />
                  <span className="font-medium text-foreground truncate">{seg.label}</span>
                </div>
                <div className="text-right text-xs shrink-0">
                  <span className="font-bold text-foreground mr-1.5 sm:mr-2">{seg.count}</span>
                  <span className="text-muted-foreground font-semibold">({seg.pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default AppointmentStatusDistribution;
