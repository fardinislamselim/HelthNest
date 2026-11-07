"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, User, Phone, MapPin, Mail } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  doctorProfileSchema,
  type DoctorProfileFormValues,
} from "../validations/profile.validation";
import type { FullDoctorProfile, UpdateDoctorProfilePayload } from "../types/profile.types";

interface DoctorProfileFormProps {
  profile: FullDoctorProfile;
  onSubmit: (payload: UpdateDoctorProfilePayload) => Promise<unknown>;
  isSubmitting?: boolean;
}

export function DoctorProfileForm({
  profile,
  onSubmit,
  isSubmitting = false,
}: DoctorProfileFormProps) {
  const doctor = profile.doctor;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<DoctorProfileFormValues>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: {
      name: profile.name || "",
      email: profile.email || "",
      contactNumber: doctor?.contactNumber || "",
      address: doctor?.address || "",
    },
  });

  // Re-sync form default values if profile updates externally
  React.useEffect(() => {
    reset({
      name: profile.name || "",
      email: profile.email || "",
      contactNumber: doctor?.contactNumber || "",
      address: doctor?.address || "",
    });
  }, [profile, doctor, reset]);

  const handleFormSubmit = async (values: DoctorProfileFormValues) => {
    await onSubmit({
      name: values.name,
      contactNumber: values.contactNumber || undefined,
      address: values.address || undefined,
    });
  };

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Personal &amp; Contact Information
        </CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-medium flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Full Practitioner Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Dr. Sarah Jenkins"
              disabled={isSubmitting}
              className="text-sm"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email Address (Read-only for security) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="text-xs font-medium flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Registered Email Address
              </Label>
              {profile.emailVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>
            <Input
              id="email"
              type="email"
              disabled
              className="text-sm bg-muted/50 cursor-not-allowed opacity-80"
              {...register("email")}
            />
            <p className="text-[11px] text-muted-foreground">
              Primary login email. Contact administrative support to change login credentials.
            </p>
          </div>

          {/* Contact Number */}
          <div className="space-y-1.5">
            <Label htmlFor="contactNumber" className="text-xs font-medium flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              Contact Phone Number
            </Label>
            <Input
              id="contactNumber"
              type="tel"
              placeholder="e.g. +1 555-0199"
              disabled={isSubmitting}
              className="text-sm"
              {...register("contactNumber")}
            />
            {errors.contactNumber && (
              <p className="text-xs text-destructive">{errors.contactNumber.message}</p>
            )}
          </div>

          {/* Practice Address */}
          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-xs font-medium flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              Clinic or Hospital Practice Address
            </Label>
            <Input
              id="address"
              placeholder="e.g. Suite 400, St. Jude Medical Pavilion, New York, NY"
              disabled={isSubmitting}
              className="text-sm"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-destructive">{errors.address.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!isDirty || isSubmitting}
            onClick={() => reset()}
          >
            Discard
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!isDirty || isSubmitting}
            className="min-w-28"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default DoctorProfileForm;
