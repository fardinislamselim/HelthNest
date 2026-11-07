import * as React from "react";
import { Activity, Clock, Layers } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { DoctorDashboardSchedulesSummary } from "@/features/doctor/dashboard/types/dashboard.types";

interface DoctorScheduleUtilizationCardProps {
  schedules?: DoctorDashboardSchedulesSummary;
}

export function DoctorScheduleUtilizationCard({
  schedules,
}: DoctorScheduleUtilizationCardProps) {
  const totalSlots = schedules?.totalSlots ?? 0;
  const bookedSlots = schedules?.bookedSlots ?? 0;
  const availableSlots = schedules?.availableSlots ?? 0;

  const bookedPct = totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;
  const availablePct = totalSlots > 0 ? 100 - bookedPct : 0;

  const totalSchedules = schedules?.total ?? 0;
  const publishedSchedules = schedules?.published ?? 0;
  const draftSchedules = schedules?.draft ?? 0;

  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Schedule &amp; 20-Min Slot Utilization
        </CardTitle>
        <CardDescription className="text-xs">
          Ratio of booked patient appointments across all allocated schedule windows
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Slot Utilization Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Booked Capacity</span>
            <span className="text-primary">{bookedPct}%</span>
          </div>

          <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted/60">
            {totalSlots === 0 ? (
              <div className="h-full w-full bg-muted" />
            ) : (
              <>
                <div
                  style={{ width: `${bookedPct}%` }}
                  className="bg-primary transition-all duration-500"
                  title={`Booked: ${bookedSlots}`}
                />
                <div
                  style={{ width: `${availablePct}%` }}
                  className="bg-emerald-500 transition-all duration-500"
                  title={`Available: ${availableSlots}`}
                />
              </>
            )}
          </div>

          <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
            <span>{bookedSlots} Booked Slots</span>
            <span>{availableSlots} Available Slots</span>
          </div>
        </div>

        {/* Schedules Count Breakdown */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-border/50 text-center text-xs">
          <div className="bg-muted/30 p-2.5 rounded-lg border border-border/50">
            <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
              <Layers className="h-3 w-3 text-primary" />
              Total Blocks
            </span>
            <p className="text-base font-bold text-foreground mt-1">{totalSchedules}</p>
          </div>

          <div className="bg-muted/30 p-2.5 rounded-lg border border-border/50">
            <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
              <Activity className="h-3 w-3 text-emerald-600" />
              Published
            </span>
            <p className="text-base font-bold text-emerald-600 mt-1">{publishedSchedules}</p>
          </div>

          <div className="bg-muted/30 p-2.5 rounded-lg border border-border/50">
            <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
              <Clock className="h-3 w-3 text-amber-600" />
              Drafts
            </span>
            <p className="text-base font-bold text-amber-600 mt-1">{draftSchedules}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DoctorScheduleUtilizationCard;
