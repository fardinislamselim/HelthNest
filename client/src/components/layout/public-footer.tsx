import * as React from "react";
import Link from "next/link";
import { Activity, ShieldCheck, HeartPulse } from "lucide-react";

const FOOTER_SPECIALTIES = [
  "General Medicine",
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Neurology",
  "Psychiatry",
];

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & mission (Span 2 on desktop) */}
          <div className="space-y-3.5 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 text-foreground font-semibold">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                <Activity className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="font-extrabold tracking-tight text-lg">HealthNest</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Modern telemedicine platform connecting patients with certified medical doctors for 20-minute video consultations and official digital prescriptions.
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Licensed Practitioners
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <HeartPulse className="h-3.5 w-3.5 text-primary" />
                Telehealth Care
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/doctors" className="hover:text-primary transition-colors">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Patient Portal
                </Link>
              </li>
              <li>
                <Link href="/doctors/apply" className="hover:text-primary transition-colors">
                  Join as a Doctor
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Practitioner Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Specialties */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Specialties
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {FOOTER_SPECIALTIES.map((spec) => (
                <li key={spec}>
                  <Link
                    href={`/doctors?specialization=${encodeURIComponent(spec)}`}
                    className="hover:text-primary transition-colors"
                  >
                    {spec}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              About
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Support & Contact
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  Quality Standards
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Medical disclaimer */}
        <div className="p-4 rounded-xl bg-card/60 border border-border/60 text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Medical Emergency Notice: </span>
          HealthNest is designed for non-emergency medical consultations and routine telehealth evaluations. If you or someone you know is experiencing a life-threatening medical emergency, please call 911 or your local emergency medical service immediately.
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>&copy; {currentYear} HealthNest. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;