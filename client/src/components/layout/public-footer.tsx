import * as React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & mission */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-foreground font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Activity className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="font-bold tracking-tight text-base">HealthNest</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Secure online medical consultations connecting patients with certified healthcare practitioners.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/doctors" className="hover:text-foreground transition-colors">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Patient Portal
                </Link>
              </li>
              <li>
                <Link href="/doctors/apply" className="hover:text-foreground transition-colors">
                  Join as a Doctor
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">About</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Support & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Healthcare disclaimer */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Medical Disclaimer</h4>
            <p className="text-xs text-muted-foreground leading-normal">
              HealthNest provides a platform for remote telemedicine. In case of a medical emergency, please call your local emergency services immediately.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>&copy; {currentYear} HealthNest. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;

