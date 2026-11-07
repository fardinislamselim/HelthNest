import type { Metadata } from "next";
import { PatientSchedulesView } from "@/features/patient/schedules/components/PatientSchedulesView";

export const metadata: Metadata = {
  title: "Book Doctor Consultation | HealthNest",
  description: "Browse certified practitioners with open schedules and select a 20-minute appointment slot",
};

export default function PatientSchedulesPage() {
  return <PatientSchedulesView />;
}
