import * as React from "react";
import Link from "next/link";
import { Search, Calendar, FileText, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PatientQuickActions() {
  const actions = [
    {
      title: "Book Consultation",
      description: "Search verified doctors and reserve a 20-min slot",
      href: "/dashboard/appointments/book",
      icon: Search,
      variant: "default" as const,
    },
    {
      title: "View Appointments",
      description: "Review your upcoming meetings and past visits",
      href: "/dashboard/appointments",
      icon: Calendar,
      variant: "outline" as const,
    },
    {
      title: "Digital Prescriptions",
      description: "Download clinical PDFs and medication directions",
      href: "/dashboard/prescriptions",
      icon: FileText,
      variant: "outline" as const,
    },
    {
      title: "Profile & History",
      description: "Update personal contact details and records",
      href: "/dashboard/profile",
      icon: User,
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

export default PatientQuickActions;
