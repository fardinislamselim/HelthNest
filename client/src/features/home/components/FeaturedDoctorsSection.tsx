"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePublicDoctors } from "@/features/public-doctors/hooks/usePublicDoctors";

const FALLBACK_PORTRAITS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAGgv3_JEVNOyYjA-YaWPFlMSLNWnNovdfrJspNwKUQL9zzGzCe82jPYY7Mt_qZlDTZ6Otu5lzU3wV202-8iaH-PicVhNp7fuEHqA2jbQYBd3SvEIbZFo8DV2lW2pdQh3gbwvJBXb8aH9eYcJ_hYVGub1NKePw_FiukXb1ARdVQPkbwy44znSthSYDWsXBfgWLRQ31bnqjYDdnzOdFXp6Mg0zPancTE-Tw3vwHcsMoz",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD-DdymofLvJk22idSVDnZLwiXqc4seXweU1EQyzjJVnLMVktX5Bk8e23lwcuAhVjHmlTjQPZrdSMZhVjIcI2AgwdJZowyYifcAnMGiAr5z-D9ZsE4nlASBBPnUaSGTrpjLe8-zaRREtiOjFTebh_0s3E7sH2h8p3p1WRC8rWoTZVr5qIX9Nj8YBF9qnYbfhzgjW0TBDppcdbj_2Cru2-n4QtDT3qM2JWxytiqeziG7",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDU8giESbXpGRXaHhswoSppa_y-x2H7jvkRRkkWgNASiqmgllvVsSPhc9Se1s6RGdTb8-m9lk079e_k9VkbYH5d8F3CqEbNqSJg36WJgZySpsw0RfvcLhe5-AKQ3fhslMYxs43YMfRJBm6Tf564IY2PX8VlDrfCS-g7b0Yejt7RoAKjBxs_smhAwqwT5UUXajcki6A-yR1P9fOQDNcBXEU0zNQuGpmWtLJ1yuXEQ4gV",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAryiKYmJXvE2RcBYKZbdVhydAYjx5OjUtaiUjlm41sbvvP2e-wbx25nsd5vUK7TTbiPalOvLbVTl4OLqqi0BcvOPivUoeene3G5JzhL1EICxX0Cm4OzKtM3BwqMMKvSjAsvWcjkXWTwoL1JkFyfUda-GeO8vXXY9Pj6hHWdVyC9tDIhkJBpec8FeiK3rK5t6VGb_RS2sHk-Bn-1s5mnRjKm0X8h1rQPSB_xupbWmMh",
];

export function FeaturedDoctorsSection() {
  const { doctors, isLoading, isError, error, refetch } = usePublicDoctors({
    limit: 4,
    page: 1,
  });

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16" id="specialists-catalog">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 bg-secondary-container rounded-full inline-block mb-2">
            On-Duty Clinicians
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-on-surface font-bold">
            Featured Specialists
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-1.5">
            Top-rated board-certified doctors available for consultations today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Filter Specialties</span>
          </Link>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-border/50 space-y-4 animate-pulse"
            >
              <div className="flex items-start justify-between">
                <div className="w-20 h-20 rounded-2xl bg-surface-container" />
                <div className="w-24 h-6 rounded-full bg-surface-container" />
              </div>
              <div className="space-y-2">
                <div className="w-3/4 h-5 rounded bg-surface-container" />
                <div className="w-1/2 h-4 rounded bg-surface-container/70" />
                <div className="w-full h-3 rounded bg-surface-container/50" />
              </div>
              <div className="h-10 rounded-lg bg-surface-container/40" />
              <div className="h-10 rounded-xl bg-surface-container" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-destructive">
            {error?.message || "Could not retrieve doctor profiles at this time."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-surface border border-border hover:bg-muted transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && doctors.length === 0 && (
        <div className="rounded-2xl border border-border/80 bg-surface-container-lowest p-10 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[24px]">person</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">Doctors Joining Shortly</h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Our medical review board is currently processing practitioner credentials.
            </p>
          </div>
          <Link
            href="/doctors/apply"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors"
          >
            Apply as Doctor
          </Link>
        </div>
      )}

      {/* 4-Column Doctor Grid */}
      {!isLoading && !isError && doctors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor, idx) => {
            const avatarSrc = doctor.profileImageUrl || FALLBACK_PORTRAITS[idx % FALLBACK_PORTRAITS.length];
            return (
              <div
                key={doctor.id}
                className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group border border-border/50"
              >
                <div>
                  {/* Avatar + Status Pill */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="relative">
                      <Image
                        src={avatarSrc}
                        alt={`Dr. ${doctor.name}`}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-2xl object-cover shadow-xs group-hover:scale-[1.02] transition-transform"
                        unoptimized
                      />
                      <span
                        className="absolute -bottom-1 -right-1 bg-primary text-on-primary w-6 h-6 rounded-full flex items-center justify-center text-[12px] shadow-xs"
                        title="Board Certified"
                      >
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      <span>Available Today</span>
                    </span>
                  </div>

                  {/* Doctor Name & Credentials */}
                  <h3 className="font-heading text-base font-bold text-on-surface mb-0.5 truncate group-hover:text-primary transition-colors">
                    Dr. {doctor.name}
                  </h3>
                  <p className="text-xs font-semibold text-primary mb-1 truncate">
                    {doctor.specialization}
                  </p>
                  <p className="text-xs text-on-surface-variant mb-3 truncate">
                    {doctor.qualifications || "Board Certified"} • {doctor.experienceYears || 8} yrs exp
                  </p>

                  {/* Badges / Languages */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">
                      English
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">
                      Telehealth
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 text-amber-500 mb-3">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="text-xs font-bold text-on-surface">4.95</span>
                    <span className="text-xs text-on-surface-variant">(120+ reviews)</span>
                  </div>

                  {/* Availability Alert */}
                  <div className="p-2 px-3 bg-surface-container-low rounded-lg mb-4 flex items-center gap-1.5 text-on-surface-variant text-xs">
                    <span className="material-symbols-outlined text-primary text-[18px]">access_time</span>
                    <span className="font-medium text-on-surface truncate">
                      Today: Available{" "}
                      <span className="text-on-surface-variant font-normal">
                        {doctor.consultationFee != null ? `(Fee: $${doctor.consultationFee})` : "(Immediate Direct Slot)"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/doctors/${doctor.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1 shadow-xs active:scale-[0.98]"
                >
                  <span>View Today&apos;s Schedule</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* View All CTA */}
      <div className="mt-10 text-center">
        <Link
          href="/doctors"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-container px-6 py-2.5 rounded-xl bg-secondary-container/50 hover:bg-secondary-container transition-all"
        >
          <span>Explore All 140+ Available Clinicians</span>
          <span className="material-symbols-outlined text-[18px]">east</span>
        </Link>
      </div>
    </section>
  );
}

export default FeaturedDoctorsSection;
