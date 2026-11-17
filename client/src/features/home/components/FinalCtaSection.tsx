import * as React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Video, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary via-indigo-700 to-teal-800 text-white p-8 sm:p-12 md:p-16 shadow-2xl overflow-hidden text-center md:text-left">
          {/* Subtle Ambient Background circles */}
          <div
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-teal-400/20 blur-2xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Text & Value Proposition */}
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-white/95">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Modern Healthcare at Your Fingertips</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
                Your Health Deserves The Best Care
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-white/85 max-w-2xl leading-relaxed text-pretty">
                From everyday health concerns to specialized consultations, HealthNest helps you connect with the right healthcare professionals.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-white/90 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  20-Min Dedicated Slots
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  Encrypted Video Consultations
                </span>
                <span className="flex items-center gap-1.5">
                  <Video className="h-3.5 w-3.5" />
                  Instant Digital Prescriptions
                </span>
              </div>
            </div>

            {/* CTA Button Block */}
            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col items-center md:items-end justify-center gap-3">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-13 px-8 text-base font-bold bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary transition-all duration-300 gap-2 shadow-xs"
              >
                <Link href="/doctors">
                  <span>Find Your Doctor</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-13 px-8 text-base font-semibold border-white/30 text-white hover:bg-white/10 transition-all"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCtaSection;