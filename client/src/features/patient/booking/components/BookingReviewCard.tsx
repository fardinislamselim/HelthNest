"use client";

import * as React from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  CreditCard,
  ShieldCheck,
  User,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { BookingSelection } from "../types/booking.types";
import type { UserProfile } from "@/types/user";

interface BookingReviewCardProps {
  booking: BookingSelection;
  currentUser: UserProfile;
  onBack: () => void;
  onConfirm: () => Promise<void>;
  isSubmitting?: boolean;
}

export function BookingReviewCard({
  booking,
  currentUser,
  onBack,
  onConfirm,
  isSubmitting = false,
}: BookingReviewCardProps) {
  const { schedule, slot } = booking;
  const doctor = schedule.doctor;
  const fee = Number(doctor.consultationFee || 0);

  return (
    <Card className="max-w-2xl mx-auto shadow-md border-border/80 min-w-0">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5">
          <div className="min-w-0">
            <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
              Review Consultation Booking
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Please review appointment details before initiating secure payment
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            disabled={isSubmitting}
            className="gap-1.5 text-xs text-muted-foreground self-start xs:self-auto shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-4 sm:pt-5">
        {/* Doctor Summary */}
        <div className="flex flex-col xs:flex-row items-center xs:items-start text-center xs:text-left gap-3.5 p-3.5 sm:p-4 rounded-xl bg-muted/40 border border-border/60">
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-muted flex items-center justify-center">
            {doctor.user?.profileImageUrl ? (
              <Image
                src={doctor.user.profileImageUrl}
                alt={doctor.name}
                width={64}
                height={64}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <User className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground/60" />
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
              Dr. {doctor.name}
            </h3>
            <p className="text-xs font-semibold text-primary truncate">
              {doctor.specialization}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {doctor.qualifications} • {doctor.experienceYears} Years Experience
            </p>
          </div>
        </div>

        {/* Appointment & Slot Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 sm:p-3.5 rounded-lg border border-border/60 bg-card space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
              Appointment Date
            </span>
            <p className="text-sm font-bold text-foreground">{schedule.date}</p>
            <p className="text-muted-foreground">Today&apos;s Consultation</p>
          </div>

          <div className="p-3 sm:p-3.5 rounded-lg border border-border/60 bg-card space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
              Slot & Time
            </span>
            <p className="text-sm font-bold text-foreground truncate">
              {slot.startTime} – {slot.endTime}
            </p>
            <p className="text-muted-foreground">
              Serial Number: #{slot.serialNumber} (20 Minutes)
            </p>
          </div>
        </div>

        {/* Patient Contact Details */}
        <div className="p-3 sm:p-3.5 rounded-lg border border-border/60 bg-card text-xs space-y-1.5">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-primary shrink-0" />
            Patient Information
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-muted-foreground pt-1">
            <span className="truncate">
              Name: <strong className="text-foreground">{currentUser.name}</strong>
            </span>
            <span className="truncate">
              Email: <strong className="text-foreground">{currentUser.email}</strong>
            </span>
          </div>
        </div>

        {/* Price & Payment Summary */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-primary/5 space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Consultation Fee</span>
            <span className="font-semibold text-foreground">${fee.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Platform Processing Fee</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">FREE</span>
          </div>
          <div className="border-t border-border/60 pt-2 flex items-center justify-between text-sm sm:text-base font-bold">
            <span className="text-foreground">Total Due</span>
            <span className="text-primary text-base sm:text-lg">${fee.toFixed(2)} USD</span>
          </div>
        </div>

        {/* Security & Cancellation Guarantee Notice */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/40 text-[11px] text-muted-foreground leading-relaxed">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p>
            Payments are securely processed via <strong>Stripe</strong>. Cancellations made more than
            1 hour prior to the schedule start time are eligible for a full refund.
          </p>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border/60 pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full sm:w-auto text-xs"
        >
          Choose Different Slot
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="w-full sm:w-auto gap-2 shadow-xs text-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Initializing Stripe Checkout...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Confirm & Pay ${fee.toFixed(2)}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default BookingReviewCard;
