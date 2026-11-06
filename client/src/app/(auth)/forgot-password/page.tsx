import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | HealthNest",
  description: "Request a password reset code for your HealthNest account",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
