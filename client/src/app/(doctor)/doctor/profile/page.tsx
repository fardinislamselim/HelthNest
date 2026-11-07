import type { Metadata } from "next";
import { DoctorProfileView } from "@/features/doctor/profile/components/DoctorProfileView";

export const metadata: Metadata = {
  title: "Doctor Profile | HealthNest",
  description: "Practitioner professional credentials, practice details, and contact management",
};

export default function DoctorProfilePage() {
  return <DoctorProfileView />;
}
