import type { Metadata } from "next";
import { PatientPaymentsView } from "@/features/patient/payments/components/PatientPaymentsView";

export const metadata: Metadata = {
  title: "Billing & Refund History | HealthNest",
  description: "Review consultation payments, Stripe receipts, and cancellation refund tracking",
};

export default function PatientPaymentsPage() {
  return <PatientPaymentsView />;
}
