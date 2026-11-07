"use client";

import * as React from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAdminDashboard, useSuperAdminDashboard } from "../../hooks/useAdmin";
import { isSuperAdmin } from "../../utils/permissions";
import { AdminDashboardStats } from "./AdminDashboardStats";
import { SuperAdminDashboardStats } from "./SuperAdminDashboardStats";
import { RecentPlatformActivities } from "./RecentPlatformActivities";
import { AdminQuickActions } from "./AdminQuickActions";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShieldCheck, ShieldAlert } from "lucide-react";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import type { AdminDashboardData, SuperAdminDashboardData } from "../../types/admin.types";

export function AdminDashboardView() {
  const { user } = useAuth();
  const superAdminRole = isSuperAdmin(user);

  const adminQuery = useAdminDashboard();
  const superAdminQuery = useSuperAdminDashboard();

  const currentQuery = superAdminRole ? superAdminQuery : adminQuery;
  const { data, isLoading, isError, error, refetch, isFetching } = currentQuery;

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={superAdminRole ? "Super Administration Portal" : "Administration Overview"}
          description="Platform metrics, user governance, and administrative oversight"
        />
        <ErrorState
          title="Could not load platform metrics"
          message={error instanceof Error ? error.message : "An error occurred while fetching dashboard data."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {superAdminRole ? "Super Admin Command Center" : "Administration Portal"}
            </h1>
            {superAdminRole ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
                <ShieldCheck className="h-3.5 w-3.5" /> Super Admin
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <ShieldAlert className="h-3.5 w-3.5" /> Administrator
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, {user?.name || "Administrator"}. Here is what is happening across HealthNest today.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2 shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          <span>Refresh Metrics</span>
        </Button>
      </div>

      {/* Stats Cards */}
      {superAdminRole ? (
        <SuperAdminDashboardStats
          data={data as SuperAdminDashboardData}
          isLoading={isLoading}
        />
      ) : (
        <AdminDashboardStats
          data={data as AdminDashboardData}
          isLoading={isLoading}
        />
      )}

      {/* Quick Actions */}
      <AdminQuickActions isSuperAdmin={superAdminRole} />

      {/* Live Recent Activities */}
      <RecentPlatformActivities
        doctorApplications={data?.recent?.doctorApplications}
        appointments={data?.recent?.appointments}
        payments={data?.recent?.payments}
        refunds={data?.recent?.refunds}
        users={(data as SuperAdminDashboardData)?.recent?.users}
        isSuperAdmin={superAdminRole}
      />
    </div>
  );
}

export default AdminDashboardView;
