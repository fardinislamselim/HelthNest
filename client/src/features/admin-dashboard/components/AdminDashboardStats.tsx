import * as React from "react";
import { Users, Stethoscope, Calendar, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface AdminDashboardStatsProps {
  pendingDoctorsCount?: number;
  totalDoctorsCount?: number;
  totalPatientsCount?: number;
  totalRevenue?: number;
}

export function AdminDashboardStats({
  pendingDoctorsCount = 0,
  totalDoctorsCount = 0,
  totalPatientsCount = 0,
  totalRevenue = 0,
}: AdminDashboardStatsProps) {
  const stats = [
    {
      title: "Pending Approvals",
      value: pendingDoctorsCount,
      icon: Stethoscope,
      description: "Practitioner applications requiring review",
    },
    {
      title: "Verified Doctors",
      value: totalDoctorsCount,
      icon: Users,
      description: "Active practicing specialists",
    },
    {
      title: "Registered Patients",
      value: totalPatientsCount,
      icon: Calendar,
      description: "Total platform consultations booked",
    },
    {
      title: "Platform Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "Total Stripe billing volume",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default AdminDashboardStats;

