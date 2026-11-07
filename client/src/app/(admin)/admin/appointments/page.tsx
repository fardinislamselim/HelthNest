import type { Metadata } from "next";
import { AdminAppointmentsView } from "@/features/admin/appointments/components/AdminAppointmentsView";

export const metadata: Metadata = {
  title: "Platform Consultations & Appointments | HealthNest Admin",
  description: "Administrative oversight of platform-wide bookings, consultation fulfillment, and schedule states.",
};

export default function AdminAppointmentsPage() {
  return <AdminAppointmentsView />;
}
