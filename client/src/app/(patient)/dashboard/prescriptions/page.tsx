import type { Metadata } from "next";
import { PatientPrescriptionsView } from "@/features/patient/prescriptions/components/PatientPrescriptionsView";

export const metadata: Metadata = {
  title: "Prescriptions & Treatment Records | HealthNest",
  description: "View digital prescriptions and download certified PDF medical documents",
};

export default function PatientPrescriptionsPage() {
  return <PatientPrescriptionsView />;
}
