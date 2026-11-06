import * as React from "react";
import type { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export const metadata: Metadata = {
  title: "Reset Password | HealthNest",
  description: "Set a new password for your HealthNest account using your reset code",
};

export default function ResetPasswordPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner label="Loading reset password..." />
        </div>
      }
    >
      <ResetPasswordForm />
    </React.Suspense>
  );
}
