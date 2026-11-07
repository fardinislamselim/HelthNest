"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Calendar, Clock, Video, ArrowRight, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type { PatientAppointmentItem } from "@/features/patient/appointments/types/appointment.types";

export function PaymentSuccessView() {
  // Fetch latest booked appointment to confirm backend-authoritative state
  const { data: latestAppointment, isLoading } = useQuery<PatientAppointmentItem | null>({
    queryKey: ["appointments", "latest-booked"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<PatientAppointmentItem[]>>(
        `${API_ENDPOINTS.APPOINTMENTS.MY_APPOINTMENTS}?limit=1&status=BOOKED`,
      );
      return res.data?.data?.[0] ?? null;
    },
    refetchInterval: (query) => {
      return query.state.data ? false : 2000;
    },
  });

  return (
    <div className="container mx-auto max-w-xl py-6 sm:py-12 px-3 sm:px-4">
      <Card className="shadow-lg border-border/80 text-center animate-in fade-in-50 zoom-in-95 min-w-0">
        <CardHeader className="pb-4 items-center">
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
            <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Payment Confirmed!
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Your appointment has been confirmed by HealthNest and verified with Stripe.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-5 text-left">
          {isLoading ? (
            <div className="p-4 rounded-xl bg-muted/40 animate-pulse space-y-2">
              <div className="h-5 w-48 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted/60 rounded" />
            </div>
          ) : latestAppointment ? (
            <div className="p-3.5 sm:p-4 rounded-xl bg-muted/30 border border-border/60 space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2 gap-2">
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Doctor
                  </span>
                  <p className="text-sm font-bold text-foreground truncate">
                    Dr. {latestAppointment.doctor?.name}
                  </p>
                  <p className="text-xs text-primary font-medium truncate">
                    {latestAppointment.doctor?.specialization}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Serial Number
                  </span>
                  <p className="text-base sm:text-lg font-black text-primary">
                    #{latestAppointment.serialNumber ?? 1}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{latestAppointment.schedule?.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>
                    {latestAppointment.slot?.startTime} – {latestAppointment.slot?.endTime}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <StatusBadge status={latestAppointment.status} />
                {latestAppointment.schedule?.meetLink && (
                  <Button asChild variant="outline" size="xs" className="gap-1 text-xs">
                    <a
                      href={latestAppointment.schedule.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Video className="h-3.5 w-3.5 text-primary" />
                      Google Meet Link
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground text-center">
              Your appointment confirmation is finalizing. You can view it under Appointments.
            </div>
          )}

          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>
              A receipt has been recorded and an email notification has been dispatched.
            </span>
          </div>
        </CardContent>

        <CardFooter className="border-t border-border/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
          <Button asChild className="w-full sm:w-auto gap-2">
            <Link href="/dashboard/appointments">
              View All Appointments <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PaymentSuccessView;
