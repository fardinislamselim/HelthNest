import type { Metadata } from "next";
import { AdminDashboardView } from "@/features/admin-dashboard/components/AdminDashboardView";

export const metadata: Metadata = {
  title: "Administration Center | HealthNest",
  description: "Platform management, medical credentials verification, and administrative audit",
};

export default function AdminDashboardPage() {
  return <AdminDashboardView />;
}
