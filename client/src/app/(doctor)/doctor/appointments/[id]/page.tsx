import type { Metadata } from "next";
import { DoctorAppointmentDetailsContainer } from "@/features/doctor/appointments/components/DoctorAppointmentDetailsContainer";

export const metadata: Metadata = {
  title: "Consultation Session | HealthNest Practitioner",
  description: "Conduct clinical consultation, video room, and manage session lifecycle",
};

interface DoctorAppointmentDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function DoctorAppointmentDetailsPage({
  params,
}: DoctorAppointmentDetailsPageProps) {
  const { id } = await params;
  return <DoctorAppointmentDetailsContainer appointmentId={id} />;
}
