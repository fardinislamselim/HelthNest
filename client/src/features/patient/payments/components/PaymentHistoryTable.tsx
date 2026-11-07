"use client";

import * as React from "react";
import Link from "next/link";
import { CreditCard, Eye, Calendar, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { PatientAppointmentItem } from "../../appointments/types/appointment.types";

interface PaymentHistoryTableProps {
  appointments: PatientAppointmentItem[];
  isLoading?: boolean;
}

export function PaymentHistoryTable({
  appointments,
  isLoading = false,
}: PaymentHistoryTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-card border border-border/80 p-4 animate-pulse space-y-2">
            <div className="h-4 w-36 bg-muted rounded" />
            <div className="h-3 w-48 bg-muted/60 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <EmptyState
        title="No billing transactions"
        description="Completed payments and consultation receipts will be recorded here."
        icon={CreditCard}
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
                <th className="py-3 px-4 whitespace-nowrap">Date</th>
                <th className="py-3 px-4 whitespace-nowrap">Doctor & Consultation</th>
                <th className="py-3 px-4 whitespace-nowrap">Invoice #</th>
                <th className="py-3 px-4 whitespace-nowrap">Amount</th>
                <th className="py-3 px-4 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {appointments.map((appt) => {
                const p = appt.payment!;
                return (
                  <tr key={appt.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 text-xs font-medium text-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{appt.schedule.date}</span>
                      </div>
                      <span className="text-muted-foreground text-[11px] block mt-0.5">
                        {appt.slot.startTime} – {appt.slot.endTime}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-foreground flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        Dr. {appt.doctor.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appt.doctor.specialization}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {p.invoiceNumber || `INV-${appt.id.slice(0, 8).toUpperCase()}`}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground whitespace-nowrap">
                      {p.currency} ${Number(p.amount).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Button asChild variant="ghost" size="xs" className="gap-1 text-xs">
                        <Link href={`/dashboard/appointments/${appt.id}`}>
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                      </Button>
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
        {appointments.map((appt) => {
          const p = appt.payment!;
          return (
            <div
              key={appt.id}
              className="p-4 rounded-xl border border-border/80 bg-card space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{appt.schedule.date}</span>
                    <span>•</span>
                    <span>{appt.slot.startTime}</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground truncate mt-1">
                    Dr. {appt.doctor.name}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {appt.doctor.specialization}
                  </p>
                </div>
                <StatusBadge status={p.status} className="shrink-0" />
              </div>

              <div className="flex items-center justify-between text-xs py-2 border-y border-border/60 bg-muted/20 px-2.5 rounded-lg">
                <span className="text-muted-foreground font-mono flex items-center gap-1 truncate">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  {p.invoiceNumber || `INV-${appt.id.slice(0, 8).toUpperCase()}`}
                </span>
                <span className="font-bold text-foreground text-sm shrink-0">
                  ${Number(p.amount).toFixed(2)} {p.currency}
                </span>
              </div>

              <div className="flex justify-end pt-0.5">
                <Button asChild size="sm" variant="outline" className="w-full sm:w-auto text-xs gap-1.5">
                  <Link href={`/dashboard/appointments/${appt.id}`}>
                    <Eye className="h-3.5 w-3.5" />
                    View Appointment Details
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PaymentHistoryTable;
