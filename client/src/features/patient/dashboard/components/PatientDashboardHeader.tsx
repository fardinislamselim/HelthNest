"use client";

import * as React from "react";
import Link from "next/link";
import { PlusCircle, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PatientDashboardHeaderProps {
  userName: string;
}

export function PatientDashboardHeader({ userName }: PatientDashboardHeaderProps) {
  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 border-b border-border/60">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground truncate">
            Welcome back, {userName}
          </h1>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary shrink-0">
            <Sparkles className="h-3 w-3 mr-1" />
            Patient
          </span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
            <span>{todayFormatted}</span>
          </span>
          <span className="text-muted-foreground/40 hidden xs:inline">•</span>
          <span>Your personal health management hub</span>
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Button asChild size="default" className="w-full sm:w-auto shadow-xs gap-2 text-xs sm:text-sm">
          <Link href="/dashboard/schedules">
            <PlusCircle className="h-4 w-4" />
            Book Consultation
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default PatientDashboardHeader;
