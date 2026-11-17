"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Award, Briefcase, DollarSign, ArrowRight, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PublicDoctorItem } from "../types/doctor.types";

interface DoctorCardProps {
  doctor: PublicDoctorItem;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Card className="flex flex-col h-full border-border/70 hover:border-primary/40 hover:shadow-md transition-all duration-200 overflow-hidden group bg-card">
      <CardContent className="p-5 flex-1 space-y-4">
        {/* Top Header: Avatar + Name + Specialization */}
        <div className="flex items-start gap-3.5">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-primary/20 overflow-hidden bg-primary/10 text-primary">
            {doctor.profileImageUrl ? (
              <Image
                src={doctor.profileImageUrl}
                alt={doctor.name}
                width={56}
                height={56}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            ) : (
              <User className="h-7 w-7" />
            )}
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
                {doctor.name}
              </h3>
              <span title="Verified Healthcare Practitioner">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              </span>
            </div>

            <Badge
              variant="secondary"
              className="text-[11px] font-medium tracking-wide bg-primary/10 text-primary hover:bg-primary/15 border-transparent"
            >
              {doctor.specialization}
            </Badge>
          </div>
        </div>

        {/* Credentials & Experience */}
        <div className="space-y-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Briefcase className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">
              {doctor.experienceYears} {doctor.experienceYears === 1 ? "Year" : "Years"} Clinical Experience
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Award className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate" title={doctor.qualifications}>
              {doctor.qualifications}
            </span>
          </div>
        </div>

        {/* Bio summary if provided */}
        {doctor.bio && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed pt-1">
            {doctor.bio}
          </p>
        )}
      </CardContent>

      {/* Footer: Fee + Actions */}
      <CardFooter className="p-4 pt-3 border-t border-border/60 bg-muted/20 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
            Consultation
          </span>
          <div className="flex items-center text-sm font-bold text-foreground">
            {doctor.consultationFee !== undefined && doctor.consultationFee !== null ? (
              <>
                <DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 -mr-0.5" />
                <span>{doctor.consultationFee.toLocaleString()}</span>
                <span className="text-[10px] text-muted-foreground font-normal ml-1">/ 20 min</span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground font-normal">Fee on profile</span>
            )}
          </div>
        </div>

        <Button
          variant="default"
          size="sm"
          asChild
          className="text-xs gap-1.5 h-8 font-medium shadow-xs"
        >
          <Link href={`/doctors/${doctor.id}`}>
            <span>View Profile</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default DoctorCard;
