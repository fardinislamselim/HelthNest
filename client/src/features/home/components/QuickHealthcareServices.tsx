import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Search,
  Video,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceItem {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgClass: string;
  badge: string;
}

const QUICK_SERVICES: ServiceItem[] = [
  {
    title: "Book Appointment",
    description: "Browse daily schedules and instantly book your dedicated 20-minute slot.",
    href: "/doctors",
    icon: Calendar,
    colorClass: "text-primary",
    bgClass: "bg-primary/10 group-hover:bg-primary/20",
    badge: "Instant Booking",
  },
  {
    title: "Find Doctors",
    description: "Explore verified practitioners, clinical experience, and patient ratings.",
    href: "/doctors",
    icon: Search,
    colorClass: "text-teal-600 dark:text-teal-400",
    bgClass: "bg-teal-500/10 group-hover:bg-teal-500/20",
    badge: "100% Verified",
  },
  {
    title: "Online Consultation",
    description: "Connect face-to-face with licensed doctors through private video rooms.",
    href: "/doctors",
    icon: Video,
    colorClass: "text-indigo-600 dark:text-indigo-400",
    bgClass: "bg-indigo-500/10 group-hover:bg-indigo-500/20",
    badge: "Encrypted Video",
  },
  {
    title: "Digital Medical Records",
    description: "Access your clinical history and download official printable PDF prescriptions.",
    href: "/login",
    icon: FileText,
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    badge: "PDF Prescriptions",
  },
];

export function QuickHealthcareServices() {
  return (
    <section className="py-12 sm:py-16 bg-background border-b border-border/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {QUICK_SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.title}
                href={service.href}
                className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
              >
                <Card className="h-full border border-border/70 hover:border-primary/40 bg-card hover:shadow-md transition-all duration-200">
                  <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 ${service.bgClass} ${service.colorClass}`}
                        >
                          <Icon className="h-6 w-6 group-hover:scale-105 transition-transform" />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/60 px-2.5 py-1 rounded-full border border-border/50">
                          {service.badge}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary pt-2 border-t border-border/40 group-hover:translate-x-1 transition-transform">
                      <span>Explore Service</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default QuickHealthcareServices;