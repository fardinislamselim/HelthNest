import type { Metadata } from "next";
import { DoctorAnalyticsView } from "@/features/doctor/analytics/components/DoctorAnalyticsView";

export const metadata: Metadata = {
  title: "Practitioner Analytics | HealthNest",
  description: "Consultation volumes, schedule slot utilization, and completion ratios",
};

export default function DoctorAnalyticsPage() {
  return <DoctorAnalyticsView />;
}
