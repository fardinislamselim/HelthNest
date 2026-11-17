import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Target,
  Eye,
  CheckCircle2,
  ArrowRight,
  Clock,
  HeartPulse,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-muted/20 border-b border-border/70">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          {/* Left Column: Doctor Imagery Composition (Clean transparent PNG, no heavy boxes or shadows) */}
          <div className="lg:col-span-5 relative flex items-end justify-center">
            <div className="relative w-full max-w-md lg:max-w-none flex items-center justify-center">
              {/* Doctor Cutout Frame */}
              <div className="relative w-full aspect-3/4 max-h-[460px] flex items-end justify-center">
                <Image
                  src="/images/about-doctor.png"
                  alt="Certified medical doctor providing patient consultations"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 450px"
                  className="object-contain object-bottom"
                />
              </div>

              {/* Floating Stat Card: Verified Clinicians */}
              <div className="absolute bottom-2 -right-1 sm:-right-3 bg-card/95 backdrop-blur-md border border-border/80 shadow-xs rounded-2xl p-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Verified Doctors</p>
                  <p className="text-[11px] text-muted-foreground">Certified medical licenses</p>
                </div>
              </div>

              {/* Floating Stat Card: Consultation Time */}
              <div className="hidden sm:flex absolute top-4 -left-2 bg-card/95 backdrop-blur-md border border-border/80 shadow-xs rounded-2xl p-2.5 items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">20-Min Dedicated Slots</p>
                  <p className="text-[10px] text-muted-foreground">Focused patient time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative, Mission, Vision, Action */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary tracking-wide">
                <HeartPulse className="h-3.5 w-3.5" />
                <span>About HealthNest</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight text-balance">
                We Understand That{" "}
                <span className="bg-gradient-to-r from-primary via-indigo-600 to-teal-600 bg-clip-text text-transparent">
                  Every Patient Is Unique
                </span>
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty">
                HealthNest makes healthcare accessible by connecting patients with certified medical professionals through a convenient, private telemedicine platform. From routine follow-ups to specialized consultations, we eliminate long clinic queues and deliver quality healthcare wherever you are.
              </p>
            </div>

            {/* Mission & Vision Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mission Card */}
              <Card className="border border-border/80 bg-card shadow-xs hover:border-primary/40 transition-colors">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Target className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">Our Mission</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    To empower patients with direct, transparent access to licensed practitioners, scheduled 20-minute video visits, and official digital prescriptions.
                  </p>
                </CardContent>
              </Card>

              {/* Vision Card */}
              <Card className="border border-border/80 bg-card shadow-xs hover:border-primary/40 transition-colors">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      <Eye className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">Our Vision</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    To build a modern healthcare standard where distance never compromises medical quality, patient security, or clinical peace of mind.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Feature Checklist & Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border/60">
              <div className="flex items-center gap-4 text-xs font-semibold text-foreground/85">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Stripe Protected
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Licensed MDs
                </span>
              </div>

              <Button asChild variant="outline" size="sm" className="gap-2 text-xs">
                <Link href="/about">
                  <span>Learn More About Us</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;