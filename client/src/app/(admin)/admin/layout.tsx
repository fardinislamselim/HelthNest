"use client";

import * as React from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { useAuth } from "@/features/auth/hooks/use-auth";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <div className="flex min-h-screen bg-muted/20 text-foreground">
        <DashboardSidebar role={user?.role || "ADMIN"} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader
            role={user?.role || "ADMIN"}
            userName={user?.name || "Administrator"}
            title="Administration Center"
          />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

