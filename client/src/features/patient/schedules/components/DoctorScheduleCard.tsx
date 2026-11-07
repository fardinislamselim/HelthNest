"use client";

import * as React from "react";
import Image from "next/image";
import { Clock, Award, DollarSign, Calendar, User, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PatientScheduleItem } from "../types/schedule.types";

interface DoctorScheduleCardProps {
  schedule: PatientScheduleItem;
  onSelectSchedule: (schedule: PatientScheduleItem) => void;
}

export function DoctorScheduleCard({
  schedule,
  onSelectSchedule,
}: DoctorScheduleCardProps) {
  const doctor = schedule.doctor;

  return (
    <Card className="flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow border-border/80 min-w-0">
      <CardHeader className="pb-3 space-y-3">
        <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-full border border-primary/20 bg-muted/60 flex items-center justify-center">
              {doctor.user?.profileImageUrl ? (
                <Image
                  src={doctor.user.profileImageUrl}
                  alt={doctor.name}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <User className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground/60" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                Dr. {doctor.name}
              </h3>
              <p className="text-xs font-semibold text-primary truncate">
                {doctor.specialization}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                {doctor.qualifications}
              </p>
            </div>
          </div>
          <Badge
            variant={schedule.availableSlots > 0 ? "success" : "destructive"}
            className="text-[11px] sm:text-xs font-semibold shrink-0"
          >
            {schedule.availableSlots} {schedule.availableSlots === 1 ? "Slot" : "Slots"} Left
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3 text-xs">
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Award className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">{doctor.experienceYears} Years Exp.</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-foreground truncate">
              ${Number(doctor.consultationFee || 0).toFixed(2)} Fee
            </span>
          </div>
        </div>

        <div className="space-y-1 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">Today ({schedule.date})</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="font-medium text-foreground truncate">
              {schedule.startTime} – {schedule.endTime} (20-min slots)
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-border/50">
        <Button
          type="button"
          onClick={() => onSelectSchedule(schedule)}
          disabled={schedule.availableSlots === 0}
          className="w-full gap-2 shadow-xs text-xs sm:text-sm"
        >
          <CheckCircle2 className="h-4 w-4" />
          {schedule.availableSlots > 0 ? "View Available Slots" : "Fully Booked"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default DoctorScheduleCard;
