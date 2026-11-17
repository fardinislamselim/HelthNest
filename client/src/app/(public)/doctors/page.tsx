import type { Metadata } from "next";
import { Suspense } from "react";
import { PublicDoctorsView } from "@/features/public-doctors";

export const metadata: Metadata = {
  title: "Find Doctors & Specialists | HealthNest",
  description:
    "Browse board-verified healthcare practitioners, compare clinical experience and consultation fees, and schedule 20-minute video consultations.",
};

export default function FindDoctorsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PublicDoctorsView />
    </Suspense>
  );
}
