"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  X,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { RecentPayment, RecentRefund } from "../../types/admin.types";

interface PaymentDetailsModalProps {
  item: RecentPayment | RecentRefund | null;
  type: "payment" | "refund";
  open: boolean;
  onClose: () => void;
}

export function PaymentDetailsModal({
  item,
  type,
  open,
  onClose,
}: PaymentDetailsModalProps) {
  React.useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !item) return null;

  const isPayment = type === "payment";
  const paymentItem = isPayment ? (item as RecentPayment) : null;
  const refundItem = !isPayment ? (item as RecentRefund) : null;

  const formatDateSafe = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? "N/A" : format(d, "MMMM d, yyyy · h:mm a");
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-card p-4 sm:p-6 shadow-xl transition-all">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground hover:bg-muted focus:outline-hidden"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-border/60">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              isPayment
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-rose-500/10 text-rose-600"
            }`}
          >
            {isPayment ? <CreditCard className="h-6 w-6" /> : <DollarSign className="h-6 w-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight">
                {isPayment ? "Stripe Payment Audit" : "Refund Transaction Audit"}
              </h2>
              <StatusBadge status={item.status} />
            </div>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">
              Ref ID: {item.id}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 pt-4 text-xs">
          {/* Amount Box */}
          <div className="rounded-lg bg-muted/40 p-4 text-center">
            <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
              {isPayment ? "Processed Billing Amount" : "Refunded Capital"}
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
              ${item.amount.toFixed(2)}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                {item.currency.toUpperCase()}
              </span>
            </p>
          </div>

          {/* Details */}
          <div className="rounded-lg border border-border p-3.5 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <div>
                <span>Patient / Payer:</span>
                <p className="font-medium text-foreground">
                  {isPayment
                    ? paymentItem?.appointment?.patient?.name || "Patient Account"
                    : refundItem?.patient?.name || "Patient Account"}
                </p>
              </div>

              {isPayment && paymentItem?.appointment?.doctor?.name && (
                <div>
                  <span>Attending Practitioner:</span>
                  <p className="font-medium text-foreground">
                    Dr. {paymentItem.appointment.doctor.name}
                  </p>
                </div>
              )}

              <div>
                <span>Transaction Status:</span>
                <p className="font-medium text-foreground">{item.status}</p>
              </div>

              <div>
                <span>Timestamp:</span>
                <p className="text-foreground">{formatDateSafe(item.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 mt-6 border-t border-border/60">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Audit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetailsModal;
