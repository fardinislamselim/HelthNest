import * as React from "react";
import Link from "next/link";
import { Stethoscope, Users, Calendar, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AdminQuickActions() {
  const actions = [
    {
      title: "Doctor Directory",
      description: "Review pending applications and verify licenses",
      href: "/admin/doctors",
      icon: Stethoscope,
      variant: "default" as const,
    },
    {
      title: "Patient Accounts",
      description: "Manage registered patient records and statuses",
      href: "/admin/patients",
      icon: Users,
      variant: "outline" as const,
    },
    {
      title: "All Consultations",
      description: "Monitor platform-wide booking schedules and states",
      href: "/admin/appointments",
      icon: Calendar,
      variant: "outline" as const,
    },
    {
      title: "Payments & Refunds",
      description: "Audit Stripe payment logs and process refunds",
      href: "/admin/payments",
      icon: DollarSign,
      variant: "outline" as const,
    },
  ];

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Administrative Controls</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Button
              key={act.title}
              variant={act.variant}
              className="h-auto py-3 px-4 flex flex-col items-start gap-1 justify-start text-left w-full"
              asChild
            >
              <Link href={act.href}>
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <Icon className="h-4 w-4" />
                  {act.title}
                </div>
                <span className="text-xs text-muted-foreground font-normal line-clamp-1">
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

export default AdminQuickActions;
