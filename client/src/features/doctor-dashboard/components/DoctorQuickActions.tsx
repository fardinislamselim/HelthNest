import * as React from "react";
import Link from "next/link";
import { PlusCircle, Calendar, Users, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DoctorQuickActions() {
  const actions = [
    {
      title: "Create Schedule",
      description: "Define consultation time windows & generate 20-min slots",
      href: "/doctor/schedules/create",
      icon: PlusCircle,
      variant: "default" as const,
    },
    {
      title: "My Schedules",
      description: "Manage draft, published, and unpublished schedules",
      href: "/doctor/schedules",
      icon: Calendar,
      variant: "outline" as const,
    },
    {
      title: "Patient Appointments",
      description: "Review patient history and start video sessions",
      href: "/doctor/appointments",
      icon: Users,
      variant: "outline" as const,
    },
    {
      title: "Prescription Records",
      description: "View issued prescriptions and clinical summaries",
      href: "/doctor/prescriptions",
      icon: FileText,
      variant: "outline" as const,
    },
  ];

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
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

export default DoctorQuickActions;
