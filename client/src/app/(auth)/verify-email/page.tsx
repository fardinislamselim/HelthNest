import * as React from "react";
import type { Metadata } from "next";
import { VerifyEmailForm } from "@/features/auth/components/VerifyEmailForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export const metadata: Metadata = {
  title: "Verify Email | HealthNest",
  description: "Verify your email address to activate your HealthNest account",
};

export default function VerifyEmailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner label="Loading verification..." />
        </div>
      }
    >
      <VerifyEmailForm />
    </React.Suspense>
  );
}
