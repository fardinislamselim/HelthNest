import type { Metadata } from "next";
import { PatientDashboardShell } from "@/components/layout/patient-dashboard-shell";

export const metadata: Metadata = {
  title: "Patient Portal | HealthNest",
  description: "Manage your consultations, prescriptions, and health records",
};

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PatientDashboardShell>{children}</PatientDashboardShell>;
}
