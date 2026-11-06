"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Award,
  Briefcase,
  DollarSign,
  FileBadge,
  FileUp,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorState } from "@/components/shared/ErrorState";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  registerDoctorSchema,
  type RegisterDoctorFormValues,
} from "@/features/auth/validations/auth.validation";
import { getApiErrorMessage } from "@/lib/api/errors";
import NextLink from "next/link";

export function DoctorApplyForm() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const { registerDoctor, isRegisteringDoctor } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDoctorFormValues>({
    resolver: zodResolver(registerDoctorSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      specialization: "",
      licenseNumber: "",
      qualifications: "",
      experienceYears: 1,
      consultationFee: 50,
      contactNumber: "",
      address: "",
      bio: "",
    },
  });

  const onSubmit = async (values: RegisterDoctorFormValues) => {
    setServerError(null);
    try {
      await registerDoctor({
        ...values,
        resume: resumeFile,
      });
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err));
    }
  };

  return (
    <Card className="shadow-lg border-border/80">
      <CardHeader className="border-b border-border/60 pb-4">
        <CardTitle className="text-xl font-semibold">
          Practitioner Registration Application
        </CardTitle>
        <CardDescription>
          All applications undergo credential review and verification by our
          medical administrative team.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {serverError && (
          <ErrorState
            title="Application submission failed"
            message={serverError}
            className="my-3 text-left p-3"
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Personal Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="name"
                    placeholder="Dr. Sarah Connor"
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

              <div className="space-y-1.5">
                <Label htmlFor="email">Email address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@hospital.org"
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

              <div className="space-y-1.5">
                <Label htmlFor="password">Account Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Optional or min 6 chars"
                    className="pl-9"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactNumber">Contact Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="contactNumber"
                    type="tel"
                    placeholder="+1 555-0199"
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
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Clinic / Chamber Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="address"
                  placeholder="Medical Center, Suite 402, City"
                  className="pl-9"
                  {...register("address")}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Professional Credentials */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">
              Professional Credentials & Licensing
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="specialization">Medical Specialization *</Label>
                <div className="relative">
                  <Award className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="specialization"
                    placeholder="e.g. Cardiology, Pediatrics"
                    className="pl-9"
                    {...register("specialization")}
                  />
                </div>
                {errors.specialization && (
                  <p className="text-xs text-destructive mt-1 font-medium">
                    {errors.specialization.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="licenseNumber">
                  Medical License / BMDC Number *
                </Label>
                <div className="relative">
                  <FileBadge className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="licenseNumber"
                    placeholder="BMDC-12345"
                    className="pl-9"
                    {...register("licenseNumber")}
                  />
                </div>
                {errors.licenseNumber && (
                  <p className="text-xs text-destructive mt-1 font-medium">
                    {errors.licenseNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="qualifications">Academic Qualifications *</Label>
                <Input
                  id="qualifications"
                  placeholder="e.g. MBBS, FCPS, MD"
                  {...register("qualifications")}
                />
                {errors.qualifications && (
                  <p className="text-xs text-destructive mt-1 font-medium">
                    {errors.qualifications.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="experienceYears">
                  Years of Clinical Experience *
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="experienceYears"
                    type="number"
                    min={0}
                    className="pl-9"
                    {...register("experienceYears", { valueAsNumber: true })}
                  />
                </div>
                {errors.experienceYears && (
                  <p className="text-xs text-destructive mt-1 font-medium">
                    {errors.experienceYears.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="consultationFee">Consultation Fee ($ USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="consultationFee"
                    type="number"
                    min={0}
                    step="0.01"
                    className="pl-9"
                    {...register("consultationFee", { valueAsNumber: true })}
                  />
                </div>
                {errors.consultationFee && (
                  <p className="text-xs text-destructive mt-1 font-medium">
                    {errors.consultationFee.message}
                  </p>
                )}
              </div>

              {/* Resume Upload */}
              <div className="space-y-1.5">
                <Label htmlFor="resume">Resume / CV Document (PDF)</Label>
                <div className="relative">
                  <FileUp className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="pl-9 text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setResumeFile(file);
                    }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Accepted formats: PDF or DOCX up to 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Professional Biography */}
          <div className="space-y-1.5">
            <Label htmlFor="bio">Professional Summary / Bio</Label>
            <textarea
              id="bio"
              rows={3}
              placeholder="Provide a brief clinical biography, clinical focus areas, hospital affiliations..."
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-xs text-destructive mt-1 font-medium">
                {errors.bio.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full text-base font-semibold"
            disabled={isRegisteringDoctor}
          >
            {isRegisteringDoctor ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting Doctor Application...
              </>
            ) : (
              "Submit Application for Review"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border pt-4 text-center text-xs text-muted-foreground">
        Already registered as a doctor?{" "}
        <NextLink
          href="/login"
          className="ml-1 text-primary font-semibold hover:underline"
        >
          Sign In to Portal &rarr;
        </NextLink>
      </CardFooter>
    </Card>
  );
}

export default DoctorApplyForm;

