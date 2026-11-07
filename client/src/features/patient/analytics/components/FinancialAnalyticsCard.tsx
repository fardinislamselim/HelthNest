"use client";

import * as React from "react";
import { DollarSign, RotateCcw, Wallet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface FinancialAnalyticsCardProps {
  totalPaid: number;
  totalRefunded: number;
}

export function FinancialAnalyticsCard({
  totalPaid,
  totalRefunded,
}: FinancialAnalyticsCardProps) {
  const netSpending = Math.max(0, totalPaid - totalRefunded);
  const refundRatio = totalPaid > 0 ? Math.round((totalRefunded / totalPaid) * 100) : 0;
  const netRatio = totalPaid > 0 ? Math.max(0, 100 - refundRatio) : 100;

  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Wallet className="h-4 w-4 text-primary" />
          Financial & Refund Ratio
        </CardTitle>
        <CardDescription className="text-xs">
          Comparison between net consultation fees and recovered refunds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Net Spending Summary */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Net Healthcare Expense
            </span>
            <p className="text-xl sm:text-2xl font-black text-primary mt-0.5">
              ${netSpending.toFixed(2)} USD
            </p>
          </div>
          <div className="sm:text-right">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Refund Recovery
            </span>
            <p className="text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 mt-0.5">
              {refundRatio}% of gross
            </p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded-full bg-muted/60 overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${netRatio}%` }}
              className="bg-primary transition-all duration-500"
              title={`Net Spent: ${netRatio}%`}
            />
            <div
              style={{ width: `${refundRatio}%` }}
              className="bg-purple-500 transition-all duration-500"
              title={`Refunded: ${refundRatio}%`}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-muted-foreground pt-0.5">
            <span className="flex items-center gap-1.5 truncate">
              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
              Net Paid (${netSpending.toFixed(2)})
            </span>
            <span className="flex items-center gap-1.5 truncate">
              <span className="h-2 w-2 rounded-full bg-purple-500 shrink-0" />
              Recovered Refund (${totalRefunded.toFixed(2)})
            </span>
          </div>
        </div>

        {/* Metric tiles */}
        <div className="grid grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 rounded-lg border border-border/60 bg-card space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-primary" />
              Gross Paid
            </span>
            <p className="text-base font-bold text-foreground">
              ${totalPaid.toFixed(2)}
            </p>
          </div>
          <div className="p-3 rounded-lg border border-border/60 bg-card space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <RotateCcw className="h-3.5 w-3.5 text-purple-600" />
              Total Returned
            </span>
            <p className="text-base font-bold text-purple-600 dark:text-purple-400">
              ${totalRefunded.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default FinancialAnalyticsCard;
