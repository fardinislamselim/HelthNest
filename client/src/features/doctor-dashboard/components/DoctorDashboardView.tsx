"use client";

import * as React from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  DoctorDashboardHeader,
  DoctorDashboardStats,
  DoctorTodayScheduleCard,
  DoctorUpcomingAppointmentsCard,
  DoctorQuickActions,
} from "./index";

export function DoctorDashboardView() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <DoctorDashboardHeader
        doctorName={user?.name || "Practitioner"}
        specialization={user?.doctor?.specialization}
      />
      <DoctorDashboardStats />
      <DoctorQuickActions />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DoctorTodayScheduleCard />
        <DoctorUpcomingAppointmentsCard />
      </div>
    </div>
  );
}

export default DoctorDashboardView;
