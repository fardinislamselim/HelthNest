"use client";

import * as React from "react";
import { Search, Filter, X, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { PublicDoctorFilterParams } from "../types/doctor.types";

interface DoctorFiltersProps {
  filters: PublicDoctorFilterParams;
  onFilterChange: (newFilters: Partial<PublicDoctorFilterParams>) => void;
  onReset: () => void;
  totalResults: number;
}

const COMMON_SPECIALIZATIONS = [
  "All Specializations",
  "General Medicine",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Psychiatry",
  "Gynecology",
  "Ophthalmology",
  "Gastroenterology",
  "Oncology",
  "Endocrinology",
];

const EXPERIENCE_OPTIONS = [
  { label: "Any Experience", value: 0 },
  { label: "3+ Years", value: 3 },
  { label: "5+ Years", value: 5 },
  { label: "10+ Years", value: 10 },
  { label: "15+ Years", value: 15 },
];

const FEE_OPTIONS = [
  { label: "Any Fee", value: 0 },
  { label: "Under $50", value: 50 },
  { label: "Under $100", value: 100 },
  { label: "Under $150", value: 150 },
  { label: "Under $250", value: 250 },
];

export function DoctorFilters({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}: DoctorFiltersProps) {
  const [searchInput, setSearchInput] = React.useState(filters.search || "");
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

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
      (filters.specialization && filters.specialization !== "All Specializations") ||
      (filters.minExperience && filters.minExperience > 0) ||
      (filters.maxFee && filters.maxFee > 0),
  );

  return (
    <div className="space-y-4 bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs">
      {/* Primary search bar + Mobile Filter toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by doctor name, specialty, or condition..."
            className="pl-9 pr-9 text-sm h-10"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                onFilterChange({ search: "", page: 1 });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search input"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="sm:hidden flex-1 text-xs gap-1.5 h-10"
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
              className="text-xs gap-1.5 text-muted-foreground hover:text-foreground h-10 px-3"
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
        className={`grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/50 ${
          showMobileFilters ? "block" : "hidden sm:grid"
        }`}
      >
        {/* Specialization Filter */}
        <div className="space-y-1">
          <label htmlFor="filterSpecialization" className="text-xs font-semibold text-muted-foreground">
            Specialization
          </label>
          <select
            id="filterSpecialization"
            value={filters.specialization || "All Specializations"}
            onChange={(e) => {
              const val = e.target.value;
              onFilterChange({
                specialization: val === "All Specializations" ? undefined : val,
                page: 1,
              });
            }}
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          >
            {COMMON_SPECIALIZATIONS.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Filter */}
        <div className="space-y-1">
          <label htmlFor="filterExperience" className="text-xs font-semibold text-muted-foreground">
            Minimum Experience
          </label>
          <select
            id="filterExperience"
            value={filters.minExperience || 0}
            onChange={(e) => {
              const val = Number(e.target.value);
              onFilterChange({
                minExperience: val > 0 ? val : undefined,
                page: 1,
              });
            }}
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          >
            {EXPERIENCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Max Consultation Fee */}
        <div className="space-y-1">
          <label htmlFor="filterMaxFee" className="text-xs font-semibold text-muted-foreground">
            Consultation Fee
          </label>
          <select
            id="filterMaxFee"
            value={filters.maxFee || 0}
            onChange={(e) => {
              const val = Number(e.target.value);
              onFilterChange({
                maxFee: val > 0 ? val : undefined,
                page: 1,
              });
            }}
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          >
            {FEE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count & Active Status */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span>
          Showing <strong className="text-foreground">{totalResults}</strong>{" "}
          {totalResults === 1 ? "verified practitioner" : "verified practitioners"}
        </span>
        {hasActiveFilters && (
          <span className="text-[11px] text-primary font-medium">Filtered Results</span>
        )}
      </div>
    </div>
  );
}

export default DoctorFilters;
