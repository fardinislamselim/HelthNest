import * as React from "react";
import { CheckCircle2, Activity, XCircle, Users, FileText, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DoctorAnalyticsSummaryCardsProps {
  completionRate: number;
  slotUtilizationRate: number;
  cancellationRate: number;
  totalPatients: number;
  totalPrescriptions: number;
  publishedSchedules: number;
  isLoading?: boolean;
}

export function DoctorAnalyticsSummaryCards({
  completionRate,
  slotUtilizationRate,
  cancellationRate,
  totalPatients,
  totalPrescriptions,
  publishedSchedules,
  isLoading = false,
}: DoctorAnalyticsSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const items = [
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      description: "Successful sessions",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      title: "Slot Utilization",
      value: `${slotUtilizationRate}%`,
      description: "Allocated capacity filled",
      icon: Activity,
      color: "text-blue-600 bg-blue-500/10",
    },
    {
      title: "Cancellation Rate",
      value: `${cancellationRate}%`,
      description: "Patient cancellations",
      icon: XCircle,
      color: "text-rose-600 bg-rose-500/10",
    },
    {
      title: "Unique Patients",
      value: totalPatients.toString(),
      description: "Treated individuals",
      icon: Users,
      color: "text-purple-600 bg-purple-500/10",
    },
    {
      title: "Prescriptions",
      value: totalPrescriptions.toString(),
      description: "Digital Rx issued",
      icon: FileText,
      color: "text-indigo-600 bg-indigo-500/10",
    },
    {
      title: "Active Schedules",
      value: publishedSchedules.toString(),
      description: "Published calendar blocks",
      icon: Calendar,
      color: "text-amber-600 bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {items.map((stat) => {
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

export default DoctorAnalyticsSummaryCards;
