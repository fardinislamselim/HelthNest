import * as React from "react";
import Link from "next/link";
import { Clock, Plus, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { DoctorDashboardSchedulesSummary } from "../types/dashboard.types";

export interface DoctorTodayScheduleCardProps {
  schedules?: DoctorDashboardSchedulesSummary;
  isLoading?: boolean;
}

export function DoctorTodayScheduleCard({
  schedules,
  isLoading = false,
}: DoctorTodayScheduleCardProps) {
  if (isLoading) {
    return (
      <Card className="shadow-xs">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  const hasTodaySchedule = (schedules?.today ?? 0) > 0;
  const totalSlots = schedules?.totalSlots ?? 0;
  const availableSlots = schedules?.availableSlots ?? 0;
  const bookedSlots = schedules?.bookedSlots ?? 0;

  return (
    <Card className="shadow-xs flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-semibold">Today&apos;s Consultation Schedule</CardTitle>
        </div>
        {hasTodaySchedule ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="h-3 w-3" />
            Active Today
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
            <AlertCircle className="h-3 w-3" />
            No Schedule Today
          </span>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {hasTodaySchedule ? (
          <div className="space-y-3">
            <p className="text-xs sm:text-sm text-muted-foreground">
              You have active consultation capacity allocated for today in 20-minute patient slots.
            </p>
            <div className="grid grid-cols-3 gap-2 bg-muted/40 p-3 rounded-lg border border-border/50 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Total Slots</p>
                <p className="text-lg font-bold text-foreground">{totalSlots}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Booked</p>
                <p className="text-lg font-bold text-primary">{bookedSlots}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Available</p>
                <p className="text-lg font-bold text-emerald-600">{availableSlots}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-muted/30 border border-dashed border-border p-4 rounded-lg text-center space-y-2">
            <p className="text-sm font-medium text-foreground">No schedule published for today</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Create and publish a 3 to 8 hour schedule to enable patients to discover and book your slots.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t border-border/40">
        {hasTodaySchedule ? (
          <Button variant="outline" size="sm" asChild className="w-full">
            <Link href="/doctor/schedules" className="flex items-center justify-center gap-1.5">
              <span>View Today&apos;s Slots &amp; Meet Link</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        ) : (
          <Button size="sm" asChild className="w-full">
            <Link href="/doctor/schedules/create" className="flex items-center justify-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Create Schedule for Today</span>
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default DoctorTodayScheduleCard;
