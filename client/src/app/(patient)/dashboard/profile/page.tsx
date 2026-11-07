import type { Metadata } from "next";
import { PatientProfileView } from "@/features/patient/profile/components/PatientProfileView";

export const metadata: Metadata = {
  title: "Patient Profile | HealthNest",
  description: "Manage your contact details, residential address, and profile photo",
};

export default function PatientProfilePage() {
  return <PatientProfileView />;
}
