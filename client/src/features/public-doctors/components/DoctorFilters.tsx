"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Filter, RotateCcw, Search, X } from "lucide-react";
import * as React from "react";
import { useDoctorFilterOptions } from "../hooks/useDoctorFilterOptions";
import type { PublicDoctorFilterParams } from "../types/doctor.types";

interface DoctorFiltersProps {
  filters: PublicDoctorFilterParams;
  onFilterChange: (newFilters: Partial<PublicDoctorFilterParams>) => void;
  onReset: () => void;
  totalResults: number;
}

export function DoctorFilters({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}: DoctorFiltersProps) {
  const [searchInput, setSearchInput] = React.useState(filters.search || "");
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  const {
    specializations,
    experienceOptions,
    feeOptions,
    isLoading: isLoadingOptions,
  } = useDoctorFilterOptions();

  const specializationOptions = React.useMemo(() => {
    const base = ["All Specializations", ...specializations];
    if (
      filters.specialization &&
      filters.specialization !== "All Specializations" &&
      !base.includes(filters.specialization)
    ) {
      base.push(filters.specialization);
    }
    return base;
  }, [specializations, filters.specialization]);

  // Debounce search update
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (filters.search || "")) {
        onFilterChange({ search: searchInput, page: 1 });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, filters.search, onFilterChange]);

  const hasActiveFilters = Boolean(
    filters.search ||
    (filters.specialization &&
      filters.specialization !== "All Specializations") ||
    (filters.minExperience && filters.minExperience > 0) ||
    (filters.maxFee && filters.maxFee > 0),
  );

  const selectClassName =
    "w-full h-11 appearance-none rounded-xl border border-input bg-background pl-3.5 pr-10 text-sm text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="w-full space-y-4 bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs">
      {/* Primary search bar + Mobile Filter toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by doctor name, specialty, or condition..."
            className="w-full pl-10 pr-10 text-sm h-11 rounded-xl border-input focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                onFilterChange({ search: "", page: 1 });
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search input"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="sm:hidden flex-1 text-xs gap-1.5 h-11 rounded-xl"
          >
            <Filter className="h-4 w-4" />
            <span>Filters {hasActiveFilters && "•"}</span>
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchInput("");
                onReset();
              }}
              className="text-xs gap-1.5 text-muted-foreground hover:text-foreground h-11 px-3.5 rounded-xl shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Row: Visible on Desktop, toggleable on mobile */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border/50 ${
          showMobileFilters ? "grid" : "hidden sm:grid"
        }`}
      >
        {/* Specialization Filter */}
        <div className="space-y-1.5 min-w-0">
          <label
            htmlFor="filterSpecialization"
            className="block text-xs font-semibold text-muted-foreground"
          >
            Specialization
          </label>
          <div className="relative">
            <select
              id="filterSpecialization"
              value={filters.specialization || "All Specializations"}
              disabled={isLoadingOptions}
              onChange={(e) => {
                const val = e.target.value;
                onFilterChange({
                  specialization:
                    val === "All Specializations" ? undefined : val,
                  page: 1,
                });
              }}
              className={selectClassName}
            >
              {specializationOptions.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Experience Filter */}
        <div className="space-y-1.5 min-w-0">
          <label
            htmlFor="filterExperience"
            className="block text-xs font-semibold text-muted-foreground"
          >
            Minimum Experience
          </label>
          <div className="relative">
            <select
              id="filterExperience"
              value={filters.minExperience || 0}
              disabled={isLoadingOptions}
              onChange={(e) => {
                const val = Number(e.target.value);
                onFilterChange({
                  minExperience: val > 0 ? val : undefined,
                  page: 1,
                });
              }}
              className={selectClassName}
            >
              {experienceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Max Consultation Fee */}
        <div className="space-y-1.5 min-w-0">
          <label
            htmlFor="filterMaxFee"
            className="block text-xs font-semibold text-muted-foreground"
          >
            Consultation Fee
          </label>
          <div className="relative">
            <select
              id="filterMaxFee"
              value={filters.maxFee || 0}
              disabled={isLoadingOptions}
              onChange={(e) => {
                const val = Number(e.target.value);
                onFilterChange({
                  maxFee: val > 0 ? val : undefined,
                  page: 1,
                });
              }}
              className={selectClassName}
            >
              {feeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Results Count & Active Status */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span>
          Showing <strong className="text-foreground">{totalResults}</strong>{" "}
          {totalResults === 1
            ? "verified practitioner"
            : "verified practitioners"}
        </span>
        {hasActiveFilters && (
          <span className="text-[11px] text-primary font-medium">
            Filtered Results
          </span>
        )}
      </div>
    </div>
  );
}

export default DoctorFilters;
