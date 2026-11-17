import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  UserCheck,
  CalendarCheck,
  Video,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    stepNumber: "01",
    title: "Search Doctor",
    description: "Find doctors based on your medical needs, symptoms, and medical specialty.",
    icon: Search,
    colorClass: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  },
  {
    stepNumber: "02",
    title: "Check Profile",
    description: "Explore available doctor information, verified qualifications, and consultation fees.",
    icon: UserCheck,
    colorClass: "text-teal-600 dark:text-teal-400 bg-teal-500/10",
  },
  {
    stepNumber: "03",
    title: "Schedule Booking",
    description: "Choose an available 20-minute schedule slot and complete secure Stripe payment.",
    icon: CalendarCheck,
    colorClass: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  },
  {
    stepNumber: "04",
    title: "Get Your Consultation",
    description: "Connect with your doctor via secure video call and download official PDF prescriptions.",
    icon: Video,
    colorClass: "text-primary bg-primary/10",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-background border-b border-border/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          {/* Left Column: Healthcare Consultation Imagery (Clean transparent PNG, no heavy boxes or shadows) */}
          <div className="lg:col-span-5 relative flex items-end justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-md lg:max-w-none flex items-center justify-center">
              {/* Doctor Cutout Frame */}
              <div className="relative w-full aspect-3/4 max-h-[460px] flex items-end justify-center">
                <Image
                  src="/images/how-it-works-doctor.png"
                  alt="Doctor with digital tablet guiding telemedicine consultation"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 450px"
                  className="object-contain object-bottom"
                />
              </div>

              {/* Floating Step Highlights */}
              <div className="absolute bottom-2 -left-1 sm:-left-3 bg-card/95 backdrop-blur-md border border-border/80 shadow-xs rounded-2xl p-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Fast 20-Min Care</p>
                  <p className="text-[11px] text-muted-foreground">Book and meet online today</p>
                </div>
              </div>

              <div className="hidden sm:flex absolute top-4 -right-2 bg-card/95 backdrop-blur-md border border-border/80 shadow-xs rounded-2xl p-2.5 items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold text-foreground">100% Verified Clinicians</span>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Easy Steps */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 order-1 lg:order-2">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary tracking-wide">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Streamlined Patient Journey</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight text-balance">
                4 Easy Steps To{" "}
                <span className="bg-gradient-to-r from-primary via-indigo-600 to-teal-600 bg-clip-text text-transparent">
                  Get Your Solution
                </span>
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty">
                Experience seamless healthcare from browsing verified specialists to receiving your digital prescription.
              </p>
            </div>

            {/* 4 Step Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.stepNumber}
                    className="p-5 rounded-2xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${step.colorClass}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-extrabold font-mono text-muted-foreground/60 bg-muted/60 px-2.5 py-0.5 rounded-full">
                          {step.stepNumber}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA button */}
            <div className="pt-2">
              <Button asChild size="lg" className="gap-2 shadow-xs">
                <Link href="/doctors">
                  <span>Start Your Consultation</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;