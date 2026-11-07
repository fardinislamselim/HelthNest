"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  User,
  Phone,
  Mail,
  Play,
  CheckCircle2,
  FilePlus,
  CreditCard,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useDoctorAppointmentDetails } from "../hooks/useDoctorAppointmentDetails";
import { useConsultationLifecycle } from "../hooks/useConsultationLifecycle";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DoctorAppointmentDetailsViewProps {
  appointmentId: string;
}

const formatDateSafe = (dateStr?: string | null, pattern = "EEEE, MMMM d, yyyy") => {
  if (!dateStr) return null;
  try {
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return dateStr;
    return format(parsed, pattern);
  } catch {
    return dateStr;
  }
};

export function DoctorAppointmentDetailsView({
  appointmentId,
}: DoctorAppointmentDetailsViewProps) {
  const { appointment, isLoading, isError, error, refetch } =
    useDoctorAppointmentDetails(appointmentId);

  const {
    startAppointment,
    isStarting,
    completeAppointment,
    isCompleting,
  } = useConsultationLifecycle();

  if (isError) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild className="gap-1.5 -ml-2 text-xs">
          <Link href="/doctor/appointments">
            <ArrowLeft className="h-4 w-4" />
            Back to Consultations
          </Link>
        </Button>
        <ErrorState
          title="Consultation Not Found"
          message={error?.message || "Could not retrieve appointment details from the server."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (isLoading || !appointment) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-60 w-full rounded-xl" />
          <Skeleton className="h-60 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const isBooked = appointment.status === "BOOKED";
  const isOngoing = appointment.status === "ONGOING";
  const isCompleted = appointment.status === "COMPLETED";

  const formattedDate =
    formatDateSafe(appointment.schedule?.date) || "N/A";

  const formattedStarted = formatDateSafe(
    appointment.startedAt,
    "h:mm a, MMM d",
  );

  const formattedCompleted = formatDateSafe(
    appointment.completedAt,
    "h:mm a, MMM d",
  );

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" asChild className="gap-1.5 -ml-2 text-xs">
          <Link href="/doctor/appointments">
            <ArrowLeft className="h-4 w-4" />
            Back to Consultations
          </Link>
        </Button>
      </div>

      {/* Consultation Header & Lifecycle Actions Toolbar */}
      <Card className="shadow-xs border-primary/20 bg-gradient-to-r from-card to-primary/5">
        <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground uppercase">
                Appointment #{appointment.serialNumber || appointment.id.slice(0, 8)}
              </span>
              <StatusBadge status={appointment.status} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Consultation with {appointment.patient?.name || "Patient"}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {formattedStarted && (
                <span>Started: <strong className="text-foreground">{formattedStarted}</strong></span>
              )}
              {formattedCompleted && (
                <span>Completed: <strong className="text-foreground">{formattedCompleted}</strong></span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {isBooked && (
              <Button
                variant="default"
                size="sm"
                disabled={isStarting}
                onClick={() => startAppointment(appointment.id)}
                className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Play className="h-4 w-4" />
                <span>Start Consultation Session</span>
              </Button>
            )}

            {isOngoing && (
              <>
                {appointment.schedule?.meetLink && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-1.5 border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10"
                  >
                    <a
                      href={appointment.schedule.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Video className="h-4 w-4" />
                      <span>Open Video Room</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}

                <Button
                  variant="default"
                  size="sm"
                  disabled={isCompleting}
                  onClick={() => completeAppointment(appointment.id)}
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Complete Consultation</span>
                </Button>
              </>
            )}

            {isCompleted && (
              <Button
                variant="default"
                size="sm"
                asChild
                className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Link href={`/doctor/prescriptions/create?appointmentId=${appointment.id}`}>
                  <FilePlus className="h-4 w-4" />
                  <span>Issue Digital Prescription</span>
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Patient Details & Schedule Room */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Patient Profile Card */}
        <Card className="shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Patient Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full border border-border bg-muted/60 overflow-hidden flex items-center justify-center shrink-0">
                {appointment.patient?.user?.profileImageUrl ? (
                  <Image
                    src={appointment.patient.user.profileImageUrl}
                    alt={appointment.patient.name || "Patient"}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <User className="h-7 w-7 text-muted-foreground" />
                )}
              </div>

              <div className="space-y-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground truncate">
                  {appointment.patient?.name || "Patient"}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  Registered Patient
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
              <div className="bg-muted/30 p-2.5 rounded-lg border border-border/50 space-y-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email Address
                </span>
                <p className="font-medium text-foreground truncate">
                  {appointment.patient?.email || "N/A"}
                </p>
              </div>

              <div className="bg-muted/30 p-2.5 rounded-lg border border-border/50 space-y-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Phone Number
                </span>
                <p className="font-medium text-foreground">
                  {appointment.patient?.contactNumber || "Not provided"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Telehealth Video Card */}
        <Card className="shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Consultation Timing &amp; Video Room</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-muted/30 p-2.5 rounded-lg border border-border/50 space-y-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-primary" />
                  Date
                </span>
                <p className="font-medium text-foreground">{formattedDate}</p>
              </div>

              <div className="bg-muted/30 p-2.5 rounded-lg border border-border/50 space-y-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3 text-primary" />
                  Slot Time Window
                </span>
                <p className="font-medium font-mono text-foreground">
                  {appointment.slot?.startTime} - {appointment.slot?.endTime} (Slot #{appointment.slot?.serialNumber})
                </p>
              </div>
            </div>

            {/* Video Meeting Box */}
            <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                  <Video className="h-4 w-4" />
                  Telehealth Room
                </span>
                <span className="text-[11px] text-muted-foreground">Google Meet</span>
              </div>

              <div className="bg-background/90 p-2 rounded border border-border/60 font-mono text-xs text-muted-foreground truncate">
                {appointment.schedule?.meetLink || "No link provided"}
              </div>

              {appointment.schedule?.meetLink && (
                <Button
                  size="sm"
                  asChild
                  className="w-full gap-1.5"
                >
                  <a
                    href={appointment.schedule.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Video className="h-4 w-4" />
                    <span>Launch Google Meet Room</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing & Payment Info Card */}
      {appointment.payment && (
        <Card className="shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Payment &amp; Billing Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground">Payment Status</span>
                <div>
                  <StatusBadge status={appointment.payment.status} />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground">Consultation Fee</span>
                <p className="text-base font-bold text-foreground">
                  ${appointment.payment.amount} {appointment.payment.currency}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground">Invoice Reference</span>
                <p className="font-mono text-muted-foreground">
                  {appointment.payment.invoiceNumber || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default DoctorAppointmentDetailsView;
