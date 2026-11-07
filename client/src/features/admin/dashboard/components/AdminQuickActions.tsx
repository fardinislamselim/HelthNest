"use client";

import * as React from "react";
import Link from "next/link";
import {
  Stethoscope,
  Users,
  Calendar,
  CreditCard,
  FileCheck,
  ShieldAlert,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AdminQuickActionsProps {
  isSuperAdmin?: boolean;
}

export function AdminQuickActions({ isSuperAdmin = false }: AdminQuickActionsProps) {
  const commonActions = [
    {
      title: "Doctor Applications",
      description: "Review credentials, licenses, and approve practitioners",
      href: "/admin/doctor-applications",
      icon: FileCheck,
      variant: "outline" as const,
    },
    {
      title: "Doctor Directory",
      description: "Manage practicing specialists, statuses, and block controls",
      href: "/admin/doctors",
      icon: Stethoscope,
      variant: "outline" as const,
    },
    {
      title: "Patient Accounts",
      description: "Audit patient records, verification, and statuses",
      href: "/admin/patients",
      icon: Users,
      variant: "outline" as const,
    },
    {
      title: "All Appointments",
      description: "Monitor platform consultations and schedule lifecycle",
      href: "/admin/appointments",
      icon: Calendar,
      variant: "outline" as const,
    },
    {
      title: "Payments & Refunds",
      description: "Audit billing transactions and process refunds",
      href: "/admin/payments",
      icon: CreditCard,
      variant: "outline" as const,
    },
    {
      title: "Platform Analytics",
      description: "View registration volume, doctor ratios, and financials",
      href: "/admin/analytics",
      icon: BarChart3,
      variant: "outline" as const,
    },
  ];

  const superAdminActions = [
    {
      title: "Admin Management",
      description: "Create operators and enforce administrative access",
      href: "/admin/admins",
      icon: ShieldAlert,
      variant: "outline" as const,
    },
    {
      title: "Super Admin Governance",
      description: "Manage privileged super administrator accounts",
      href: "/admin/super-admins",
      icon: ShieldCheck,
      variant: "outline" as const,
    },
  ];

  const actions = isSuperAdmin
    ? [commonActions[0], ...superAdminActions, ...commonActions.slice(1)]
    : commonActions;

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Administrative Action Center</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Button
              key={act.title}
              variant={act.variant}
              className="h-auto flex-col items-center justify-center p-3 text-center whitespace-normal group"
              asChild
            >
              <Link href={act.href} className="w-full space-y-1.5">
                
                  <Icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-semibold leading-tight line-clamp-1">{act.title}</span>
               
                <span className="text-[10px] text-muted-foreground hidden sm:line-clamp-2 leading-tight">
                  {act.description}
                </span>
              </Link>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
