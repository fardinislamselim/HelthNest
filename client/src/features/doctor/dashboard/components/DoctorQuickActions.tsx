import * as React from "react";
import Link from "next/link";
import { PlusCircle, Calendar, Users, FileText, BarChart3, UserCog } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DoctorQuickActions() {
  const actions = [
    {
      label: "Create Schedule",
      href: "/doctor/schedules/create",
      icon: PlusCircle,
      variant: "outline" as const,
      description: "Define date, hours, & auto 20m slots",
    },
    {
      label: "My Schedules",
      href: "/doctor/schedules",
      icon: Calendar,
      variant: "outline" as const,
      description: "Manage drafts, publish, & slots",
    },
    {
      label: "Consultations",
      href: "/doctor/appointments",
      icon: Users,
      variant: "outline" as const,
      description: "View bookings & start sessions",
    },
    {
      label: "Prescriptions",
      href: "/doctor/prescriptions",
      icon: FileText,
      variant: "outline" as const,
      description: "Create & download digital Rx",
    },
    {
      label: "Doctor Analytics",
      href: "/doctor/analytics",
      icon: BarChart3,
      variant: "outline" as const,
      description: "Performance & completion ratios",
    },
    {
      label: "Doctor Profile",
      href: "/doctor/profile",
      icon: UserCog,
      variant: "outline" as const,
      description: "Qualifications, fee, & contact",
    },
  ];

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Practitioner Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <Button
                key={act.label}
                variant={act.variant}
                asChild
                className="h-auto flex-col items-center justify-center p-3 text-center whitespace-normal group"
              >
                <Link href={act.href} className="w-full space-y-1.5">
                  <Icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-semibold leading-tight line-clamp-1">
                    {act.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground hidden sm:line-clamp-2 leading-tight">
                    {act.description}
                  </span>
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default DoctorQuickActions;
