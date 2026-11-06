import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | HealthNest",
  description: "Sign in to your HealthNest healthcare consultation portal",
};

export default function LoginPage() {
  return <LoginForm />;
}
