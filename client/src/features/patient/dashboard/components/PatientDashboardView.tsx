"use client";

import * as React from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { usePatientDashboard } from "@/features/patient/dashboard/hooks/usePatientDashboard";
import {
  PatientDashboardHeader,
  PatientDashboardStats,
  UpcomingAppointmentsSection,
  RecentActivitySection,
  RecentPrescriptionsSection,
  RecentRefundsSection,
  PatientQuickActions,
} from "./index";
import { ErrorState } from "@/components/shared/ErrorState";

export function PatientDashboardView() {
  const { user } = useAuth();
  const { dashboardData, isLoading, isError, error, refetch } = usePatientDashboard();

  if (isError) {
    return (
      <div className="space-y-6">
        <PatientDashboardHeader userName={user?.name || "Patient"} />
        <ErrorState
          title="Failed to load dashboard metrics"
          message={error?.message || "Could not retrieve your patient dashboard data from the server."}
          onRetry={() => refetch()}
          className="my-8"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PatientDashboardHeader userName={user?.name || "Patient"} />

      <PatientDashboardStats
        appointments={dashboardData?.appointments}
        payments={dashboardData?.payments}
        refunds={dashboardData?.refunds}
        isLoading={isLoading}
      />

      <PatientQuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingAppointmentsSection
          upcomingAppointments={dashboardData?.recent.upcomingAppointments ?? []}
          isLoading={isLoading}
        />
        <RecentActivitySection
          recentAppointments={dashboardData?.recent.appointments ?? []}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentPrescriptionsSection
          recentPrescriptions={dashboardData?.prescriptions.recent ?? []}
          totalCount={dashboardData?.prescriptions.total ?? 0}
          isLoading={isLoading}
        />
        <RecentRefundsSection
          recentRefunds={dashboardData?.refunds.recent ?? []}
          totalRefundedAmount={dashboardData?.refunds.totalRefundedAmount ?? 0}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default PatientDashboardView;
