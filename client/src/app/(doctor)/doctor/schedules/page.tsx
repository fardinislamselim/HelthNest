import type { Metadata } from "next";
import { DoctorSchedulesView } from "@/features/doctor/schedules/components/DoctorSchedulesView";

export const metadata: Metadata = {
  title: "My Schedules | HealthNest Practitioner",
  description: "Consultation schedule management, publishing, and 20-minute patient booking slots",
};

export default function DoctorSchedulesPage() {
  return <DoctorSchedulesView />;
}
