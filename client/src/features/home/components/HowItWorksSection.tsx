"use client";

import * as React from "react";
import Link from "next/link";

export function HowItWorksSection() {
  return (
    <section className="w-full bg-surface-container-low py-12 lg:py-16 my-8" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 bg-secondary-container rounded-full inline-block mb-2">
            Care Delivery Architecture
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-on-surface font-bold">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-1.5">
            Affordable, compassionate healthcare delivered in three simple steps.
          </p>
        </div>

        {/* 3-Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Step 1 */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between border border-border/50">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-primary font-heading font-bold text-lg">
                  01
                </div>
                <span className="material-symbols-outlined text-primary text-[32px]">
                  event_available
                </span>
              </div>
              <h3 className="font-heading text-lg text-on-surface font-semibold mb-2">
                Pick Today&apos;s Open Slot
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Browse licensed specialists across 25+ medical fields and pick a convenient 20-minute open appointment today.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-surface-container-high">
              <Link
                href="/doctors"
                className="flex items-center gap-1 text-primary text-xs font-semibold hover:underline"
              >
                <span>Browse 25+ specialties</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between border border-border/50">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-primary font-heading font-bold text-lg">
                  02
                </div>
                <span className="material-symbols-outlined text-secondary text-[32px]">
                  credit_card
                </span>
              </div>
              <h3 className="font-heading text-lg text-on-surface font-semibold mb-2">
                Pay &amp; Get Instant Meet Link
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Transparent upfront pricing with insurance copay support. Receive your private, encrypted HD video link instantly via SMS and email.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-surface-container-high flex items-center gap-1 text-secondary text-xs font-semibold">
              <span>Zero hidden platform fees</span>
              <span className="material-symbols-outlined text-[16px]">verified</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between border border-border/50">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-primary font-heading font-bold text-lg">
                  03
                </div>
                <span className="material-symbols-outlined text-tertiary text-[32px]">
                  prescriptions
                </span>
              </div>
              <h3 className="font-heading text-lg text-on-surface font-semibold mb-2">
                Join Call &amp; Receive Digital Prescription
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Consult your doctor in real time. Receive verified electronic prescriptions and care summaries sent right to your nearest pharmacy or app.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-surface-container-high flex items-center gap-1 text-primary text-xs font-semibold">
              <span>Sent straight to your pharmacy</span>
              <span className="material-symbols-outlined text-[16px]">local_pharmacy</span>
            </div>
          </div>
        </div>

        {/* Feature Highlight Metric Strip */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-surface-container-lowest/80 rounded-xl border border-border/40 shadow-2xs">
            <div className="font-heading text-2xl sm:text-3xl text-primary font-bold">99.4%</div>
            <div className="text-xs text-on-surface-variant mt-0.5">Patient Satisfaction</div>
          </div>
          <div className="p-4 bg-surface-container-lowest/80 rounded-xl border border-border/40 shadow-2xs">
            <div className="font-heading text-2xl sm:text-3xl text-primary font-bold">&lt; 15m</div>
            <div className="text-xs text-on-surface-variant mt-0.5">Avg Prescription Arrival</div>
          </div>
          <div className="p-4 bg-surface-container-lowest/80 rounded-xl border border-border/40 shadow-2xs">
            <div className="font-heading text-2xl sm:text-3xl text-primary font-bold">50+</div>
            <div className="text-xs text-on-surface-variant mt-0.5">Partner Networks</div>
          </div>
          <div className="p-4 bg-surface-container-lowest/80 rounded-xl border border-border/40 shadow-2xs">
            <div className="font-heading text-2xl sm:text-3xl text-primary font-bold">256-bit</div>
            <div className="text-xs text-on-surface-variant mt-0.5">End-to-End Encryption</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
