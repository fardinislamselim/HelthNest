import type { Metadata } from "next";
import { DoctorPrescriptionsView } from "@/features/doctor/prescriptions/components/DoctorPrescriptionsView";

export const metadata: Metadata = {
  title: "Prescriptions | HealthNest Practitioner",
  description: "View issued pharmaceutical prescriptions and download digital PDF records",
};

export default function DoctorPrescriptionsPage() {
  return <DoctorPrescriptionsView />;
}
