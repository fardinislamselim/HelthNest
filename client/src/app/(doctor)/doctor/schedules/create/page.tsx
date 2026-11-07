import type { Metadata } from "next";
import { CreateScheduleView } from "@/features/doctor/schedules/components/CreateScheduleView";

export const metadata: Metadata = {
  title: "Create Schedule | HealthNest Practitioner",
  description: "Draft a new consultation schedule with automated 20-minute patient slots",
};

export default function CreateSchedulePage() {
  return <CreateScheduleView />;
}
