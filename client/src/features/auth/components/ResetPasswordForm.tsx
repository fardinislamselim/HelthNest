"use client";

import * as React from "react";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorState } from "@/components/shared/ErrorState";
import { AuthCardWrapper } from "./AuthCardWrapper";
import { useAuth } from "../hooks/useAuth";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../validations/auth.validation";
import { getApiErrorMessage } from "@/lib/api/errors";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = React.useState<number>(0);

  const {
    resetPassword,
    isResettingPassword,
    forgotPassword,
    isRequestingForgotPassword,
  } = useAuth();

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
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailParam,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  React.useEffect(() => {
    if (emailParam) {
      setValue("email", emailParam);
    }
  }, [emailParam, setValue]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setServerError(null);
    try {
      await resetPassword({
        email: values.email,
        otp: values.otp,
        newPassword: values.newPassword,
      });
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err));
    }
  };

  const handleResendCode = async () => {
    const targetEmail = getValues("email") || emailParam;
    if (resendCooldown > 0) return;
    if (!targetEmail) {
      setServerError("Please provide an email address to resend the code.");
      return;
    }
    setServerError(null);
    try {
      await forgotPassword({ email: targetEmail });
      setResendCooldown(60);
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err));
    }
  };

  const footerContent = (
    <NextLink
      href="/login"
      className="text-primary font-semibold hover:underline"
    >
      &larr; Back to Sign In
    </NextLink>
  );

  return (
    <AuthCardWrapper
      title="Reset your password"
      description="Enter the 6-digit verification code and your new account password"
      icon={<ShieldCheck className="h-6 w-6" aria-hidden="true" />}
      footer={footerContent}
    >
      {serverError && (
        <ErrorState
          title="Password reset failed"
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
          <Label htmlFor="otp">6-Digit Reset Code</Label>
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

        {/* New Password */}
        <div className="space-y-1.5">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              className="pl-9 pr-10"
              {...register("newPassword")}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repeat your new password"
              className="pl-9 pr-10"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full mt-2"
          disabled={isResettingPassword}
        >
          {isResettingPassword ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting password...
            </>
          ) : (
            "Set New Password"
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
          onClick={handleResendCode}
          disabled={resendCooldown > 0 || isRequestingForgotPassword}
          className="gap-1.5 text-xs font-medium"
        >
          {isRequestingForgotPassword ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RotateCcw className="h-3.5 w-3.5" />
          )}
          {resendCooldown > 0
            ? `Resend code in ${resendCooldown}s`
            : "Resend reset code"}
        </Button>
      </div>
    </AuthCardWrapper>
  );
}

export default ResetPasswordForm;
