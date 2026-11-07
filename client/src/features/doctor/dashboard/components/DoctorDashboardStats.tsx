import * as React from "react";
import { Clock, Calendar, CheckCircle2, Users, FileText, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  DoctorDashboardAppointmentsSummary,
  DoctorDashboardSchedulesSummary,
} from "../types/dashboard.types";

export interface DoctorDashboardStatsProps {
  appointments?: DoctorDashboardAppointmentsSummary;
  schedules?: DoctorDashboardSchedulesSummary;
  totalPrescriptions?: number;
  totalPatients?: number;
  isLoading?: boolean;
}

export function DoctorDashboardStats({
  appointments,
  schedules,
  totalPrescriptions = 0,
  totalPatients = 0,
  isLoading = false,
}: DoctorDashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16 mb-2" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Today's Visits",
      value: appointments?.today ?? 0,
      icon: Clock,
      description: "Consultations scheduled today",
      color: "text-blue-600 bg-blue-500/10",
    },
    {
      title: "Active Bookings",
      value: (appointments?.booked ?? 0) + (appointments?.ongoing ?? 0),
      icon: Calendar,
      description: `${appointments?.ongoing ?? 0} in progress`,
      color: "text-amber-600 bg-amber-500/10",
    },
    {
      title: "Completed",
      value: appointments?.completed ?? 0,
      icon: CheckCircle2,
      description: "Consultations finished",
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      title: "Published Schedules",
      value: schedules?.published ?? 0,
      icon: Activity,
      description: `${schedules?.totalSlots ?? 0} total 20m slots`,
      color: "text-purple-600 bg-purple-500/10",
    },
    {
      title: "Unique Patients",
      value: totalPatients,
      icon: Users,
      description: "Treated individuals",
      color: "text-cyan-600 bg-cyan-500/10",
    },
    {
      title: "Prescriptions",
      value: totalPrescriptions,
      icon: FileText,
      description: "Digital Rx issued",
      color: "text-indigo-600 bg-indigo-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="shadow-xs min-w-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 gap-2">
              <CardTitle className="text-xs font-medium text-muted-foreground truncate">
                {stat.title}
              </CardTitle>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${stat.color}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold tracking-tight truncate">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default DoctorDashboardStats;
