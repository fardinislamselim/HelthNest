import type { Metadata } from "next";
import { DoctorDashboardView } from "@/features/doctor-dashboard/components/DoctorDashboardView";

export const metadata: Metadata = {
  title: "Doctor Dashboard | HealthNest",
  description: "Practitioner consultations, today's schedule, and patient appointments",
};

export default function DoctorDashboardPage() {
  return <DoctorDashboardView />;
}
