"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  CreditCard,
  DollarSign,
  RefreshCw,
  Search,
  Eye,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAdminDashboard, useSuperAdminDashboard } from "../../hooks/useAdmin";
import { isSuperAdmin } from "../../utils/permissions";
import { PaymentDetailsModal } from "./PaymentDetailsModal";
import type { RecentPayment, RecentRefund } from "../../types/admin.types";

export function AdminPaymentsView() {
  const { user } = useAuth();
  const superAdminRole = isSuperAdmin(user);

  const adminQuery = useAdminDashboard();
  const superAdminQuery = useSuperAdminDashboard();
  const activeQuery = superAdminRole ? superAdminQuery : adminQuery;

  const { data, isLoading, isFetching, refetch } = activeQuery;

  const [activeTab, setActiveTab] = React.useState<"payments" | "refunds">("payments");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<RecentPayment | RecentRefund | null>(null);
  const [modalType, setModalType] = React.useState<"payment" | "refund">("payment");
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const paymentsMeta = data
    ? "financial" in data
      ? {
          successfulCount: data.financial.successfulCount,
          totalAmount: data.financial.totalAmount,
        }
      : data.payments
    : { successfulCount: 0, totalAmount: 0 };

  const refundsMeta = data
    ? "financial" in data
      ? {
          total:
            (data.financial.completedRefunds || 0) +
            (data.financial.pendingRefunds || 0) +
            (data.financial.failedRefunds || 0),
          completed: data.financial.completedRefunds,
          pending: data.financial.pendingRefunds,
          failed: data.financial.failedRefunds,
          totalRefundedAmount: data.financial.totalRefundedAmount,
        }
      : data.refunds
    : {
        total: 0,
        completed: 0,
        pending: 0,
        failed: 0,
        totalRefundedAmount: 0,
      };

  const netAmount = data && "financial" in data
    ? data.financial.netCollectedAmount
    : paymentsMeta.totalAmount - refundsMeta.totalRefundedAmount;

  const filteredPayments = React.useMemo(() => {
    let list: RecentPayment[] = data?.recent?.payments || [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          (p.appointment?.patient?.name && p.appointment.patient.name.toLowerCase().includes(q)) ||
          (p.appointment?.doctor?.name && p.appointment.doctor.name.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [data?.recent?.payments, searchQuery]);

  const filteredRefunds = React.useMemo(() => {
    let list: RecentRefund[] = data?.recent?.refunds || [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          (r.patient?.name && r.patient.name.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [data?.recent?.refunds, searchQuery]);

  const formatDateSafe = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? "N/A" : format(d, "MMM d, yyyy");
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Payments & Refunds Financial Audit
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Reconcile Stripe billing transactions, process refunds, and track platform net revenue.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2 self-start sm:self-auto shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh Financials
        </Button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="shadow-xs p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Gross Collected</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground mt-2">
            ${paymentsMeta.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {paymentsMeta.successfulCount} successful Stripe payments
          </p>
        </Card>

        <Card className="shadow-xs p-4 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Refunded</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground mt-2">
            ${refundsMeta.totalRefundedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {refundsMeta.completed} refunds completed · {refundsMeta.pending} pending
          </p>
        </Card>

        <Card className="shadow-xs p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Net Platform Capital</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground mt-2">
            ${netAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Gross revenue minus completed refunds
          </p>
        </Card>

        <Card className="shadow-xs p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Pending Refund Claims</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <RefreshCw className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground mt-2">
            {refundsMeta.pending}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Refunds awaiting gateway processing
          </p>
        </Card>
      </div>

      {/* Tabs and Search */}
      <Card className="shadow-xs">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transaction by ID, patient, or doctor name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs sm:text-sm"
              />
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-lg text-xs self-start md:self-auto">
              <Button
                size="sm"
                variant={activeTab === "payments" ? "default" : "ghost"}
                className="h-7 text-xs px-3 rounded-md"
                onClick={() => setActiveTab("payments")}
              >
                Payments ({filteredPayments.length})
              </Button>
              <Button
                size="sm"
                variant={activeTab === "refunds" ? "default" : "ghost"}
                className="h-7 text-xs px-3 rounded-md"
                onClick={() => setActiveTab("refunds")}
              >
                Refunds ({filteredRefunds.length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Table Card */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            {activeTab === "payments" ? "Stripe Payment Feed" : "Refund Transaction Log"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          {isLoading ? (
            <div className="space-y-3 p-4 sm:p-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : activeTab === "payments" ? (
            filteredPayments.length === 0 ? (
              <div className="py-12">
                <EmptyState
                  icon={CreditCard}
                  title="No payment records found"
                  description="Stripe payments will appear here as consultations are confirmed."
                />
              </div>
            ) : (
              <>
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                      <tr>
                        <th className="p-3 font-semibold">Transaction ID</th>
                        <th className="p-3 font-semibold">Patient</th>
                        <th className="p-3 font-semibold">Doctor</th>
                        <th className="p-3 font-semibold">Amount</th>
                        <th className="p-3 font-semibold">Status</th>
                        <th className="p-3 font-semibold">Date</th>
                        <th className="p-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3 font-mono text-xs text-muted-foreground">
                            {p.id.slice(0, 8)}...
                          </td>
                          <td className="p-3 font-medium text-foreground">
                            {p.appointment?.patient?.name || "Patient Account"}
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {p.appointment?.doctor?.name ? `Dr. ${p.appointment.doctor.name}` : "Practitioner"}
                          </td>
                          <td className="p-3 font-semibold text-foreground">
                            ${p.amount.toFixed(2)} {p.currency.toUpperCase()}
                          </td>
                          <td className="p-3">
                            <StatusBadge status={p.status} />
                          </td>
                          <td className="p-3 text-muted-foreground">{formatDateSafe(p.createdAt)}</td>
                          <td className="p-3 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2 text-xs"
                              onClick={() => {
                                setSelectedItem(p);
                                setModalType("payment");
                                setIsModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" /> Audit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden divide-y divide-border">
                  {filteredPayments.map((p) => (
                    <div key={p.id} className="p-4 space-y-2.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-sm">
                            ${p.amount.toFixed(2)} {p.currency.toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {p.appointment?.patient?.name || "Patient"} · {p.appointment?.doctor?.name ? `Dr. ${p.appointment.doctor.name}` : "Doctor"}
                          </p>
                        </div>
                        <StatusBadge status={p.status} />
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDateSafe(p.createdAt)}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => {
                            setSelectedItem(p);
                            setModalType("payment");
                            setIsModalOpen(true);
                          }}
                        >
                          Audit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : (
            filteredRefunds.length === 0 ? (
              <div className="py-12">
                <EmptyState
                  icon={DollarSign}
                  title="No refund records"
                  description="Refund logs will appear here when patient appointment cancellations trigger refunds."
                />
              </div>
            ) : (
              <>
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                      <tr>
                        <th className="p-3 font-semibold">Refund ID</th>
                        <th className="p-3 font-semibold">Beneficiary Patient</th>
                        <th className="p-3 font-semibold">Refunded Amount</th>
                        <th className="p-3 font-semibold">Status</th>
                        <th className="p-3 font-semibold">Processed Date</th>
                        <th className="p-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredRefunds.map((r) => (
                        <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3 font-mono text-xs text-muted-foreground">
                            {r.id.slice(0, 8)}...
                          </td>
                          <td className="p-3 font-medium text-foreground">
                            {r.patient?.name || "Patient Account"}
                          </td>
                          <td className="p-3 font-semibold text-rose-600 dark:text-rose-400">
                            ${r.amount.toFixed(2)} {r.currency.toUpperCase()}
                          </td>
                          <td className="p-3">
                            <StatusBadge status={r.status} />
                          </td>
                          <td className="p-3 text-muted-foreground">{formatDateSafe(r.createdAt)}</td>
                          <td className="p-3 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2 text-xs"
                              onClick={() => {
                                setSelectedItem(r);
                                setModalType("refund");
                                setIsModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" /> Audit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden divide-y divide-border">
                  {filteredRefunds.map((r) => (
                    <div key={r.id} className="p-4 space-y-2.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-sm text-rose-600 dark:text-rose-400">
                            ${r.amount.toFixed(2)} {r.currency.toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {r.patient?.name || "Patient Account"}
                          </p>
                        </div>
                        <StatusBadge status={r.status} />
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDateSafe(r.createdAt)}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => {
                            setSelectedItem(r);
                            setModalType("refund");
                            setIsModalOpen(true);
                          }}
                        >
                          Audit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <PaymentDetailsModal
        item={selectedItem}
        type={modalType}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default AdminPaymentsView;
