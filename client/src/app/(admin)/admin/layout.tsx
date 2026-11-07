import type { Metadata } from "next";
import { AdminDashboardShell } from "@/components/layout/admin-dashboard-shell";

export const metadata: Metadata = {
  title: "Administration Center | HealthNest",
  description: "Platform management, doctor approvals, and administrative controls",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminDashboardShell>{children}</AdminDashboardShell>;
}
