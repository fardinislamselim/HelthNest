import * as React from "react";
import { Calendar, FileText, Clock, CreditCard } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface PatientDashboardStatsProps {
  upcomingCount?: number;
  completedCount?: number;
  prescriptionsCount?: number;
  paymentsCount?: number;
}

export function PatientDashboardStats({
  upcomingCount = 0,
  completedCount = 0,
  prescriptionsCount = 0,
  paymentsCount = 0,
}: PatientDashboardStatsProps) {
  const stats = [
    {
      title: "Upcoming Consultations",
      value: upcomingCount,
      icon: Calendar,
      description: "Scheduled video sessions",
    },
    {
      title: "Completed Visits",
      value: completedCount,
      icon: Clock,
      description: "Past consultations",
    },
    {
      title: "Digital Prescriptions",
      value: prescriptionsCount,
      icon: FileText,
      description: "Doctor instructions & Rx",
    },
    {
      title: "Billing Invoices",
      value: paymentsCount,
      icon: CreditCard,
      description: "Receipts & transactions",
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

export default PatientDashboardStats;

