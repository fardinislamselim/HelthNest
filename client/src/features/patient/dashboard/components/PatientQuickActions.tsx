"use client";

import * as React from "react";
import Link from "next/link";
import { PlusCircle, Calendar, FileText, CreditCard, User, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PatientQuickActions() {
  const actions = [
    {
      title: "Book Consultation",
      description: "Browse today's open schedules & book slots",
      href: "/dashboard/schedules",
      icon: PlusCircle,
      color: "text-primary",
      bg: "bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground",
    },
    {
      title: "My Appointments",
      description: "Track status, join calls & view history",
      href: "/dashboard/appointments",
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10 group-hover:bg-blue-600 group-hover:text-white",
    },
    {
      title: "Prescriptions",
      description: "Access doctor advice & download Rx PDFs",
      href: "/dashboard/prescriptions",
      icon: FileText,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 group-hover:bg-emerald-600 group-hover:text-white",
    },
    {
      title: "Billing & Refunds",
      description: "Payment receipts & refund tracking",
      href: "/dashboard/payments",
      icon: CreditCard,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10 group-hover:bg-amber-600 group-hover:text-white",
    },
    {
      title: "Personal Analytics",
      description: "Appointment trends & health summaries",
      href: "/dashboard/analytics",
      icon: BarChart3,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10 group-hover:bg-purple-600 group-hover:text-white",
    },
    {
      title: "Profile & Settings",
      description: "Update contact details & profile photo",
      href: "/dashboard/profile",
      icon: User,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-500/10 group-hover:bg-sky-600 group-hover:text-white",
    },
  ];

  return (
    <Card className="shadow-xs min-w-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <Link
                key={act.title}
                href={act.href}
                className="group flex flex-col items-start p-3 sm:p-3.5 rounded-lg border border-border/70 bg-card hover:border-primary/40 hover:bg-muted/40 transition-all min-w-0"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors mb-2 shrink-0 ${act.bg} ${act.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate w-full">
                  {act.title}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                  {act.description}
                </p>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default PatientQuickActions;
