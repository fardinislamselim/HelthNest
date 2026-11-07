import type { Metadata } from "next";
import { DoctorApplicationsView } from "@/features/admin/doctor-applications/components/DoctorApplicationsView";

export const metadata: Metadata = {
  title: "Doctor Applications | HealthNest Admin",
  description: "Review practitioner credentials, licenses, and approve or reject doctor applications.",
};

export default function DoctorApplicationsPage() {
  return <DoctorApplicationsView />;
}
