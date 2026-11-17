import * as React from "react";
import {
  ShieldCheck,
  HeartPulse,
  Stethoscope,
  Clock,
  Activity,
  FileCheck2,
} from "lucide-react";

interface MarqueeItem {
  text: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MARQUEE_ITEMS: MarqueeItem[] = [
  { text: "Online Appointment Booking", icon: Clock },
  { text: "Verified Medical Professionals", icon: ShieldCheck },
  { text: "Secure Healthcare Experience", icon: Activity },
  { text: "Easy Doctor Consultation", icon: Stethoscope },
  { text: "Patient-Centered Healthcare", icon: HeartPulse },
  { text: "Digital Prescriptions & Records", icon: FileCheck2 },
];

export function AnnouncementMarquee() {
  return (
    <section
      aria-label="HealthNest Announcements"
      className="relative w-full overflow-hidden border-y border-border/80 bg-muted/40 py-3.5 select-none"
    >
      {/* Left/Right Edge Gradient Fade Masks */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 sm:w-24 bg-gradient-to-r from-background to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 sm:w-24 bg-gradient-to-l from-background to-transparent"
        aria-hidden="true"
      />

      <div className="flex animate-marquee">
        {/* Render 2 identical sequences for seamless infinite loop */}
        {[0, 1].map((copyIndex) => (
          <div
            key={copyIndex}
            className="flex shrink-0 items-center gap-8 sm:gap-12 px-4"
            aria-hidden={copyIndex === 1 ? "true" : undefined}
          >
            {MARQUEE_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${copyIndex}-${idx}`}
                  className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-foreground/85 tracking-wide"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span>{item.text}</span>
                  <span className="text-muted-foreground/40 font-bold ml-4">•</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

export default AnnouncementMarquee;