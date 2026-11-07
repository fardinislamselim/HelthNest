"use client";

import * as React from "react";
import { Mail, Phone, MapPin, Calendar, CheckCircle2, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FullPatientProfile } from "../types/profile.types";

interface PatientProfileCardProps {
  profile: FullPatientProfile;
}

export function PatientProfileCard({ profile }: PatientProfileCardProps) {
  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Account Overview</CardTitle>
          <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold">
            {profile.role}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2.5 text-sm">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-foreground font-medium truncate flex-1 min-w-0">{profile.email}</span>
            {profile.emailVerified ? (
              <span className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 gap-1 font-medium shrink-0 ml-auto sm:ml-0">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </span>
            ) : (
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium shrink-0 ml-auto sm:ml-0">
                Unverified
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-foreground">
              {profile.patient?.contactNumber || "No contact phone provided"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-foreground">
              {profile.patient?.address || "No residential address provided"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-foreground">Member since {memberSince}</span>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <Shield className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-foreground">
              Auth Provider: <span className="capitalize">{profile.authProvider.toLowerCase()}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PatientProfileCard;
