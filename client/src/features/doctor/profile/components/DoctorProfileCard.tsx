import * as React from "react";
import { format } from "date-fns";
import {
  Award,
  FileCheck2,
  Briefcase,
  DollarSign,
  ShieldCheck,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { FullDoctorProfile } from "../types/profile.types";

interface DoctorProfileCardProps {
  profile: FullDoctorProfile;
}

export function DoctorProfileCard({ profile }: DoctorProfileCardProps) {
  const doctor = profile.doctor;
  const formattedJoined = profile.createdAt
    ? format(new Date(profile.createdAt), "MMMM d, yyyy")
    : "N/A";

  return (
    <div className="space-y-6">
      {/* Verification Status Banner if not approved */}
      {doctor?.verificationStatus === "PENDING" && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <p className="font-semibold">Verification in Review</p>
            <p className="leading-relaxed">
              Your medical credentials and license number are currently undergoing administrative review. You can create schedule drafts in the meantime.
            </p>
          </div>
        </div>
      )}

      {doctor?.verificationStatus === "REJECTED" && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <p className="font-semibold">Verification Rejected</p>
            <p className="leading-relaxed">
              Reason: {doctor.rejectionReason || "Please contact platform administration for guidance on resubmitting documentation."}
            </p>
          </div>
        </div>
      )}

      {/* Professional Information Card */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">
              Medical Credentials &amp; Practice
            </CardTitle>
          </div>
          <StatusBadge
            status={doctor?.verificationStatus || "PENDING"}
            className="text-xs"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 bg-muted/30 p-3 rounded-lg border border-border/50">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-primary" />
                Medical Specialization
              </span>
              <p className="text-sm font-semibold text-foreground">
                {doctor?.specialization || "General Medicine"}
              </p>
            </div>

            <div className="space-y-1 bg-muted/30 p-3 rounded-lg border border-border/50">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <FileCheck2 className="h-3.5 w-3.5 text-primary" />
                Medical License Number
              </span>
              <p className="text-sm font-semibold text-foreground font-mono">
                {doctor?.licenseNumber || "N/A"}
              </p>
            </div>

            <div className="space-y-1 bg-muted/30 p-3 rounded-lg border border-border/50">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-primary" />
                Experience
              </span>
              <p className="text-sm font-semibold text-foreground">
                {doctor?.experienceYears ? `${doctor.experienceYears} Years of Clinical Practice` : "N/A"}
              </p>
            </div>

            <div className="space-y-1 bg-muted/30 p-3 rounded-lg border border-border/50">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-primary" />
                Consultation Fee
              </span>
              <p className="text-sm font-semibold text-foreground">
                {doctor?.consultationFee !== undefined && doctor?.consultationFee !== null
                  ? `$${doctor.consultationFee.toLocaleString()} per 20-min slot`
                  : "Not set"}
              </p>
            </div>
          </div>

          <div className="space-y-1 bg-muted/30 p-3 rounded-lg border border-border/50">
            <span className="text-xs text-muted-foreground">Qualifications &amp; Degrees</span>
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {doctor?.qualifications || "No qualifications provided."}
            </p>
          </div>

          {doctor?.bio && (
            <div className="space-y-1 bg-muted/30 p-3 rounded-lg border border-border/50">
              <span className="text-xs text-muted-foreground">Professional Biography</span>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {doctor.bio}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Details Card */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">Account Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground">Platform Role</span>
              <p className="font-semibold text-foreground">Doctor (Practitioner)</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Authentication Provider</span>
              <p className="font-semibold text-foreground uppercase">{profile.authProvider}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Member Since
              </span>
              <p className="font-semibold text-foreground">{formattedJoined}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DoctorProfileCard;
