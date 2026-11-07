"use client";

import * as React from "react";
import { Filter, Calendar as CalendarIcon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppointmentStatus } from "../types/appointment.types";

interface AppointmentFiltersProps {
  status: AppointmentStatus | "";
  onStatusChange: (status: AppointmentStatus | "") => void;
  date: string;
  onDateChange: (date: string) => void;
  onReset: () => void;
}

const STATUS_OPTIONS: { label: string; value: AppointmentStatus | "" }[] = [
  { label: "All Statuses", value: "" },
  { label: "Booked (Upcoming)", value: "BOOKED" },
  { label: "Ongoing", value: "ONGOING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Pending Payment", value: "PENDING" },
];

export function AppointmentFilters({
  status,
  onStatusChange,
  date,
  onDateChange,
  onReset,
}: AppointmentFiltersProps) {
  const hasActiveFilters = Boolean(status || date);

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border/80 bg-card shadow-xs min-w-0">
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 flex-1">
        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as AppointmentStatus | "")}
            className="w-full sm:w-auto h-9 rounded-md border border-input bg-background px-3 text-xs sm:text-sm font-medium shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
            aria-label="Filter appointments by status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full sm:w-auto h-9 rounded-md border border-input bg-background px-3 text-xs sm:text-sm font-medium shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
            aria-label="Filter appointments by date"
          >
          </input>
        </div>
      </div>

      {/* Reset Filter Button */}
      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-foreground gap-1.5 self-end sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Filters
        </Button>
      )}
    </div>
  );
}

export default AppointmentFilters;
