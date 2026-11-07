"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, User, Mail, Phone, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  patientProfileSchema,
  type PatientProfileFormValues,
} from "../validations/profile.validation";
import type { FullPatientProfile } from "../types/profile.types";

interface PatientProfileFormProps {
  profile: FullPatientProfile;
  onSubmit: (values: PatientProfileFormValues) => Promise<unknown>;
  isSubmitting?: boolean;
}

export function PatientProfileForm({
  profile,
  onSubmit,
  isSubmitting = false,
}: PatientProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<PatientProfileFormValues>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: {
      name: profile.name || "",
      email: profile.email || "",
      contactNumber: profile.patient?.contactNumber || "",
      address: profile.patient?.address || "",
    },
  });

  React.useEffect(() => {
    reset({
      name: profile.name || "",
      email: profile.email || "",
      contactNumber: profile.patient?.contactNumber || "",
      address: profile.patient?.address || "",
    });
  }, [profile, reset]);

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Personal Information</CardTitle>
        <CardDescription>
          Keep your medical contact details current for appointments and billing receipts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold">
              Full Legal Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="name"
                placeholder="John Doe"
                className="pl-9"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-destructive font-medium mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="pl-9"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive font-medium mt-1">
                {errors.email.message}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground">
              Note: Changing your email will require re-verifying your email address.
            </p>
          </div>

          {/* Contact Number */}
          <div className="space-y-1.5">
            <Label htmlFor="contactNumber" className="text-xs font-semibold">
              Contact Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="contactNumber"
                placeholder="+1 (555) 000-0000"
                className="pl-9"
                {...register("contactNumber")}
              />
            </div>
            {errors.contactNumber && (
              <p className="text-xs text-destructive font-medium mt-1">
                {errors.contactNumber.message}
              </p>
            )}
          </div>

          {/* Residential Address */}
          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-xs font-semibold">
              Residential Address
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="address"
                placeholder="123 Health Ave, Suite 400"
                className="pl-9"
                {...register("address")}
              />
            </div>
            {errors.address && (
              <p className="text-xs text-destructive font-medium mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex flex-col sm:flex-row justify-end gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="w-full sm:w-auto gap-2 text-sm shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default PatientProfileForm;
