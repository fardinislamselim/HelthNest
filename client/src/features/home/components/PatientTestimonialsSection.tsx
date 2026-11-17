import * as React from "react";
import Link from "next/link";
import { MessageSquareHeart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PatientTestimonialsSection() {
  // HealthNest does not store public patient review submissions in the current API schema.
  // In accordance with instructions, we do not invent fabricated clinical reviews or fake ratings.
  // Instead, we present an authentic patient satisfaction and feedback invitation banner.
  return (
    <section className="py-14 sm:py-18 bg-muted/20 border-b border-border/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-xs max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageSquareHeart className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <span>Patient Trust & Care</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                What Our Patients Say About Us
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                We take patient satisfaction seriously. Every consultation is evaluated for clinical quality, punctuality, and clear digital prescription records.
              </p>
            </div>
          </div>

          <Button asChild variant="outline" size="sm" className="shrink-0 gap-2 text-xs">
            <Link href="/contact">
              <span>Share Feedback</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default PatientTestimonialsSection;