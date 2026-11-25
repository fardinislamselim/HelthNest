import type { Metadata } from "next";
import { Suspense } from "react";
import { PublicDoctorProfileView } from "@/features/public-doctors";

interface PublicDoctorProfilePageProps {
  params: Promise<{ doctorId: string }>;
}

export async function generateMetadata({
  params,
}: PublicDoctorProfilePageProps): Promise<Metadata> {
  const { doctorId } = await params;
  return {
    title: `Practitioner Profile | HealthNest`,
    description: `View credentials, experience, and consultation fee for doctor ${doctorId}`,
  };
}

export default async function PublicDoctorProfilePage({
  params,
}: PublicDoctorProfilePageProps) {
  const { doctorId } = await params;
  let decodedId = (doctorId || "").trim();
  try {
    decodedId = decodeURIComponent(decodedId).trim();
  } catch {
    // Keep raw id
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PublicDoctorProfileView doctorId={decodedId} />
    </Suspense>
  );
}