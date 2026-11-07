"use client";

import * as React from "react";
import {
  Users,
  Calendar,
  CreditCard,
  FileCheck,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAdminDashboard, useSuperAdminDashboard } from "../../hooks/useAdmin";
import { isSuperAdmin } from "../../utils/permissions";
import type { SuperAdminDashboardData } from "../../types/admin.types";

export function AdminPlatformAnalyticsView() {
  const { user } = useAuth();
  const superAdminRole = isSuperAdmin(user);

  const adminQuery = useAdminDashboard();
  const superAdminQuery = useSuperAdminDashboard();
  const activeQuery = superAdminRole ? superAdminQuery : adminQuery;

  const { data, isLoading, isFetching, refetch } = activeQuery;

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const { users, doctorApplications, appointments } = data;
  const payments =
    "financial" in data
      ? {
          successfulCount: data.financial.successfulCount,
          totalAmount: data.financial.totalAmount,
        }
      : data.payments;

  const refunds =
    "financial" in data
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
      : data.refunds;

  const activePatients = "activePatients" in users ? users.activePatients : users.activeUsers;
  const blockedPatients = "blockedPatients" in users ? users.blockedPatients : users.blockedUsers;
  const activeDoctors = "activeDoctors" in users ? users.activeDoctors : (doctorApplications as { activeDoctors?: number }).activeDoctors || 0;
  const blockedDoctors = "blockedDoctors" in users ? users.blockedDoctors : (doctorApplications as { blockedDoctors?: number }).blockedDoctors || 0;

  const superAdminData = superAdminRole ? (data as SuperAdminDashboardData) : null;
  const netRevenue = superAdminData?.financial?.netCollectedAmount ?? (payments.totalAmount - refunds.totalRefundedAmount);

  // Application Ratio Calculation
  const totalApps = doctorApplications.total || 1;
  const approvedPct = Math.round((doctorApplications.approved / totalApps) * 100);
  const pendingPct = Math.round((doctorApplications.pending / totalApps) * 100);
  const rejectedPct = Math.round((doctorApplications.rejected / totalApps) * 100);

  // Appointment Status Ratios
  const totalApts = appointments.total || 1;
  const completedAptPct = Math.round((appointments.completed / totalApts) * 100);
  const bookedAptPct = Math.round((appointments.booked / totalApts) * 100);
  const cancelledAptPct = Math.round((appointments.cancelled / totalApts) * 100);

  // Financial Retention Ratio
  const gross = payments.totalAmount || 1;
  const refundRate = Math.min(100, Math.round((refunds.totalRefundedAmount / gross) * 100));
  const retentionRate = Math.max(0, 100 - refundRate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Platform Analytics & Intelligence
            </h1>
            {superAdminRole && (
              <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
                Platform-Wide
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Data insights on registration growth, practitioner credential review rates, appointment fulfillment, and cash retention.
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
          Refresh Analytics
        </Button>
      </div>

      {/* Grid of Analytical Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Practitioner Application Verification Funnel */}
        <Card className="shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-primary" />
              Doctor Application Verification Ratio
            </CardTitle>
            <CardDescription className="text-xs">
              Review status breakdown of medical practitioner applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Visual Multi-segment Bar */}
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
              <div
                style={{ width: `${approvedPct}%` }}
                className="bg-emerald-500 transition-all duration-500"
                title={`Approved: ${approvedPct}%`}
              />
              <div
                style={{ width: `${pendingPct}%` }}
                className="bg-amber-500 transition-all duration-500"
                title={`Pending: ${pendingPct}%`}
              />
              <div
                style={{ width: `${rejectedPct}%` }}
                className="bg-rose-500 transition-all duration-500"
                title={`Rejected: ${rejectedPct}%`}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-center pt-1">
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-700 dark:text-emerald-300">
                <span className="font-semibold block text-sm">{doctorApplications.approved}</span>
                <span>Approved ({approvedPct}%)</span>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-2 text-amber-700 dark:text-amber-300">
                <span className="font-semibold block text-sm">{doctorApplications.pending}</span>
                <span>Pending ({pendingPct}%)</span>
              </div>
              <div className="rounded-lg bg-rose-500/10 p-2 text-rose-700 dark:text-rose-300">
                <span className="font-semibold block text-sm">{doctorApplications.rejected}</span>
                <span>Rejected ({rejectedPct}%)</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground pt-1">
              Total applications evaluated: <strong>{doctorApplications.total}</strong>
            </p>
          </CardContent>
        </Card>

        {/* 2. Appointment Consultation Lifecycle */}
        <Card className="shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              Consultation Lifecycle Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Platform appointment completion vs cancellation metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
              <div
                style={{ width: `${completedAptPct}%` }}
                className="bg-emerald-500 transition-all duration-500"
                title={`Completed: ${completedAptPct}%`}
              />
              <div
                style={{ width: `${bookedAptPct}%` }}
                className="bg-blue-500 transition-all duration-500"
                title={`Upcoming: ${bookedAptPct}%`}
              />
              <div
                style={{ width: `${cancelledAptPct}%` }}
                className="bg-rose-500 transition-all duration-500"
                title={`Cancelled: ${cancelledAptPct}%`}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-center pt-1">
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-700 dark:text-emerald-300">
                <span className="font-semibold block text-sm">{appointments.completed}</span>
                <span>Completed ({completedAptPct}%)</span>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-2 text-blue-700 dark:text-blue-300">
                <span className="font-semibold block text-sm">{appointments.booked}</span>
                <span>Upcoming ({bookedAptPct}%)</span>
              </div>
              <div className="rounded-lg bg-rose-500/10 p-2 text-rose-700 dark:text-rose-300">
                <span className="font-semibold block text-sm">{appointments.cancelled}</span>
                <span>Cancelled ({cancelledAptPct}%)</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground pt-1">
              Active sessions today: <strong>{appointments.today}</strong> · Total all-time: <strong>{appointments.total}</strong>
            </p>
          </CardContent>
        </Card>

        {/* 3. User Demographics & Account Integrity */}
        <Card className="shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Platform Account Demographics
            </CardTitle>
            <CardDescription className="text-xs">
              Registered roles and active vs blocked account distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Patients ({users.totalPatients})</span>
                <span className="font-medium text-emerald-600">
                  {activePatients} active · {blockedPatients} blocked
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
                <div
                  style={{
                    width: `${users.totalPatients ? (activePatients / users.totalPatients) * 100 : 0}%`,
                  }}
                  className="bg-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Doctors ({users.totalDoctors})</span>
                <span className="font-medium text-blue-600">
                  {activeDoctors} active · {blockedDoctors} blocked
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
                <div
                  style={{
                    width: `${users.totalDoctors ? (activeDoctors / users.totalDoctors) * 100 : 0}%`,
                  }}
                  className="bg-blue-500"
                />
              </div>
            </div>

            {superAdminRole && superAdminData && (
              <div className="pt-2 border-t border-border/40 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-muted/40 p-2">
                  <span className="text-muted-foreground">Administrators:</span>
                  <p className="font-bold text-sm">{superAdminData.users.totalAdmins}</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-2">
                  <span className="text-muted-foreground">Super Admins:</span>
                  <p className="font-bold text-sm">{superAdminData.users.totalSuperAdmins}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. Financial Cashflow & Capital Retention */}
        <Card className="shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
              Financial Capital Retention
            </CardTitle>
            <CardDescription className="text-xs">
              Billing collection efficiency and patient refund ratio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Net Retained Volume</span>
                <span className="font-bold text-foreground">
                  ${netRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({retentionRate}%)
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
                <div
                  style={{ width: `${retentionRate}%` }}
                  className="bg-emerald-500 transition-all duration-500"
                  title={`Retained: ${retentionRate}%`}
                />
                <div
                  style={{ width: `${refundRate}%` }}
                  className="bg-rose-500 transition-all duration-500"
                  title={`Refunded: ${refundRate}%`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-border p-2.5">
                <span className="text-muted-foreground">Gross Volume:</span>
                <p className="text-sm font-bold text-foreground">
                  ${payments.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <span className="text-[11px] text-muted-foreground">
                  {payments.successfulCount} paid payments
                </span>
              </div>

              <div className="rounded-lg border border-border p-2.5">
                <span className="text-muted-foreground">Refunds Granted:</span>
                <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
                  ${refunds.totalRefundedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <span className="text-[11px] text-muted-foreground">
                  {refunds.completed} refunds ({refundRate}%)
                </span>
              </div>
            </div>

            {refunds.pending > 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Notice: {refunds.pending} refund claim(s) currently pending review.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminPlatformAnalyticsView;
