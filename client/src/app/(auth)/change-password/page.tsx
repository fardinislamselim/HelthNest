import type { Metadata } from "next";
import { ChangePasswordView } from "@/features/auth/components/ChangePasswordView";

export const metadata: Metadata = {
  title: "Change Password | HealthNest",
  description: "Update your account password and maintain your HealthNest security settings",
};

export default function ChangePasswordPage() {
  return <ChangePasswordView />;
}
