"use client";

import * as React from "react";
import { Search, Stethoscope, Calendar, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TodayScheduleFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSpecialization: string;
  onSpecializationChange: (spec: string) => void;
  specializations: string[];
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  isUpcoming?: boolean;
  onReset?: () => void;
}

export function TodayScheduleFilters({
  searchQuery,
  onSearchChange,
  selectedSpecialization,
  onSpecializationChange,
  specializations,
  selectedDate = "",
  onDateChange,
  isUpcoming = false,
  onReset,
}: TodayScheduleFiltersProps) {
  const today = new Date().toISOString().split("T")[0];
  const hasActiveFilters = Boolean(
    searchQuery || selectedSpecialization || (isUpcoming && selectedDate),
  );

  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-4 rounded-xl border border-border/80 bg-card shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search doctor name, specialty, or credentials..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 text-xs sm:text-sm"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
        {/* Specialization Filter */}
        <div className="relative sm:w-52">
          <Stethoscope className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select
            value={selectedSpecialization}
            onChange={(e) => onSpecializationChange(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-xs sm:text-sm font-medium shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
            aria-label="Filter by specialization"
          >
            <option value="">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter (Upcoming Mode Only) */}
        {isUpcoming && onDateChange && (
          <div className="relative sm:w-44">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-2 text-xs sm:text-sm font-medium shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
              aria-label="Filter by schedule date"
            />
          </div>
        )}

        {/* Reset Filter Button */}
        {hasActiveFilters && onReset && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5 shrink-0"
            title="Reset filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default TodayScheduleFilters;
