"use client";

import * as React from "react";
import { CreditCard, CheckCircle2, RotateCcw, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PaymentStatsSummaryProps {
  totalAmount: number;
  successfulCount: number;
  totalRefundedAmount: number;
  completedRefunds: number;
  pendingRefunds: number;
  isLoading?: boolean;
}

export function PaymentStatsSummary({
  totalAmount,
  successfulCount,
  totalRefundedAmount,
  completedRefunds,
  pendingRefunds,
  isLoading = false,
}: PaymentStatsSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-card border border-border/80 p-4 animate-pulse min-w-0" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Paid",
      value: `$${totalAmount.toFixed(2)} USD`,
      description: `${successfulCount} successful transactions`,
      icon: CreditCard,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Paid Invoices",
      value: successfulCount,
      description: "Consultations billed via Stripe",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Total Refunded",
      value: `$${totalRefundedAmount.toFixed(2)} USD`,
      description: `${completedRefunds} refunds completed`,
      icon: RotateCcw,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Pending Refunds",
      value: pendingRefunds,
      description: "In processing with Stripe",
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.title} className="shadow-xs min-w-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 gap-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                {c.title}
              </CardTitle>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${c.bg} ${c.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                {c.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {c.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default PaymentStatsSummary;
