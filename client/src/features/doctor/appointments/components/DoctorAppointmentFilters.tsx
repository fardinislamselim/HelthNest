"use client";

import * as React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DoctorAppointmentStatus } from "../types/appointment.types";

interface DoctorAppointmentFiltersProps {
  status?: DoctorAppointmentStatus;
  date?: string;
  onStatusChange: (status?: DoctorAppointmentStatus) => void;
  onDateChange: (date?: string) => void;
  onReset: () => void;
}

export function DoctorAppointmentFilters({
  status,
  date,
  onStatusChange,
  onDateChange,
  onReset,
}: DoctorAppointmentFiltersProps) {
  const statuses: { label: string; value?: DoctorAppointmentStatus }[] = [
    { label: "All Consultations", value: undefined },
    { label: "Booked", value: "BOOKED" },
    { label: "Ongoing", value: "ONGOING" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  const hasActiveFilters = Boolean(status || date);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/70 bg-card shadow-xs">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
        <Filter className="h-4 w-4 text-muted-foreground mr-1 shrink-0 hidden sm:block" />
        {statuses.map((item) => {
          const isActive = status === item.value;
          return (
            <Button
              key={item.label}
              type="button"
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onStatusChange(item.value)}
              className="h-8 text-xs font-medium px-2.5 shrink-0"
            >
              {item.label}
            </Button>
          );
        })}
      </div>

      {/* Date Filter Input */}
      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={date || ""}
          onChange={(e) => onDateChange(e.target.value || undefined)}
          placeholder="Filter by date"
          className="h-8 text-xs w-36 sm:w-40"
        />

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
            title="Reset filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default DoctorAppointmentFilters;
