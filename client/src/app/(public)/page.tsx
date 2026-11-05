import Link from "next/link";
import {
  Clock,
  ShieldCheck,
  FileCheck2,
  Video,
  ArrowRight,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Certified Healthcare Practitioners</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Healthcare When You Need It,{" "}
              <span className="text-primary">Where You Are</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Book real-time 20-minute video consultations with verified doctors today. Receive digital prescriptions and dedicated medical care from home.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto gap-2">
                <Link href="/doctors">
                  Find Available Doctors
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/doctors/apply">Apply as a Doctor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 md:py-20 bg-background border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Simple 3-Step Consultation
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Streamlined and transparent process from doctor discovery to prescription delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="border border-border/80 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  1. Discover Today&apos;s Schedules
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Browse certified doctors available today and select a convenient 20-minute consultation slot before schedule start.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border border-border/80 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Video className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  2. Secure Payment & Video Call
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Pay securely upfront to receive your appointment serial number and instant access to the private video consultation link.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border border-border/80 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileCheck2 className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  3. Digital Prescriptions
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  After your consultation is completed, access your official digital prescription and download printable PDF documents anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground bg-background">
                <Stethoscope className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>Verified Credentials</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Strict Quality Standards & Transparent Policies
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Every doctor on HealthNest submits licensed medical certifications reviewed and approved by administrators. Appointments cancelled more than one hour before schedule start qualify for automated refunds.
              </p>
              <div className="flex gap-4 pt-2">
                <Button asChild variant="outline">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="text-2xl font-bold text-primary">20 Min</div>
                <div className="text-xs text-muted-foreground mt-1">Dedicated slots per consultation</div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-xs text-muted-foreground mt-1">Licensed & verified doctors</div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="text-2xl font-bold text-primary">1 Hour</div>
                <div className="text-xs text-muted-foreground mt-1">Flexible refund cancellation rule</div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="text-2xl font-bold text-primary">Digital PDF</div>
                <div className="text-xs text-muted-foreground mt-1">Official prescription records</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
