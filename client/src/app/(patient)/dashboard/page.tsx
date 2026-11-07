import type { Metadata } from "next";
import { PatientDashboardView } from "@/features/patient/dashboard/components/PatientDashboardView";

export const metadata: Metadata = {
  title: "Dashboard Overview | HealthNest",
  description: "View your upcoming consultations, prescription records, and healthcare statistics",
};

export default function PatientDashboardPage() {
  return <PatientDashboardView />;
}
