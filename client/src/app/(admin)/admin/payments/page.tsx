import type { Metadata } from "next";
import { AdminPaymentsView } from "@/features/admin/payments/components/AdminPaymentsView";

export const metadata: Metadata = {
  title: "Payments & Refunds Financial Audit | HealthNest Admin",
  description: "Platform billing reconciliations, Stripe payment audit, and patient refund processing.",
};

export default function AdminPaymentsPage() {
  return <AdminPaymentsView />;
}
