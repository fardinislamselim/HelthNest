"use client";

import * as React from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDoctorDashboard } from "../hooks/useDoctorDashboard";
import {
  DoctorDashboardHeader,
  DoctorDashboardStats,
  DoctorQuickActions,
  DoctorTodayScheduleCard,
  DoctorUpcomingAppointmentsCard,
  DoctorRecentPrescriptionsCard,
} from "./index";
import { ErrorState } from "@/components/shared/ErrorState";

export function DoctorDashboardView() {
  const { user } = useAuth();
  const { dashboardData, isLoading, isError, error, refetch } = useDoctorDashboard();

  if (isError) {
    return (
      <div className="space-y-6">
        <DoctorDashboardHeader
          doctorName={user?.name || "Practitioner"}
          specialization={user?.doctor?.specialization}
        />
        <ErrorState
          title="Failed to load practitioner dashboard"
          message={error?.message || "Could not retrieve doctor metrics from the server."}
          onRetry={() => refetch()}
          className="my-8"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DoctorDashboardHeader
        doctorName={user?.name || "Practitioner"}
        specialization={user?.doctor?.specialization}
      />

      <DoctorDashboardStats
        appointments={dashboardData?.appointments}
        schedules={dashboardData?.schedules}
        totalPrescriptions={dashboardData?.prescriptions.total}
        totalPatients={dashboardData?.patients.totalUnique}
        isLoading={isLoading}
      />

      <DoctorQuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DoctorTodayScheduleCard
          schedules={dashboardData?.schedules}
          isLoading={isLoading}
        />
        <DoctorUpcomingAppointmentsCard
          upcomingAppointments={dashboardData?.recent.upcomingAppointments ?? []}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DoctorRecentPrescriptionsCard
          recentPrescriptions={dashboardData?.prescriptions.recent ?? []}
          totalPrescriptions={dashboardData?.prescriptions.total ?? 0}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default DoctorDashboardView;
