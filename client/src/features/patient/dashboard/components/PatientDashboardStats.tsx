"use client";

import * as React from "react";
import { Calendar, CheckCircle2, XCircle, CreditCard, Clock, RotateCcw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { DashboardAppointments, DashboardPayments, DashboardRefunds } from "../types/dashboard.types";

interface PatientDashboardStatsProps {
  appointments?: DashboardAppointments;
  payments?: DashboardPayments;
  refunds?: DashboardRefunds;
  isLoading?: boolean;
}

export function PatientDashboardStats({
  appointments,
  payments,
  refunds,
  isLoading = false,
}: PatientDashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Card key={idx} className="animate-pulse shadow-xs min-w-0">
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-7 w-16 bg-muted rounded mb-2" />
              <div className="h-3 w-32 bg-muted/60 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: "Total Appointments",
      value: appointments?.total ?? 0,
      description: `${appointments?.today ?? 0} scheduled for today`,
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Upcoming",
      value: appointments?.booked ?? 0,
      description: "Confirmed upcoming slots",
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Completed",
      value: appointments?.completed ?? 0,
      description: "Finished consultations",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Cancelled",
      value: appointments?.cancelled ?? 0,
      description: "Cancelled bookings",
      icon: XCircle,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
    },
    {
      title: "Total Paid",
      value: `$${(payments?.totalAmount ?? 0).toFixed(2)}`,
      description: `${payments?.successfulCount ?? 0} successful payments`,
      icon: CreditCard,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      title: "Total Refunded",
      value: `$${(refunds?.totalRefundedAmount ?? 0).toFixed(2)}`,
      description: `${refunds?.completed ?? 0} refunds completed`,
      icon: RotateCcw,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="shadow-xs transition-shadow hover:shadow-sm min-w-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 gap-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                {item.title}
              </CardTitle>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${item.bg} ${item.color}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                {item.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {item.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default PatientDashboardStats;
