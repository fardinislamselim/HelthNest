import * as React from "react";
import { format } from "date-fns";
import { Stethoscope } from "lucide-react";

export interface DoctorDashboardHeaderProps {
  doctorName?: string;
  specialization?: string;
}

export function DoctorDashboardHeader({
  doctorName = "Doctor",
  specialization,
}: DoctorDashboardHeaderProps) {
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border/60">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Dr. {doctorName}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {specialization ? `${specialization} Practitioner • ` : ""}
          Manage consultation schedules, 20-minute patient slots, and digital prescriptions.
        </p>
      </div>
      <div className="text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border border-border/50 self-start sm:self-auto">
        Today: {today}
      </div>
    </div>
  );
}

export default DoctorDashboardHeader;

