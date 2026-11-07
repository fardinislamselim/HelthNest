"use client";

import * as React from "react";
import { RotateCcw, Calendar, User, AlertCircle } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { PatientRefundRecord } from "../types/payment.types";

interface RefundHistoryTableProps {
  refunds: PatientRefundRecord[];
  isLoading?: boolean;
}

export function RefundHistoryTable({
  refunds,
  isLoading = false,
}: RefundHistoryTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-card border border-border/80 p-4 animate-pulse space-y-2">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-3 w-48 bg-muted/60 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (refunds.length === 0) {
    return (
      <EmptyState
        title="No refund records"
        description="When you cancel an appointment more than 1 hour prior to consultation, automatic refunds processed through Stripe will appear here."
        icon={RotateCcw}
        className="py-8"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop & Tablet Table View (hidden on mobile < 768px) */}
      <div className="hidden md:block rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Date Initiated</th>
                <th className="py-3 px-4 whitespace-nowrap">Consultation & Doctor</th>
                <th className="py-3 px-4 whitespace-nowrap">Reason</th>
                <th className="py-3 px-4 whitespace-nowrap">Amount</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Refund Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {refunds.map((refund) => {
                const formattedDate = new Date(refund.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <tr key={refund.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 text-xs font-medium text-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{formattedDate}</span>
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground block mt-0.5">
                        ID: {refund.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {refund.appointment?.doctor ? (
                        <div>
                          <p className="font-semibold text-foreground flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            Dr. {refund.appointment.doctor.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Date: {refund.appointment.schedule?.date} ({refund.appointment.schedule?.startTime})
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">Consultation refund</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted-foreground max-w-xs truncate">
                      {refund.reason || "Appointment cancelled by patient"}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground whitespace-nowrap">
                      {refund.currency} ${Number(refund.amount).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <StatusBadge status={refund.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards View (shown on mobile < 768px) */}
      <div className="md:hidden space-y-3">
        {refunds.map((refund) => {
          const formattedDate = new Date(refund.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <div
              key={refund.id}
              className="p-4 rounded-xl border border-border/80 bg-card space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{formattedDate}</span>
                  </div>
                  {refund.appointment?.doctor ? (
                    <div className="mt-1">
                      <h4 className="text-sm font-bold text-foreground truncate">
                        Dr. {refund.appointment.doctor.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Schedule: {refund.appointment.schedule?.date} ({refund.appointment.schedule?.startTime})
                      </p>
                    </div>
                  ) : (
                    <h4 className="text-sm font-bold text-foreground mt-1">
                      Consultation Refund
                    </h4>
                  )}
                </div>
                <StatusBadge status={refund.status} className="shrink-0" />
              </div>

              <div className="flex items-start gap-1.5 text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-lg">
                <AlertCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="line-clamp-2">
                  {refund.reason || "Appointment cancelled by patient"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60">
                <span className="font-mono text-muted-foreground text-[11px]">
                  Ref: #{refund.id.slice(0, 8)}
                </span>
                <span className="font-bold text-foreground text-sm">
                  +${Number(refund.amount).toFixed(2)} {refund.currency}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RefundHistoryTable;
