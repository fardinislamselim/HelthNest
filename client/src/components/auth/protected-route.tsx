"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShieldAlert, Clock, Ban, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { LoadingSkeleton } from "@/components/feedback/loading-skeleton";
import { Button } from "@/components/ui/button";
import type { Role } from "@/types/user";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout, isLoggingOut } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
    } else if (!isLoading && isAuthenticated && allowedRoles && user?.role) {
      if (!allowedRoles.includes(user.role)) {
        router.push("/forbidden");
      }
    }
  }, [isLoading, isAuthenticated, user?.role, allowedRoles, router, pathname]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl p-8 space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-72 bg-muted/60 animate-pulse rounded" />
        </div>
        <LoadingSkeleton variant="card" count={3} />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Account Blocked State
  if (user.status === "BLOCKED") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <Ban className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Account Suspended
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Your HealthNest account has been blocked by administrators. Please contact customer support if you believe this is a mistake.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => logout()} variant="outline" disabled={isLoggingOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Doctor Pending Approval State
  if (user.role === "DOCTOR" && user.doctor?.verificationStatus === "PENDING") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 mb-4">
          <Clock className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Application Under Review
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Thank you for applying to HealthNest. Your medical credentials and license are currently being verified by platform administrators. You will be notified by email once approved.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => logout()} variant="outline" disabled={isLoggingOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Doctor Application Rejected State
  if (user.role === "DOCTOR" && user.doctor?.verificationStatus === "REJECTED") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <ShieldAlert className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Application Not Approved
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Your doctor application could not be verified at this time.
          {user.doctor.rejectionReason && (
            <span className="block mt-2 font-medium text-foreground">
              Reason: {user.doctor.rejectionReason}
            </span>
          )}
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => logout()} variant="outline" disabled={isLoggingOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Role Mismatch Check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;

