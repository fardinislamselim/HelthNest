import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  Star,
  Users,
  CheckCircle2,
  Video,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-18 lg:pb-24 border-b border-border/60">
      {/* Decorative ambient gradients */}
      <div
        className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 left-10 -z-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Trust Badge, Headline, Description, CTAs, Trust points */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-xs">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Verified Medical Care & Telemedicine</span>
            </div>

            {/* Main Headline inspired by Doccure */}
            <div className="space-y-3.5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12] text-balance">
                Consult Best Doctors{" "}
                <span className="bg-gradient-to-r from-primary via-indigo-600 to-teal-600 bg-clip-text text-transparent">
                  Near You
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 text-pretty">
                Find trusted healthcare professionals, explore medical specialties, and book your appointment with ease.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-1">
              <Button
                asChild
                size="lg"
                className="h-12 px-7 text-sm sm:text-base font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all gap-2"
              >
                <Link href="/doctors">
                  <span>Get Appointment</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 px-7 text-sm sm:text-base font-semibold border-border hover:bg-muted/60 transition-all"
              >
                <Link href="/doctors">Explore Doctors</Link>
              </Button>
            </div>

            {/* Quick Trust Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/60 text-left">
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-card/70 border border-border/50 shadow-2xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">20-Min Slots</p>
                  <p className="text-[11px] text-muted-foreground">Dedicated sessions</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-card/70 border border-border/50 shadow-2xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">100% Verified</p>
                  <p className="text-[11px] text-muted-foreground">Licensed clinicians</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-card/70 border border-border/50 shadow-2xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 shrink-0">
                  <Video className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Digital Care</p>
                  <p className="text-[11px] text-muted-foreground">Video & PDF scripts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Doctor Image with Floating Cards */}
          <div className="lg:col-span-5 relative flex items-end justify-center">
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none flex items-center justify-center">
              {/* Doctor Cutout Frame - Clean transparent PNG without artificial shadow boxes */}
              <div className="relative w-full h-[380px] xs:h-[440px] sm:h-[500px] lg:h-[560px] flex items-end justify-center">
                <Image
                  src="/images/hero-doctor.png"
                  alt="Professional healthcare doctor with stethoscope ready for consultations"
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 560px"
                  className="object-contain object-bottom"
                />
              </div>

              {/* Floating Badge 1: Top Right - Verified Practitioner */}
              <div className="absolute top-4 -right-1 sm:-right-3 bg-card/95 backdrop-blur-md border border-border/80 shadow-xs rounded-2xl p-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Verified Doctors</p>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Board Certified</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Left - Appointment Available */}
              <div className="absolute bottom-2 -left-1 sm:-left-3 bg-card/95 backdrop-blur-md border border-border/80 shadow-xs rounded-2xl p-3 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <p className="text-xs font-bold text-foreground">Consultation Open</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">20-minute video slots daily</p>
                </div>
              </div>

              {/* Floating Badge 3: Patient Trust Pill */}
              <div className="hidden sm:flex absolute top-1/2 -left-5 -translate-y-1/2 bg-card/95 backdrop-blur-md border border-border/80 shadow-xs rounded-xl p-2.5 items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" />
                </div>
                <div className="pr-1">
                  <p className="text-xs font-bold text-foreground">4.9 / 5.0 Rating</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Trusted Care
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;