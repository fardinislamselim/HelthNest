import type { Metadata } from "next";
import { PatientRegisterForm } from "@/features/auth/components/PatientRegisterForm";

export const metadata: Metadata = {
  title: "Create Patient Account | HealthNest",
  description: "Register as a patient to schedule healthcare consultations on HealthNest",
};

export default function RegisterPage() {
  return <PatientRegisterForm />;
}
