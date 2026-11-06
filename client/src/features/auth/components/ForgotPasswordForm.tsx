"use client";

import * as React from "react";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorState } from "@/components/shared/ErrorState";
import { AuthCardWrapper } from "./AuthCardWrapper";
import { useAuth } from "../hooks/useAuth";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../validations/auth.validation";
import { getApiErrorMessage } from "@/lib/api/errors";

export function ForgotPasswordForm() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const { forgotPassword, isRequestingForgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError(null);
    try {
      await forgotPassword(values);
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err));
    }
  };

  const footerContent = (
    <div>
      Remember your password?{" "}
      <NextLink
        href="/login"
        className="text-primary font-semibold hover:underline"
      >
        Back to Sign In
      </NextLink>
    </div>
  );

  return (
    <AuthCardWrapper
      title="Forgot your password?"
      description="Enter your registered email address to receive a 6-digit password reset code"
      icon={<KeyRound className="h-6 w-6" aria-hidden="true" />}
      footer={footerContent}
    >
      {serverError && (
        <ErrorState
          title="Request failed"
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

        {/* Submit */}
        <Button
          type="submit"
          className="w-full mt-2"
          disabled={isRequestingForgotPassword}
        >
          {isRequestingForgotPassword ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending reset code...
            </>
          ) : (
            "Send Reset Code"
          )}
        </Button>
      </form>
    </AuthCardWrapper>
  );
}

export default ForgotPasswordForm;
