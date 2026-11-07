"use client";

import * as React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ScheduleStatusType } from "../types/schedule.types";

interface ScheduleFiltersProps {
  status?: ScheduleStatusType;
  startDate?: string;
  endDate?: string;
  onStatusChange: (status?: ScheduleStatusType) => void;
  onDateRangeChange: (start?: string, end?: string) => void;
  onReset: () => void;
}

export function ScheduleFilters({
  status,
  startDate,
  endDate,
  onStatusChange,
  onDateRangeChange,
  onReset,
}: ScheduleFiltersProps) {
  const statuses: { label: string; value?: ScheduleStatusType }[] = [
    { label: "All Statuses", value: undefined },
    { label: "Draft", value: "DRAFT" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Unpublished", value: "UNPUBLISHED" },
  ];

  const hasActiveFilters = Boolean(status || startDate || endDate);

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

      {/* Date Range Inputs */}
      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={startDate || ""}
          onChange={(e) => onDateRangeChange(e.target.value || undefined, endDate)}
          placeholder="Start Date"
          className="h-8 text-xs w-32 sm:w-36"
        />
        <span className="text-xs text-muted-foreground">to</span>
        <Input
          type="date"
          value={endDate || ""}
          onChange={(e) => onDateRangeChange(startDate, e.target.value || undefined)}
          placeholder="End Date"
          className="h-8 text-xs w-32 sm:w-36"
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

export default ScheduleFilters;
