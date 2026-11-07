import type { Metadata } from "next";
import { AdminPlatformAnalyticsView } from "@/features/admin/analytics/components/AdminPlatformAnalyticsView";

export const metadata: Metadata = {
  title: "Platform Analytics & Business Intelligence | HealthNest Admin",
  description: "Platform growth statistics, doctor approval ratios, appointment utilization, and financial cashflow metrics.",
};

export default function AdminAnalyticsPage() {
  return <AdminPlatformAnalyticsView />;
}
