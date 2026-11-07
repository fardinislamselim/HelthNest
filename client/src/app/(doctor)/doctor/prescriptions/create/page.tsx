import type { Metadata } from "next";
import { CreatePrescriptionView } from "@/features/doctor/prescriptions/components/CreatePrescriptionView";

export const metadata: Metadata = {
  title: "Create Prescription | HealthNest Practitioner",
  description: "Issue a new digital medical prescription for a completed patient consultation",
};

export default function CreatePrescriptionPage() {
  return <CreatePrescriptionView />;
}
