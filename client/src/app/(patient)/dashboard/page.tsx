"use client";

import * as React from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  PatientDashboardHeader,
  PatientDashboardStats,
  UpcomingAppointmentsCard,
  RecentPrescriptionsCard,
  PatientQuickActions,
} from "@/features/patient-dashboard/components";

export default function PatientDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PatientDashboardHeader userName={user?.name || "Patient"} />
      <PatientDashboardStats />
      <PatientQuickActions />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingAppointmentsCard />
        <RecentPrescriptionsCard />
      </div>
    </div>
  );
}
