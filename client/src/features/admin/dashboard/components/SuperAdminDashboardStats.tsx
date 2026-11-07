"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Calendar,
  DollarSign,
  FileCheck,
  Wallet,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SuperAdminDashboardData } from "../../types/admin.types";

interface SuperAdminDashboardStatsProps {
  data?: SuperAdminDashboardData;
  isLoading?: boolean;
}

export function SuperAdminDashboardStats({
  data,
  isLoading,
}: SuperAdminDashboardStatsProps) {
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const { users, doctorApplications, appointments, financial } = data;

  const statCards = [
    {
      title: "Total Platform Users",
      value: users.totalUsers,
      subtitle: `${users.activeUsers} active · ${users.blockedUsers} blocked accounts`,
      icon: Users,
      href: "/admin/analytics",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Administrator Accounts",
      value: users.totalAdmins,
      subtitle: "System operators with administrative access",
      icon: ShieldAlert,
      href: "/admin/admins",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Super Admins",
      value: users.totalSuperAdmins,
      subtitle: "Privileged governance authority",
      icon: ShieldCheck,
      href: "/admin/super-admins",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Pending Applications",
      value: doctorApplications.pending,
      subtitle: `${doctorApplications.approved} approved · ${doctorApplications.rejected} rejected`,
      icon: FileCheck,
      href: "/admin/doctor-applications",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Registered Practitioners",
      value: users.totalDoctors,
      subtitle: `${doctorApplications.activeDoctors} active in directory`,
      icon: Stethoscope,
      href: "/admin/doctors",
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-500/10",
    },
    {
      title: "Platform Consultations",
      value: appointments.total,
      subtitle: `${appointments.today} today · ${appointments.completed} completed`,
      icon: Calendar,
      href: "/admin/appointments",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "Gross Collected",
      value: `$${financial.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${financial.successfulCount} paid transactions`,
      icon: DollarSign,
      href: "/admin/payments",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Net Platform Revenue",
      value: `$${financial.netCollectedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `After $${financial.totalRefundedAmount.toLocaleString()} refunds refunded`,
      icon: Wallet,
      href: "/admin/payments",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
