"use client";

import * as React from "react";
import { CreditCard, RotateCcw } from "lucide-react";
import { usePaymentHistory } from "@/features/patient/payments/hooks/usePaymentHistory";
import {
  PaymentStatsSummary,
  PaymentHistoryTable,
  RefundHistoryTable,
} from "./index";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";

export function PatientPaymentsView() {
  const [activeTab, setActiveTab] = React.useState<"invoices" | "refunds">("invoices");
  const {
    refunds,
    paidAppointments,
    financialStats,
    isLoading,
    isError,
    error,
    refetchAll,
  } = usePaymentHistory();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Refund History"
        description="Review consultation payments, Stripe transaction receipts, and cancellation refund records"
      />

      <PaymentStatsSummary
        totalAmount={financialStats.totalAmount}
        successfulCount={financialStats.successfulCount}
        totalRefundedAmount={financialStats.totalRefundedAmount}
        completedRefunds={financialStats.completedRefunds}
        pendingRefunds={financialStats.pendingRefunds}
        isLoading={isLoading}
      />

      {isError ? (
        <ErrorState
          title="Failed to load billing history"
          message={error?.message || "Could not retrieve payment or refund records."}
          onRetry={refetchAll}
          className="my-8"
        />
      ) : (
        <div className="space-y-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-border/80 pb-2">
            <Button
              variant={activeTab === "invoices" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("invoices")}
              className="gap-2 text-xs"
            >
              <CreditCard className="h-4 w-4" />
              Invoices & Payments ({paidAppointments.length})
            </Button>
            <Button
              variant={activeTab === "refunds" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("refunds")}
              className="gap-2 text-xs"
            >
              <RotateCcw className="h-4 w-4" />
              Cancellation Refunds ({refunds.length})
            </Button>
          </div>

          {activeTab === "invoices" ? (
            <PaymentHistoryTable
              appointments={paidAppointments}
              isLoading={isLoading}
            />
          ) : (
            <RefundHistoryTable
              refunds={refunds}
              isLoading={isLoading}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default PatientPaymentsView;
