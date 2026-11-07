"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  FileCheck,
  Calendar,
  CreditCard,
  DollarSign,
  Users,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import type {
  RecentDoctorApplication,
  RecentAppointment,
  RecentPayment,
  RecentRefund,
  RecentUser,
} from "../../types/admin.types";

interface RecentPlatformActivitiesProps {
  doctorApplications?: RecentDoctorApplication[];
  appointments?: RecentAppointment[];
  payments?: RecentPayment[];
  refunds?: RecentRefund[];
  users?: RecentUser[];
  isSuperAdmin?: boolean;
}

export function RecentPlatformActivities({
  doctorApplications = [],
  appointments = [],
  payments = [],
  refunds = [],
  users = [],
  isSuperAdmin = false,
}: RecentPlatformActivitiesProps) {
  const [activeTab, setActiveTab] = React.useState<
    "applications" | "appointments" | "payments" | "refunds" | "users"
  >("applications");

  const formatDateSafe = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? "N/A" : format(d, "MMM d, yyyy · h:mm a");
    } catch {
      return "N/A";
    }
  };

  return (
    <Card className="shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-base font-semibold">Live Platform Activity</CardTitle>
          <CardDescription className="text-xs">
            Real-time feed of registrations, practitioner applications, appointments, and billing
          </CardDescription>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/60 rounded-lg text-xs self-start sm:self-auto">
          <Button
            size="sm"
            variant={activeTab === "applications" ? "default" : "ghost"}
            className="h-7 text-xs px-2.5 rounded-md"
            onClick={() => setActiveTab("applications")}
          >
            Applications ({doctorApplications.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === "appointments" ? "default" : "ghost"}
            className="h-7 text-xs px-2.5 rounded-md"
            onClick={() => setActiveTab("appointments")}
          >
            Appointments ({appointments.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === "payments" ? "default" : "ghost"}
            className="h-7 text-xs px-2.5 rounded-md"
            onClick={() => setActiveTab("payments")}
          >
            Payments ({payments.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === "refunds" ? "default" : "ghost"}
            className="h-7 text-xs px-2.5 rounded-md"
            onClick={() => setActiveTab("refunds")}
          >
            Refunds ({refunds.length})
          </Button>
          {isSuperAdmin && (
            <Button
              size="sm"
              variant={activeTab === "users" ? "default" : "ghost"}
              className="h-7 text-xs px-2.5 rounded-md"
              onClick={() => setActiveTab("users")}
            >
              Registrations ({users.length})
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Doctor Applications Tab */}
        {activeTab === "applications" && (
          <div className="space-y-2">
            {doctorApplications.length === 0 ? (
              <EmptyState
                icon={FileCheck}
                title="No recent applications"
                description="There are currently no doctor applications awaiting verification."
                className="py-8"
              />
            ) : (
              <div className="divide-y divide-border/40">
                {doctorApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileCheck className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{app.name}</p>
                          <StatusBadge status={app.verificationStatus} />
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {app.specialization || "General Medicine"} · Submitted {formatDateSafe(app.createdAt)}
                        </p>
                      </div>
                    </div>

                    <Button size="sm" variant="outline" asChild className="text-xs h-8 shrink-0 self-start sm:self-auto">
                      <Link href={`/admin/doctor-applications`}>
                        Review <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="space-y-2">
            {appointments.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No recent appointments"
                description="Platform consultations will be listed here as patients book slots."
                className="py-8"
              />
            ) : (
              <div className="divide-y divide-border/40">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {apt.patient?.name ? `Patient: ${apt.patient.name}` : `Consultation #${apt.id.slice(0, 8)}`}
                          </p>
                          <StatusBadge status={apt.status} />
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          Doctor: {apt.doctor?.name || "Practitioner"}
                          {apt.schedule ? ` · Date: ${apt.schedule.date} at ${apt.schedule.startTime}` : ""}
                        </p>
                      </div>
                    </div>

                    <Button size="sm" variant="ghost" asChild className="text-xs h-8 shrink-0 self-start sm:self-auto">
                      <Link href="/admin/appointments">
                        Inspect <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="space-y-2">
            {payments.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="No recent payments"
                description="Processed Stripe payments and settlements will appear here."
                className="py-8"
              />
            ) : (
              <div className="divide-y divide-border/40">
                {payments.map((pmt) => (
                  <div
                    key={pmt.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold truncate">
                            ${pmt.amount.toFixed(2)} {pmt.currency.toUpperCase()}
                          </p>
                          <StatusBadge status={pmt.status} />
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {pmt.appointment?.patient?.name ? `From: ${pmt.appointment.patient.name}` : ""}
                          {pmt.appointment?.doctor?.name ? ` · For: Dr. ${pmt.appointment.doctor.name}` : ""}
                          {" · "}{formatDateSafe(pmt.createdAt)}
                        </p>
                      </div>
                    </div>

                    <Button size="sm" variant="ghost" asChild className="text-xs h-8 shrink-0 self-start sm:self-auto">
                      <Link href="/admin/payments">
                        Audit <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Refunds Tab */}
        {activeTab === "refunds" && (
          <div className="space-y-2">
            {refunds.length === 0 ? (
              <EmptyState
                icon={DollarSign}
                title="No recent refunds"
                description="Completed and pending cancellation refunds will appear here."
                className="py-8"
              />
            ) : (
              <div className="divide-y divide-border/40">
                {refunds.map((ref) => (
                  <div
                    key={ref.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold truncate text-rose-600 dark:text-rose-400">
                            ${ref.amount.toFixed(2)} {ref.currency.toUpperCase()}
                          </p>
                          <StatusBadge status={ref.status} />
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {ref.patient?.name ? `Patient: ${ref.patient.name}` : "Patient"}
                          {" · "}{formatDateSafe(ref.createdAt)}
                        </p>
                      </div>
                    </div>

                    <Button size="sm" variant="ghost" asChild className="text-xs h-8 shrink-0 self-start sm:self-auto">
                      <Link href="/admin/payments">
                        Audit <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Registrations Tab (Super Admin Only) */}
        {isSuperAdmin && activeTab === "users" && (
          <div className="space-y-2">
            {users.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No user registrations"
                description="New platform users will show up here as they register."
                className="py-8"
              />
            ) : (
              <div className="divide-y divide-border/40">
                {users.map((usr) => (
                  <div
                    key={usr.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{usr.name || "Anonymous User"}</p>
                          <StatusBadge status={usr.status} />
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          Role: <span className="font-medium text-foreground">{usr.role}</span> · Registered {formatDateSafe(usr.createdAt)}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-muted-foreground self-start sm:self-auto">
                      ID: {usr.id.slice(0, 8)}...
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
