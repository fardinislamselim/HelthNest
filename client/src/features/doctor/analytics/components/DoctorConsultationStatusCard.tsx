import * as React from "react";
import { CheckCircle2, Clock, XCircle, Play, PieChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { DoctorDashboardAppointmentsSummary } from "@/features/doctor/dashboard/types/dashboard.types";

interface DoctorConsultationStatusCardProps {
  appointments?: DoctorDashboardAppointmentsSummary;
}

export function DoctorConsultationStatusCard({
  appointments,
}: DoctorConsultationStatusCardProps) {
  const total = appointments?.total ?? 0;
  const completed = appointments?.completed ?? 0;
  const booked = appointments?.booked ?? 0;
  const ongoing = appointments?.ongoing ?? 0;
  const cancelled = appointments?.cancelled ?? 0;

  const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const bookedPct = total > 0 ? Math.round((booked / total) * 100) : 0;
  const ongoingPct = total > 0 ? Math.round((ongoing / total) * 100) : 0;
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
      label: "Booked / Upcoming",
      count: booked,
      pct: bookedPct,
      color: "bg-blue-500",
      textColor: "text-blue-600 dark:text-blue-400",
      icon: Clock,
    },
    {
      label: "Ongoing Sessions",
      count: ongoing,
      pct: ongoingPct,
      color: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
      icon: Play,
    },
    {
      label: "Cancelled",
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
          Consultation Lifecycle Breakdown
        </CardTitle>
        <CardDescription className="text-xs">
          Distribution of completed, active, and cancelled patient sessions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted/60">
            {total === 0 ? (
              <div className="h-full w-full bg-muted" />
            ) : (
              <>
                {completedPct > 0 && (
                  <div
                    style={{ width: `${completedPct}%` }}
                    className="bg-emerald-500 transition-all duration-500"
                    title={`Completed: ${completed} (${completedPct}%)`}
                  />
                )}
                {bookedPct > 0 && (
                  <div
                    style={{ width: `${bookedPct}%` }}
                    className="bg-blue-500 transition-all duration-500"
                    title={`Booked: ${booked} (${bookedPct}%)`}
                  />
                )}
                {ongoingPct > 0 && (
                  <div
                    style={{ width: `${ongoingPct}%` }}
                    className="bg-amber-500 transition-all duration-500"
                    title={`Ongoing: ${ongoing} (${ongoingPct}%)`}
                  />
                )}
                {cancelledPct > 0 && (
                  <div
                    style={{ width: `${cancelledPct}%` }}
                    className="bg-rose-500 transition-all duration-500"
                    title={`Cancelled: ${cancelled} (${cancelledPct}%)`}
                  />
                )}
              </>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground text-right">
            Total consultations logged: <strong className="text-foreground">{total}</strong>
          </p>
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {segments.map((seg) => {
            const Icon = seg.icon;
            return (
              <div
                key={seg.label}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-muted/20"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${seg.color}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate flex items-center gap-1">
                      <Icon className="h-3 w-3 shrink-0" />
                      {seg.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{seg.pct}% of total</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ml-2 ${seg.textColor}`}>
                  {seg.count}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default DoctorConsultationStatusCard;
