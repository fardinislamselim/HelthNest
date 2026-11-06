import * as React from "react";
import { format } from "date-fns";
import { ShieldAlert } from "lucide-react";

export interface AdminDashboardHeaderProps {
  adminName?: string;
  role?: string;
}

export function AdminDashboardHeader({
  adminName = "Administrator",
  role = "ADMIN",
}: AdminDashboardHeaderProps) {
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border/60">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Platform Administration
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Logged in as {adminName} ({role}) • Review medical practitioner credentials, oversee appointments, and audit platform security.
        </p>
      </div>
      <div className="text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border border-border/50 self-start sm:self-auto">
        Today: {today}
      </div>
    </div>
  );
}

export default AdminDashboardHeader;

