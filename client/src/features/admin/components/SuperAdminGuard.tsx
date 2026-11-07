"use client";

import * as React from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { isSuperAdmin } from "../utils/permissions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface SuperAdminGuardProps {
  children: React.ReactNode;
}

export function SuperAdminGuard({ children }: SuperAdminGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!isSuperAdmin(user)) {
    return (
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full border-destructive/30 shadow-md">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Access Restricted</CardTitle>
            <CardDescription>
              Super Administrator privileges are strictly required to manage administrator credentials and platform configuration.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 flex justify-center">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4" /> Return to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
