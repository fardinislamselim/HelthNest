import type { Metadata } from "next";
import { PaymentSuccessView } from "@/features/patient/booking/components/PaymentSuccessView";

export const metadata: Metadata = {
  title: "Payment Confirmed | HealthNest",
  description: "Your consultation appointment payment has been confirmed",
};

export default function PaymentSuccessPage() {
  return <PaymentSuccessView />;
}
