"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { DashboardRefundItem } from "../types/dashboard.types";

interface RecentRefundsSectionProps {
  recentRefunds: DashboardRefundItem[];
  totalRefundedAmount: number;
  isLoading?: boolean;
}

export function RecentRefundsSection({
  recentRefunds,
  totalRefundedAmount,
  isLoading = false,
}: RecentRefundsSectionProps) {
  return (
    <Card className="shadow-xs h-full flex flex-col min-w-0">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3">
        <div className="min-w-0">
          <CardTitle className="text-base font-semibold truncate">
            Recent Refunds (${totalRefundedAmount.toFixed(2)})
          </CardTitle>
          <CardDescription className="text-xs">
            Refund tracking for cancelled eligible appointments
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-xs self-start sm:self-auto shrink-0">
          <Link href="/dashboard/payments">
            Payment History <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-muted/60 animate-pulse" />
            ))}
          </div>
        ) : recentRefunds.length === 0 ? (
          <EmptyState
            title="No refund records"
            description="If you cancel a consultation more than 1 hour prior to its start, your refund will appear here."
            icon={RotateCcw}
            className="py-8"
          />
        ) : (
          <div className="space-y-3">
            {recentRefunds.map((ref) => {
              const formattedDate = new Date(ref.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={ref.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 sm:p-3.5 rounded-lg border border-border/70 bg-card hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 mt-0.5">
                      <RotateCcw className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-foreground truncate">
                        Consultation Refund
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        Initiated on {formattedDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <span className="font-bold text-foreground text-xs">
                      +${Number(ref.amount).toFixed(2)} {ref.currency}
                    </span>
                    <StatusBadge status={ref.status} className="text-[10px]" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentRefundsSection;
