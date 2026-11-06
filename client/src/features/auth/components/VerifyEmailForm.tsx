"use client";

import * as React from "react";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, Mail, MailCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorState } from "@/components/shared/ErrorState";
import { AuthCardWrapper } from "./AuthCardWrapper";
import { useAuth } from "../hooks/useAuth";
import {
  verifyEmailSchema,
  type VerifyEmailFormValues,
} from "../validations/auth.validation";
import { getApiErrorMessage } from "@/lib/api/errors";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const typeParam =
    (searchParams.get("type") as "patient" | "doctor" | null) || "patient";

  const [serverError, setServerError] = React.useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = React.useState<number>(0);

  const { verifyEmail, isVerifyingEmail, resendOtp, isResendingOtp } = useAuth();

  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: emailParam,
      otp: "",
    },
  });

  React.useEffect(() => {
    if (emailParam) {
      setValue("email", emailParam);
    }
  }, [emailParam, setValue]);

  const onSubmit = async (values: VerifyEmailFormValues) => {
    setServerError(null);
    try {
      await verifyEmail({
        email: values.email,
        otp: values.otp,
        type: typeParam,
      });
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err));
    }
  };

  const handleResendOtp = async () => {
    const targetEmail = getValues("email") || emailParam;
    if (resendCooldown > 0) return;
    if (!targetEmail) {
      setServerError("Please provide an email address to resend the code.");
      return;
    }
    setServerError(null);
    try {
      await resendOtp({
        email: targetEmail,
        type: typeParam,
      });
      setResendCooldown(60);
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err));
    }
  };

  const footerContent = (
    <NextLink href="/login" className="text-primary font-semibold hover:underline">
      &larr; Back to Sign In
    </NextLink>
  );

  return (
    <AuthCardWrapper
      title="Verify your email"
      description="Enter the 6-digit verification code sent to your email address"
      icon={<MailCheck className="h-6 w-6" aria-hidden="true" />}
      footer={footerContent}
    >
      {serverError && (
        <ErrorState
          title="Verification failed"
          message={serverError}
          className="my-3 text-left p-3"
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        {/* Email Address */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              className="pl-9"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* 6-Digit OTP */}
        <div className="space-y-1.5">
          <Label htmlFor="otp">6-Digit Verification Code</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="otp"
              type="text"
              maxLength={6}
              autoComplete="one-time-code"
              placeholder="123456"
              className="pl-9 tracking-widest font-mono text-center text-lg"
              {...register("otp")}
            />
          </div>
          {errors.otp && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.otp.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full mt-2"
          disabled={isVerifyingEmail}
        >
          {isVerifyingEmail ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying code...
            </>
          ) : (
            "Confirm & Verify Email"
          )}
        </Button>
      </form>

      {/* Resend section */}
      <div className="mt-6 flex flex-col items-center justify-center text-xs text-muted-foreground space-y-2">
        <span>Didn&apos;t receive the code?</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleResendOtp}
          disabled={resendCooldown > 0 || isResendingOtp}
          className="gap-1.5 text-xs font-medium"
        >
          {isResendingOtp ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RotateCcw className="h-3.5 w-3.5" />
          )}
          {resendCooldown > 0
            ? `Resend code in ${resendCooldown}s`
            : "Resend verification code"}
        </Button>
      </div>
    </AuthCardWrapper>
  );
}

export default VerifyEmailForm;

