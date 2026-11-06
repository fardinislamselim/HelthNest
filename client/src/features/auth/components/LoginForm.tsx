"use client";

import * as React from "react";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import type { CredentialResponse } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorState } from "@/components/shared/ErrorState";
import { AuthCardWrapper } from "./AuthCardWrapper";
import { SocialAuthButtons } from "./SocialAuthButtons";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, type LoginFormValues } from "../validations/auth.validation";
import { getApiErrorMessage } from "@/lib/api/errors";

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const { login, isLoggingIn, googleLogin, isGoogleLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login(values);
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err));
    }
  };

  const handleGoogleSignIn = async (credentialResponse: CredentialResponse) => {
    setServerError(null);
    if (!credentialResponse.credential) {
      setServerError("Google sign-in did not return a valid credential.");
      return;
    }

    try {
      await googleLogin(credentialResponse.credential);
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err));
    }
  };

  const handleGoogleError = () => {
    setServerError("Google sign-in was cancelled or could not be completed.");
  };

  const footerContent = (
    <>
      <div>
        Don&apos;t have an account?{" "}
        <NextLink
          href="/register"
          className="text-primary font-semibold hover:underline"
        >
          Create a patient account
        </NextLink>
      </div>
      <div>
        Are you a medical practitioner?{" "}
        <NextLink
          href="/doctors/apply"
          className="text-primary font-semibold hover:underline"
        >
          Join as a Doctor &rarr;
        </NextLink>
      </div>
    </>
  );

  return (
    <AuthCardWrapper
      title="Sign in to HealthNest"
      description="Enter your email and password to access your healthcare portal"
      icon={<Lock className="h-6 w-6" aria-hidden="true" />}
      footer={footerContent}
    >
      {serverError && (
        <ErrorState
          title="Sign in failed"
          message={serverError}
          className="my-3 text-left p-3"
        />
      )}

      <SocialAuthButtons
        isLoading={isGoogleLoggingIn}
        onGoogleSuccess={handleGoogleSignIn}
        onGoogleError={handleGoogleError}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
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

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <NextLink
              href="/forgot-password"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot password?
            </NextLink>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="pl-9 pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full mt-2"
          disabled={isLoggingIn || isGoogleLoggingIn}
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </AuthCardWrapper>
  );
}

export default LoginForm;
