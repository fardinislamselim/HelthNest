import type { Metadata } from "next";
import { PatientAppointmentDetailsContainer } from "@/features/patient/appointments/components/PatientAppointmentDetailsContainer";

export const metadata: Metadata = {
  title: "Consultation Details | HealthNest",
  description: "View appointment specifics, Google Meet video link, and medical billing",
};

interface PatientAppointmentDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientAppointmentDetailsPage({
  params,
}: PatientAppointmentDetailsPageProps) {
  const { id } = await params;
  return <PatientAppointmentDetailsContainer appointmentId={id} />;
}
