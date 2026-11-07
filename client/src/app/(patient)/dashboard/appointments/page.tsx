import type { Metadata } from "next";
import { PatientAppointmentsView } from "@/features/patient/appointments/components/PatientAppointmentsView";

export const metadata: Metadata = {
  title: "My Consultations | HealthNest",
  description: "View, filter, and manage your scheduled healthcare consultations",
};

export default function PatientAppointmentsPage() {
  return <PatientAppointmentsView />;
}
