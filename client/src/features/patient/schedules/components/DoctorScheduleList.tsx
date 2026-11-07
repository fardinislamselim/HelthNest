"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { DoctorScheduleCard } from "./DoctorScheduleCard";
import type { PatientScheduleItem } from "../types/schedule.types";

interface DoctorScheduleListProps {
  schedules: PatientScheduleItem[];
  isLoading?: boolean;
  onSelectSchedule: (schedule: PatientScheduleItem) => void;
}

export function DoctorScheduleList({
  schedules,
  isLoading = false,
  onSelectSchedule,
}: DoctorScheduleListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-64 rounded-xl border border-border/80 bg-card p-5 animate-pulse space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-muted shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-20 bg-muted/60 rounded" />
              </div>
            </div>
            <div className="h-12 rounded bg-muted/40" />
            <div className="h-4 w-full bg-muted/50 rounded" />
            <div className="h-9 w-full bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <EmptyState
        title="No Available Schedules Today"
        description="There are currently no doctors with published open schedules remaining for today. Schedules open daily before their consultation start time."
        icon={Clock}
        className="my-8 py-12"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {schedules.map((schedule) => (
        <DoctorScheduleCard
          key={schedule.id}
          schedule={schedule}
          onSelectSchedule={onSelectSchedule}
        />
      ))}
    </div>
  );
}

export default DoctorScheduleList;
