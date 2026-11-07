import type { Metadata } from "next";
import { PatientManagementView } from "@/features/admin/patients/components/PatientManagementView";

export const metadata: Metadata = {
  title: "Patient Accounts & Management | HealthNest Admin",
  description: "Browse registered patients, audit account status, and manage platform permissions.",
};

export default function PatientsPage() {
  return <PatientManagementView />;
}
