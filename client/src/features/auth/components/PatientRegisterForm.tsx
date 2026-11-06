"use client";

import * as React from "react";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CredentialResponse } from "@react-oauth/google";
import {
  Eye,
  EyeOff,
  HeartHandshake,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorState } from "@/components/shared/ErrorState";
import { AuthCardWrapper } from "./AuthCardWrapper";
import { SocialAuthButtons } from "./SocialAuthButtons";
import { useAuth } from "../hooks/useAuth";
import {
  registerPatientSchema,
  type RegisterPatientFormValues,
} from "../validations/auth.validation";
import { getApiErrorMessage } from "@/lib/api/errors";

export function PatientRegisterForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const { registerPatient, isRegisteringPatient, googleLogin, isGoogleLoggingIn } =
    useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPatientFormValues>({
    resolver: zodResolver(registerPatientSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      contactNumber: "",
      address: "",
    },
  });

  const onSubmit = async (values: RegisterPatientFormValues) => {
    setServerError(null);
    try {
      await registerPatient(values);
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
        Already have an account?{" "}
        <NextLink href="/login" className="text-primary font-semibold hover:underline">
          Sign In
        </NextLink>
      </div>
      <div>
        Are you a medical doctor?{" "}
        <NextLink
          href="/doctors/apply"
          className="text-primary font-semibold hover:underline"
        >
          Apply to join as Doctor &rarr;
        </NextLink>
      </div>
    </>
  );

  return (
    <AuthCardWrapper
      title="Create your patient account"
      description="Book online consultations and get digital prescriptions"
      icon={<HeartHandshake className="h-6 w-6" aria-hidden="true" />}
      footer={footerContent}
    >
      {serverError && (
        <ErrorState
          title="Registration failed"
          message={serverError}
          className="my-3 text-left p-3"
        />
      )}

      <SocialAuthButtons
        isLoading={isGoogleLoggingIn}
        onGoogleSuccess={handleGoogleSignIn}
        onGoogleError={handleGoogleError}
        text="signup_with"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="name"
              placeholder="e.g. John Doe"
              className="pl-9"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address *</Label>
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
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 6 characters"
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

        {/* Contact Number */}
        <div className="space-y-1.5">
          <Label htmlFor="contactNumber">Contact Number (Optional)</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="contactNumber"
              type="tel"
              placeholder="+1 555-0100"
              className="pl-9"
              {...register("contactNumber")}
            />
          </div>
          {errors.contactNumber && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.contactNumber.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <Label htmlFor="address">Residential Address (Optional)</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="address"
              placeholder="City, Country"
              className="pl-9"
              {...register("address")}
            />
          </div>
          {errors.address && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full mt-2"
          disabled={isRegisteringPatient || isGoogleLoggingIn}
        >
          {isRegisteringPatient ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </AuthCardWrapper>
  );
}

export default PatientRegisterForm;
