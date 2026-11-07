"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  FileCheck,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminDashboardData } from "../../types/admin.types";

interface AdminDashboardStatsProps {
  data?: AdminDashboardData;
  isLoading?: boolean;
}

export function AdminDashboardStats({ data, isLoading }: AdminDashboardStatsProps) {
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const { users, doctorApplications, appointments, payments, refunds } = data;

  const statCards = [
    {
      title: "Pending Applications",
      value: doctorApplications.pending,
      subtitle: `${doctorApplications.approved} approved, ${doctorApplications.rejected} rejected`,
      icon: FileCheck,
      href: "/admin/doctor-applications",
      highlight: doctorApplications.pending > 0,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Active Doctors",
      value: users.activeDoctors,
      subtitle: `${users.totalDoctors} total registered (${users.blockedDoctors} blocked)`,
      icon: Stethoscope,
      href: "/admin/doctors",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Registered Patients",
      value: users.totalPatients,
      subtitle: `${users.activePatients} active, ${users.blockedPatients} blocked`,
      icon: Users,
      href: "/admin/patients",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Consultations",
      value: appointments.total,
      subtitle: `${appointments.today} today · ${appointments.completed} completed`,
      icon: Calendar,
      href: "/admin/appointments",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Gross Payments",
      value: `$${payments.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${payments.successfulCount} successful transactions`,
      icon: DollarSign,
      href: "/admin/payments",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Refunds Processed",
      value: `$${refunds.totalRefundedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${refunds.completed} completed · ${refunds.pending} pending`,
      icon: RefreshCw,
      href: "/admin/payments",
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <Link key={card.title} href={card.href} className="group focus:outline-hidden">
            <Card className="h-full shadow-xs transition-all hover:border-primary/50 hover:shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 gap-2">
                <CardTitle className="text-xs font-medium text-muted-foreground truncate">
                  {card.title}
                </CardTitle>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bgColor} ${card.color} shrink-0`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold tracking-tight truncate">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {card.subtitle}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
