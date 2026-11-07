"use client";

import * as React from "react";
import { Activity, CheckCircle2, XCircle, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AnalyticsStatsSummaryProps {
  total: number;
  completionRate: number;
  cancellationRate: number;
  totalPaidAmount: number;
  isLoading?: boolean;
}

export function AnalyticsStatsSummary({
  total,
  completionRate,
  cancellationRate,
  totalPaidAmount,
  isLoading = false,
}: AnalyticsStatsSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-card border border-border/80 p-4 animate-pulse min-w-0" />
        ))}
      </div>
    );
  }

  const items = [
    {
      title: "Total Consultations",
      value: total,
      description: "All-time patient bookings",
      icon: Activity,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      description: "Successfully attended visits",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Cancellation Rate",
      value: `${cancellationRate}%`,
      description: "Cancelled before schedule",
      icon: XCircle,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
    },
    {
      title: "Total Healthcare Spent",
      value: `$${totalPaidAmount.toFixed(2)}`,
      description: "USD verified consultations",
      icon: DollarSign,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <Card key={it.title} className="shadow-xs min-w-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 gap-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                {it.title}
              </CardTitle>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${it.bg} ${it.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                {it.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {it.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default AnalyticsStatsSummary;
