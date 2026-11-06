"use client";

import * as React from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  AdminDashboardHeader,
  AdminDashboardStats,
  PendingDoctorApprovalsCard,
  AdminQuickActions,
} from "@/features/admin-dashboard/components";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <AdminDashboardHeader
        adminName={user?.name || "Administrator"}
        role={user?.role || "ADMIN"}
      />
      <AdminDashboardStats />
      <AdminQuickActions />
      <PendingDoctorApprovalsCard />
    </div>
  );
}
