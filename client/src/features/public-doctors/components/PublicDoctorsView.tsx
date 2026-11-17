"use client";

import * as React from "react";
import Link from "next/link";
import {
  Stethoscope,
  ShieldCheck,
  Video,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { DoctorFilters } from "./DoctorFilters";
import { DoctorList } from "./DoctorList";
import { usePublicDoctors } from "../hooks/usePublicDoctors";
import { Button } from "@/components/ui/button";
import type { PublicDoctorFilterParams } from "../types/doctor.types";

export function PublicDoctorsView() {
  const [filters, setFilters] = React.useState<PublicDoctorFilterParams>({
    page: 1,
    limit: 12,
    search: "",
    specialization: undefined,
    minExperience: undefined,
    maxFee: undefined,
  });

  const { doctors, meta, isLoading, isError, error, refetch } = usePublicDoctors(filters);

  const handleFilterChange = (newFilters: Partial<PublicDoctorFilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      search: "",
      specialization: undefined,
      minExperience: undefined,
      maxFee: undefined,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl">
        {/* =========================================================================
            1. HERO / BANNER HEADER
            ========================================================================= */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Verified Practitioner Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Find Qualified Doctors & Specialists
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Search board-certified physicians, explore verified clinical credentials, and book discrete 20-minute video consultations on your schedule.
          </p>

          {/* Trust Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-card border border-border/70 shadow-2xs">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">100% Verified</p>
                <p className="text-[11px] text-muted-foreground truncate">Credentials authenticated</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-card border border-border/70 shadow-2xs">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Clock className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">20-Min Telehealth</p>
                <p className="text-[11px] text-muted-foreground truncate">Sequenced consultations</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-card border border-border/70 shadow-2xs">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Video className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">Private Video Room</p>
                <p className="text-[11px] text-muted-foreground truncate">Secure Google Meet</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. SEARCH & FILTER CONTROLS
            ========================================================================= */}
        <section aria-label="Search and Filters">
          <DoctorFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            totalResults={meta.total}
          />
        </section>

        {/* =========================================================================
            3. DOCTORS DIRECTORY GRID
            ========================================================================= */}
        <section aria-label="Verified Doctors List" className="space-y-4">
          <DoctorList
            doctors={doctors}
            meta={meta}
            isLoading={isLoading}
            isError={isError}
            errorMessage={error?.message}
            onRetry={() => refetch()}
            onPageChange={handlePageChange}
            onResetFilters={handleResetFilters}
          />
        </section>

        {/* =========================================================================
            4. JOIN AS A PRACTITIONER CTA
            ========================================================================= */}
        <section className="mt-12 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Stethoscope className="h-4 w-4" />
              <span>Healthcare Professional Portal</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Are you a licensed doctor or medical specialist?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Join HealthNest to establish your virtual consultation practice, publish availability slots, and consult with patients nationwide.
            </p>
          </div>

          <Button asChild size="default" className="shrink-0 gap-2 font-medium shadow-xs">
            <Link href="/doctors/apply">
              <span>Apply as a Practitioner</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}

export default PublicDoctorsView;
