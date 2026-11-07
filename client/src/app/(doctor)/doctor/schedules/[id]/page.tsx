import type { Metadata } from "next";
import { DoctorScheduleDetailsContainer } from "@/features/doctor/schedules/components/DoctorScheduleDetailsContainer";

export const metadata: Metadata = {
  title: "Schedule Details | HealthNest Practitioner",
  description: "View discrete 20-minute patient slots, booked status, and video room details",
};

interface DoctorScheduleDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function DoctorScheduleDetailsPage({
  params,
}: DoctorScheduleDetailsPageProps) {
  const { id } = await params;
  return <DoctorScheduleDetailsContainer scheduleId={id} />;
}
