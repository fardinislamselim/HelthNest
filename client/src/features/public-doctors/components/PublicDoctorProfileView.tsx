"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Calendar,
  CalendarX2,
  CheckCircle2,
  Clock,
  DollarSign,
  Loader2,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Video,
  ArrowRight,
} from "lucide-react";
import { usePublicDoctorDetails } from "../hooks/usePublicDoctorDetails";
import { usePublicDoctorSchedules } from "../hooks/usePublicDoctorSchedules";
import { useBookingFlow } from "@/features/patient/booking/hooks/useBookingFlow";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { cn } from "@/lib/utils";

interface PublicDoctorProfileViewProps {
  doctorId: string;
}

const DOCTOR_TITLE_PREFIX = /^\s*dr(?:\.\s*|\s+)/i;

function formatDoctorName(name?: string | null): string {
  const raw = (name || "").trim();
  if (!raw) return "Dr. Practitioner";
  const withoutTitle = raw.replace(DOCTOR_TITLE_PREFIX, "").trim();
  return `Dr. ${withoutTitle || raw}`;
}

function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatTime12Hour(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  const hour24 = Number(hStr);
  const minute = Number(mStr);
  if (isNaN(hour24) || isNaN(minute)) return hhmm;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
}

const formatDateSafe = (dateStr?: string, pattern = "MMMM yyyy") => {
  if (!dateStr) return "N/A";
  try {
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      const [y, m, d] = dateStr.slice(0, 10).split("-").map(Number);
      return format(new Date(y, m - 1, d), pattern);
    }
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return dateStr;
    return format(parsed, pattern);
  } catch {
    return dateStr;
  }
};

export function PublicDoctorProfileView({ doctorId }: PublicDoctorProfileViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const todayDate = React.useMemo(() => getTodayDateString(), []);

  const initialDateParam = searchParams.get("date");
  const initialDate =
    initialDateParam && /^\d{4}-\d{2}-\d{2}$/.test(initialDateParam) && initialDateParam >= todayDate
      ? initialDateParam
      : todayDate;

  const [selectedDate, setSelectedDate] = React.useState<string>(initialDate);
  const [selectedSlotId, setSelectedSlotId] = React.useState<string | null>(
    searchParams.get("slotId"),
  );

  const { doctor, isLoading, isError, error, refetch } = usePublicDoctorDetails(doctorId);
  const {
    schedule,
    slots,
    isLoading: isLoadingSlots,
    isFetching: isFetchingSlots,
  } = usePublicDoctorSchedules(doctorId, selectedDate);
  const { isAuthenticated, user } = useAuth();
  const { initiateBooking, isBooking } = useBookingFlow();

  const selectedSlot = React.useMemo(
    () => slots.find((s) => s.id === selectedSlotId && s.isAvailable) ?? null,
    [slots, selectedSlotId],
  );

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate || todayDate);
    setSelectedSlotId(null);
  };

  const handleBookSlot = async () => {
    if (!selectedSlot || !schedule || !doctor) return;

    if (!isAuthenticated) {
      const returnUrl = `/doctors/${doctor.id}?date=${encodeURIComponent(selectedDate)}&slotId=${encodeURIComponent(selectedSlot.id)}`;
      router.push(`/login?from=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (user?.role === "PATIENT") {
      await initiateBooking({
        scheduleId: schedule.id,
        slotId: selectedSlot.id,
      });
    }
  };

  if (isError) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 space-y-6">
        <Button variant="ghost" size="sm" asChild className="gap-1.5 -ml-2 text-xs">
          <Link href="/doctors">
            <ArrowLeft className="h-4 w-4" />
            Back to Doctor Directory
          </Link>
        </Button>
        <ErrorState
          title="Doctor Profile Not Found"
          message={error?.message || "Could not retrieve doctor details from the server."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (isLoading || !doctor) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-10 space-y-6">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-72 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const memberSince = formatDateSafe(doctor.createdAt);
  const isPatient = isAuthenticated && user?.role === "PATIENT";
  const displayName = formatDoctorName(doctor.name);
  const openSlotsCount = slots.filter((s) => s.isAvailable).length;

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-6">
        {/* Breadcrumb + Back Button */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 -ml-2 text-xs h-8">
            <Link href="/doctors">
              <ArrowLeft className="h-4 w-4" />
              <span>All Doctors</span>
            </Link>
          </Button>

          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/doctors" className="hover:text-foreground transition-colors">
              Find Doctors
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {displayName}
            </span>
          </nav>
        </div>

        {/* Main Content Layout: 2 Cols on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* =========================================================================
              LEFT COLUMN: DOCTOR DETAILS (2 cols)
              ========================================================================= */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary Profile Card */}
            <Card className="rounded-2xl border-border/80 shadow-xs overflow-hidden">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl border-2 border-primary/20 overflow-hidden bg-primary/10 text-primary shadow-sm">
                    {doctor.profileImageUrl ? (
                      <Image
                        src={doctor.profileImageUrl}
                        alt={displayName}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <User className="h-10 w-10" />
                    )}
                  </div>

                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        {displayName}
                      </h1>
                      <Badge
                        variant="success"
                        className="gap-1 text-[11px] font-semibold tracking-wide bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Verified Practitioner</span>
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/15 border-transparent"
                      >
                        {doctor.specialization}
                      </Badge>

                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 text-primary" />
                        {doctor.experienceYears} Years Clinical Experience
                      </span>
                    </div>

                    {/* Contact & Location Metadata */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-1">
                      {doctor.address && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{doctor.address}</span>
                        </span>
                      )}
                      {doctor.contactNumber && (
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{doctor.contactNumber}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Practicing since {memberSince}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Biography */}
            <Card className="rounded-2xl border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                  Professional Biography
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm text-muted-foreground leading-relaxed">
                {doctor.bio ? (
                  <p className="whitespace-pre-line">{doctor.bio}</p>
                ) : (
                  <p className="italic text-muted-foreground/80">
                    No detailed personal biography provided. This practitioner is verified and active on HealthNest.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Qualifications & Medical Credentials */}
            <Card className="rounded-2xl border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Qualifications & Credentials</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Degrees & Certifications
                  </h4>
                  <p className="text-sm font-medium text-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                    {doctor.qualifications}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-card border border-border/60">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-semibold text-foreground">Verified Medical License</p>
                      <p className="text-muted-foreground">Authenticated by platform administration</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-card border border-border/60">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-semibold text-foreground">Digital Prescription Authority</p>
                      <p className="text-muted-foreground">Certified for compliant digital Rx delivery</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: INTERACTIVE DATE & SLOT BOOKING CARD (1 col)
              ========================================================================= */}
          <div className="space-y-6 lg:sticky lg:top-20">
            <Card className="rounded-2xl border-primary/30 shadow-md bg-card overflow-hidden">
              <div className="bg-primary/10 p-5 border-b border-primary/20 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Consultation Fee
                </span>
                <div className="flex items-baseline gap-1">
                  <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400 -mr-1" />
                  <span className="text-3xl font-extrabold text-foreground">
                    {doctor.consultationFee !== undefined && doctor.consultationFee !== null
                      ? doctor.consultationFee.toLocaleString()
                      : "25"}
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">
                    / 20-min consultation
                  </span>
                </div>
              </div>

              <CardContent className="p-5 space-y-5">
                {/* Date Picker */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="doctor-booking-date"
                      className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                    >
                      <Calendar className="h-3.5 w-3.5 text-[#0D9488]" />
                      <span>Select Consultation Date</span>
                    </label>
                    {selectedDate !== todayDate && (
                      <button
                        type="button"
                        onClick={() => handleDateChange(todayDate)}
                        className="text-[11px] font-semibold text-[#0D9488] hover:underline"
                      >
                        Today
                      </button>
                    )}
                  </div>
                  <input
                    id="doctor-booking-date"
                    type="date"
                    min={todayDate}
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full h-10 rounded-xl border border-input bg-background px-3.5 text-sm text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]/25 focus-visible:border-[#0D9488]"
                  />
                </div>

                {/* Available 20-Minute Slots */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#0D9488]" />
                      <span>Available 20-Min Slots</span>
                    </span>
                    {schedule && openSlotsCount > 0 && (
                      <span className="text-[11px] font-medium text-[#0D9488]">
                        {openSlotsCount} open
                      </span>
                    )}
                  </div>

                  {isLoadingSlots || isFetchingSlots ? (
                    <div className="grid grid-cols-3 gap-2 py-2">
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <Skeleton key={idx} className="h-9 rounded-lg" />
                      ))}
                    </div>
                  ) : schedule && openSlotsCount > 0 ? (
                    <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-0.5">
                      {slots.map((slot) => {
                        const isSelected = selectedSlotId === slot.id;
                        const label = formatTime12Hour(slot.startTime);

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={!slot.isAvailable || isBooking}
                            onClick={() => setSelectedSlotId(slot.id)}
                            title={
                              slot.isAvailable
                                ? `Slot #${slot.serialNumber}: ${label}`
                                : `Slot #${slot.serialNumber} is already booked`
                            }
                            className={cn(
                              "px-2.5 py-2 rounded-lg text-xs font-semibold border transition-all text-center whitespace-nowrap",
                              slot.isAvailable
                                ? isSelected
                                  ? "bg-[#0D9488] text-white border-[#0D9488] shadow-xs"
                                  : "bg-background text-foreground border-border hover:border-[#0D9488]/60 hover:bg-teal-50/50"
                                : "bg-muted/50 text-muted-foreground/60 border-border/50 line-through cursor-not-allowed",
                            )}
                          >
                            {slot.isAvailable ? label : "Booked"}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-center space-y-1.5">
                      <CalendarX2 className="h-5 w-5 text-muted-foreground mx-auto" />
                      <p className="text-xs font-medium text-foreground">
                        No available slots for this date.
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Please select another date to view open consultation times.
                      </p>
                    </div>
                  )}
                </div>

                {/* Features included */}
                <div className="space-y-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-primary shrink-0" />
                    <span>Secure HD Google Meet consultation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary shrink-0" />
                    <span>Post-consultation digital prescription & summary</span>
                  </div>
                </div>

                {/* Direct Booking Action */}
                <div className="pt-2 border-t border-border/60 space-y-3">
                  {isAuthenticated && !isPatient ? (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground text-center">
                        Signed in as <strong className="text-foreground">{user?.role}</strong>. Patient accounts can directly book appointments.
                      </p>
                      <Button asChild variant="outline" size="sm" className="w-full text-xs">
                        <Link href="/dashboard">Go to Dashboard</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        type="button"
                        size="default"
                        disabled={!selectedSlot || isBooking}
                        onClick={() => void handleBookSlot()}
                        className="w-full gap-2 font-semibold shadow-xs bg-[#0D9488] hover:bg-[#0F766E] text-white"
                      >
                        {isBooking ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Initializing Checkout...</span>
                          </>
                        ) : selectedSlot ? (
                          <>
                            <span>
                              Book {formatTime12Hour(selectedSlot.startTime)} Slot
                            </span>
                            <ArrowRight className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <span>Book Consultation Now</span>
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>

                      {!isAuthenticated && (
                        <p className="text-[11px] text-muted-foreground text-center">
                          Select a slot to continue.{" "}
                          <Link
                            href={`/register?from=${encodeURIComponent(`/doctors/${doctor.id}`)}`}
                            className="text-primary font-medium hover:underline"
                          >
                            Register as a Patient
                          </Link>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicDoctorProfileView;
