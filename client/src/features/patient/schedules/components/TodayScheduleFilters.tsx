"use client";

import * as React from "react";
import { Search, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TodayScheduleFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSpecialization: string;
  onSpecializationChange: (spec: string) => void;
  specializations: string[];
}

export function TodayScheduleFilters({
  searchQuery,
  onSearchChange,
  selectedSpecialization,
  onSpecializationChange,
  specializations,
}: TodayScheduleFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-4 rounded-xl border border-border/80 bg-card shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search doctor name or credentials..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Specialization Filter */}
      <div className="relative sm:w-64">
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
    </div>
  );
}

export default TodayScheduleFilters;
