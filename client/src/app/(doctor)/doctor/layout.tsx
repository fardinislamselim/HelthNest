import type { Metadata } from "next";
import { DoctorDashboardShell } from "@/components/layout/doctor-dashboard-shell";

export const metadata: Metadata = {
  title: "Practitioner Portal | HealthNest",
  description: "Doctor schedules, appointments, and medical consultations",
};

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DoctorDashboardShell>{children}</DoctorDashboardShell>;
}
