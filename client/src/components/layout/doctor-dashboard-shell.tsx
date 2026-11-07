"use client";

import * as React from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function DoctorDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["DOCTOR"]}>
      <div className="flex min-h-screen bg-muted/20 text-foreground">
        <DashboardSidebar role="DOCTOR" />
        <div className="flex flex-1 flex-col min-w-0 overflow-x-hidden">
          <DashboardHeader
            role="DOCTOR"
            userName={user?.name || "Doctor"}
            title="Practitioner Portal"
          />
          <main className="flex-1 min-w-0 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default DoctorDashboardShell;
