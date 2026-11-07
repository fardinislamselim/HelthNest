import * as React from "react";
import { Calendar, Users, Clock, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface DoctorDashboardStatsProps {
  todayAppointmentsCount?: number;
  activeSchedulesCount?: number;
  totalConsultationsCount?: number;
  totalEarnings?: number;
}

export function DoctorDashboardStats({
  todayAppointmentsCount = 0,
  activeSchedulesCount = 0,
  totalConsultationsCount = 0,
  totalEarnings = 0,
}: DoctorDashboardStatsProps) {
  const stats = [
    {
      title: "Today's Consultations",
      value: todayAppointmentsCount,
      icon: Clock,
      description: "Booked 20-min patient slots",
    },
    {
      title: "Published Schedules",
      value: activeSchedulesCount,
      icon: Calendar,
      description: "Active consultation blocks",
    },
    {
      title: "Completed Patients",
      value: totalConsultationsCount,
      icon: Users,
      description: "Total consultations delivered",
    },
    {
      title: "Estimated Earnings",
      value: `$${totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      description: "Net consultation revenue",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="shadow-xs min-w-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 gap-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                {stat.title}
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
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
