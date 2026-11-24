"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePublicDoctors } from "@/features/public-doctors/hooks/usePublicDoctors";

const INSTANT_SPECIALTIES = [
  { id: "general", label: "General Physician", icon: "stethoscope" },
  { id: "pediatrics", label: "Pediatrician", icon: "child_care" },
  { id: "dermatology", label: "Dermatologist", icon: "dermatology" },
  { id: "psychiatry", label: "Psychiatrist", icon: "psychology" },
];

export function HeroSection() {
  const [activeSpecialty, setActiveSpecialty] = React.useState("general");
  const { doctors } = usePublicDoctors({ limit: 1, page: 1 });
  const featuredDoctor = doctors && doctors.length > 0 ? doctors[0] : null;

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-10">
      {/* Top Ambient Glow */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-secondary-container/20 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Hero Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Value Proposition */}
        <div className="lg:col-span-7 flex flex-col items-start">
          {/* Live Triage Chip */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold mb-4 shadow-xs">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
            </span>
            <span>Verified On-Call Physicians Active Now</span>
            <span className="text-on-secondary-fixed-variant/40">|</span>
            <span className="font-bold">Avg Wait &lt; 8 mins</span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface mb-4 leading-[1.15]">
            Consult Top Doctors <span className="text-primary">Online, Today</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mb-6 leading-relaxed">
            Skip the waiting room. Connect with verified, board-certified specialists for instant
            20-minute video consultations from the comfort of your home. Secure, seamless, and
            insurance-accepted.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 mb-8 w-full sm:w-auto">
            <Link
              href="#quick-booking"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-all shadow-md hover:shadow-lg transform active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              <span>Book Today&apos;s Slot</span>
            </Link>

            <a
              href="tel:1-800-742-273"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface-container-lowest text-primary text-sm font-semibold hover:bg-surface-container-low transition-all shadow-xs border border-border"
            >
              <span className="material-symbols-outlined text-[20px] text-tertiary">emergency</span>
              <span>Emergency Hotline (24/7)</span>
            </a>
          </div>

          {/* Trust Badges Strip */}
          <div className="w-full pt-4 border-t border-border flex flex-wrap items-center gap-4 lg:gap-6 text-on-surface-variant text-xs">
            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-500">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star_half
                </span>
              </div>
              <span className="font-semibold text-on-surface">4.9/5</span>
              <span>(15k+ Reviews)</span>
            </div>

            {/* Verified Doctors */}
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              <span>Verified Medical Board Doctors</span>
            </div>

            {/* Security */}
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">lock</span>
              <span>HIPAA Compliant &amp; Encrypted</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Consultation Card Preview */}
        <div className="lg:col-span-5 relative mt-6 lg:mt-0">
          {/* Backing Glow Panel */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-secondary-fixed/20 to-surface-container-highest/40 rounded-2xl filter blur-xl -z-10"
            aria-hidden="true"
          />

          <div className="bg-surface-container-lowest rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col gap-4 relative border border-border/50">
            {/* Card Header & Live Availability Badge */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-surface-container-high">
              <div className="flex items-center gap-1.5">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                  Triage Live Queue
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-secondary-container text-on-secondary-container rounded-full font-semibold">
                <span className="material-symbols-outlined text-[16px]">schedule</span> Next Slot in 12 Mins
              </span>
            </div>

            {/* Doctor Showcase Tile inside preview */}
            <div className="flex gap-4 items-start bg-surface-container-low p-4 rounded-xl">
              <div className="relative shrink-0">
                <Image
                  src={
                    featuredDoctor?.profileImageUrl ||
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBE95NtFmGftvMCtKnYRJ-9-ninGtBw4LNwGu5dvEr_4hcS2i9zF3VmkSBC0bi6GTCNJCTSXBeJFYx6K9RMmohiB4wjKZ9dUPCA0-T2Q3GddwBhSiY_IvEUTD8YE7bGnkHlAfh_c9MKy28PKR_EbnrYPae12H7SQvAJ2ATPvBQ68XoyoFjwwQHzXq_82P17cPvslx9vbV9me2_YkiofFSnhC9OiHSxdndSeied9DZkz"
                  }
                  alt={featuredDoctor?.name || "Dr. Sarah Lin, MD"}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-xl object-cover shadow-xs"
                  unoptimized
                />
                <span className="absolute -bottom-1 -right-1 bg-secondary text-on-secondary w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[13px]">videocam</span>
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-heading text-sm sm:text-base font-bold text-on-surface truncate">
                    {featuredDoctor ? `Dr. ${featuredDoctor.name}` : "Dr. Sarah Lin, MD"}
                  </h3>
                  <span className="flex items-center text-amber-500 text-xs font-semibold">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>{" "}
                    4.95
                  </span>
                </div>
                <p className="text-xs font-semibold text-primary">
                  {featuredDoctor?.specialization || "Attending Cardiologist"}
                </p>
                <p className="text-xs text-on-surface-variant truncate">
                  {featuredDoctor?.qualifications || "Mount Sinai Hospital • 380+ consultations"}
                </p>
                <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant font-medium">
                    HD Video Encrypted
                  </span>
                  <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded bg-surface-container-lowest text-primary font-medium">
                    {featuredDoctor?.consultationFee != null
                      ? `Fee: $${featuredDoctor.consultationFee}`
                      : "Copay: $0 - $35"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Specialty Pills */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] text-on-surface-variant uppercase font-medium">
                Instant Specialty Filters
              </span>
              <div className="flex flex-wrap gap-1.5" id="heroPillsContainer">
                {INSTANT_SPECIALTIES.map((spec) => {
                  const isActive = activeSpecialty === spec.id;
                  return (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => setActiveSpecialty(spec.id)}
                      className={`hero-filter-btn inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? "bg-primary text-on-primary shadow-xs"
                          : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">{spec.icon}</span>
                      <span>{spec.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Micro-Schedule Action */}
            <div className="pt-1">
              <div className="bg-surface-container-low p-2.5 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">timer</span>
                  <div>
                    <div className="text-xs font-semibold text-on-surface">Today, 2:40 PM</div>
                    <div className="text-[11px] text-on-surface-variant">20-minute direct tele-slot</div>
                  </div>
                </div>
                <Link
                  href="/dashboard/schedules"
                  className="px-4 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  Select
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
