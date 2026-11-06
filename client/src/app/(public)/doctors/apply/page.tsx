import type { Metadata } from "next";
import { DoctorApplyHeader } from "@/features/doctors/components/DoctorApplyHeader";
import { DoctorApplyForm } from "@/features/doctors/components/DoctorApplyForm";

export const metadata: Metadata = {
  title: "Practitioner Application | HealthNest",
  description:
    "Join HealthNest as a medical practitioner to offer online video consultations and publish consultation schedules",
};

export default function DoctorApplyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <DoctorApplyHeader />
      <DoctorApplyForm />
    </div>
  );
}
