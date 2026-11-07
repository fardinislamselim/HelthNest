import type { Metadata } from "next";
import { PatientAnalyticsView } from "@/features/patient/analytics/components/PatientAnalyticsView";

export const metadata: Metadata = {
  title: "Health & Consultation Analytics | HealthNest",
  description: "Review appointment trends, consultation completion rates, and healthcare financial summaries",
};

export default function PatientAnalyticsPage() {
  return <PatientAnalyticsView />;
}
