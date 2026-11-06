"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";

export interface UpcomingAppointmentsCardProps {
  hasAppointments?: boolean;
}

export function UpcomingAppointmentsCard({
  hasAppointments = false,
}: UpcomingAppointmentsCardProps) {
  const router = useRouter();

  return (
    <Card className="shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold">
            Upcoming Consultations
          </CardTitle>
          <CardDescription>
            Your scheduled 20-minute video meetings
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
          <Link href="/dashboard/appointments">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {!hasAppointments ? (
          <EmptyState
            title="No upcoming appointments"
            description="You don't have any consultation booked for today or the upcoming days."
            icon={Calendar}
            actionLabel="Find a Doctor & Book Slot"
            onAction={() => {
              router.push("/dashboard/appointments/book");
            }}
            className="my-1 py-6"
          />
        ) : (
          <div className="space-y-3">
            {/* Populated appointments will render here */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UpcomingAppointmentsCard;
