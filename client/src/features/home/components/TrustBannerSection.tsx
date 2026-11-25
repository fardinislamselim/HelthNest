"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Zap } from "lucide-react";

export function TrustBannerSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16 overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary-container rounded-3xl p-6 sm:p-8 lg:p-10 text-on-primary shadow-xl relative overflow-hidden w-full">
        {/* Decorative background wave */}
        <div
          className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-tertiary-fixed/10 blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-8 w-full">
          <div className="space-y-3 text-center md:text-left min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-on-primary/10 text-on-primary text-xs font-semibold backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Certified Telemedicine Platform</span>
            </div>

            <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl text-on-primary font-bold leading-snug">
              Zero Commute • 100% Confidential • Instant Digital Prescriptions
            </h2>

            <p className="text-xs sm:text-sm text-on-primary-container max-w-2xl leading-relaxed">
              Compliant with federal telehealth parity guidelines. Your electronic health records and
              video sessions are protected by 256-bit HIPAA-grade security.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="#quick-booking"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface-container-lowest text-primary text-sm font-semibold hover:bg-surface-container-low transition-all shadow-md active:scale-[0.98] whitespace-nowrap"
            >
              <Zap className="h-4 w-4 shrink-0 fill-primary" />
              <span>Get Immediate Care</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustBannerSection;
