import * as React from "react";
import Link from "next/link";
import { ShieldCheck, HeartPulse, Clock, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          About HealthNest
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Bridging the gap between certified medical experts and patients through a reliable, secure telemedicine consultation platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-6">
        <div className="p-6 rounded-xl border border-border bg-card space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <HeartPulse className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            HealthNest was built to eliminate waiting room bottlenecks and geographic barriers. We empower doctors to publish focused, predictable schedules while offering patients transparent access to quality consultations.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Strict Practitioner Approval</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every practitioner application undergoes rigorous review. Medical licenses, qualifications, and credentials are authenticated by administrators before a doctor can publish schedules.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Clock className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Fair 1-Hour Cancellation Rule</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We value your time and our doctors&apos; commitments. Appointments cancelled more than 1 hour before schedule start are eligible for automated refunds processed back to your original payment method.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Digital Prescription Records</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            No lost paper slips. All clinical findings, dosages, and medicine durations issued by your doctor are permanently stored in your patient portal and downloadable as printable PDFs.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-xl bg-primary/5 border border-primary/20 text-center space-y-4">
        <h3 className="text-xl font-bold text-foreground">Ready to take control of your healthcare?</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Sign up today to discover available doctors or apply to join our medical network.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button asChild>
            <Link href="/register">Create Patient Account</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/doctors/apply">Apply as Doctor</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
