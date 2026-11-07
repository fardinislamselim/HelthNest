"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Video,
  User,
  CreditCard,
  FileText,
  XCircle,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { PatientAppointmentItem } from "../types/appointment.types";

interface AppointmentDetailsViewProps {
  appointment: PatientAppointmentItem;
  onRequestCancel: () => void;
}

export function AppointmentDetailsView({
  appointment,
  onRequestCancel,
}: AppointmentDetailsViewProps) {
  const isCancellable =
    appointment.status === "BOOKED" || appointment.status === "PENDING";
  const canJoinMeet =
    (appointment.status === "BOOKED" || appointment.status === "ONGOING") &&
    Boolean(appointment.schedule.meetLink);

  const formattedCreated = new Date(appointment.createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-2 text-xs">
          <Link href="/dashboard/appointments">
            <ArrowLeft className="h-4 w-4" />
            Back to Appointments
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <StatusBadge status={appointment.status} className="text-sm py-1 px-3" />
        </div>
      </div>

      {/* Main Appointment Card */}
      <Card className="shadow-xs border-border/80">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Appointment Reference
              </span>
              <CardTitle className="text-xl font-bold mt-0.5">
                {appointment.serialNumber
                  ? `Consultation Serial #${appointment.serialNumber}`
                  : "Consultation (Pending Confirmation)"}
              </CardTitle>
              <CardDescription className="text-xs">
                Booked on {formattedCreated}
              </CardDescription>
            </div>
            {isCancellable && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onRequestCancel}
                className="gap-1.5 self-start sm:self-auto text-xs"
              >
                <XCircle className="h-4 w-4" />
                Cancel Consultation
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-5">
          {/* Doctor Details */}
          <div className="p-4 rounded-xl border border-border/60 bg-card space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Practitioner Information
            </h4>
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-primary/20 bg-muted flex items-center justify-center">
                {appointment.doctor.user?.profileImageUrl ? (
                  <Image
                    src={appointment.doctor.user.profileImageUrl}
                    alt={appointment.doctor.name}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <User className="h-7 w-7 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Dr. {appointment.doctor.name}
                </h3>
                <p className="text-xs font-semibold text-primary">
                  {appointment.doctor.specialization}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Verified HealthNest Medical Practitioner
                </p>
              </div>
            </div>
          </div>

          {/* Schedule & Meeting Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border/60 bg-card space-y-2 text-xs">
              <span className="font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                Consultation Schedule
              </span>
              <p className="text-sm font-bold text-foreground">
                {appointment.schedule.date}
              </p>
              <p className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Slot: {appointment.slot.startTime} – {appointment.slot.endTime} (20 min)
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/60 bg-card space-y-2 text-xs">
              <span className="font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Video className="h-4 w-4 text-primary" />
                Google Meet Video Consultation
              </span>
              {canJoinMeet ? (
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Your video consultation room is ready.
                  </p>
                  <Button asChild size="sm" className="gap-2 w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                    <a
                      href={appointment.schedule.meetLink!}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Video className="h-4 w-4" />
                      Join Google Meet Room
                    </a>
                  </Button>
                </div>
              ) : appointment.status === "COMPLETED" ? (
                <p className="text-muted-foreground flex items-center gap-1 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Consultation completed. Video link closed.
                </p>
              ) : appointment.status === "CANCELLED" ? (
                <p className="text-muted-foreground flex items-center gap-1 text-xs">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  Appointment was cancelled.
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Video meeting link will activate upon payment confirmation.
                </p>
              )}
            </div>
          </div>

          {/* Payment Details */}
          {appointment.payment && (
            <div className="p-4 rounded-xl border border-border/60 bg-card space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Payment & Invoicing
                </span>
                <StatusBadge status={appointment.payment.status} />
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                <div>
                  <span className="text-muted-foreground">Amount:</span>
                  <p className="font-bold text-foreground text-sm">
                    {appointment.payment.currency} ${Number(appointment.payment.amount).toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Invoice Reference:</span>
                  <p className="font-mono text-foreground font-medium truncate">
                    {appointment.payment.invoiceNumber || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Gateway:</span>
                  <p className="font-medium text-foreground">Stripe Payments</p>
                </div>
              </div>
            </div>
          )}

          {/* Prescription Quick Access if completed */}
          {appointment.status === "COMPLETED" && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-foreground truncate">
                    Consultation Prescription
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    Dr. {appointment.doctor.name} has issued your digital prescription
                  </p>
                </div>
              </div>
              <Button asChild size="sm" variant="outline" className="border-emerald-500/30 w-full sm:w-auto shrink-0 text-xs">
                <Link href="/dashboard/prescriptions">
                  View Prescription &rarr;
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AppointmentDetailsView;
