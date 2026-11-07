import type { Metadata } from "next";
import { DoctorAppointmentsView } from "@/features/doctor/appointments/components/DoctorAppointmentsView";

export const metadata: Metadata = {
  title: "Patient Consultations | HealthNest Practitioner",
  description: "View booked consultations, launch telehealth video visits, and complete sessions",
};

export default function DoctorAppointmentsPage() {
  return <DoctorAppointmentsView />;
}
