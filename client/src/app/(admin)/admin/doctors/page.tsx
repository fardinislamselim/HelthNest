import type { Metadata } from "next";
import { DoctorManagementView } from "@/features/admin/doctors/components/DoctorManagementView";

export const metadata: Metadata = {
  title: "Doctor Directory & Management | HealthNest Admin",
  description: "Browse registered doctors, inspect practitioner credentials, and manage account statuses.",
};

export default function DoctorsPage() {
  return <DoctorManagementView />;
}
