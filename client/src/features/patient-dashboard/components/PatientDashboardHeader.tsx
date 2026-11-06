import * as React from "react";
import { format } from "date-fns";

export interface PatientDashboardHeaderProps {
  userName?: string;
}

export function PatientDashboardHeader({
  userName = "Patient",
}: PatientDashboardHeaderProps) {
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-6 border-b border-border/60">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {userName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your appointments, prescriptions, and health consultation records.
        </p>
      </div>
      <div className="text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border border-border/50 self-start sm:self-auto">
        Today: {today}
      </div>
    </div>
  );
}

export default PatientDashboardHeader;

