import * as React from "react";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";

export interface DoctorUpcomingAppointmentsCardProps {
  hasAppointments?: boolean;
}

export function DoctorUpcomingAppointmentsCard({
  hasAppointments = false,
}: DoctorUpcomingAppointmentsCardProps) {
  return (
    <Card className="shadow-xs min-w-0">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3">
        <div className="min-w-0">
          <CardTitle className="text-base font-semibold truncate">
            Upcoming Patient Consultations
          </CardTitle>
          <CardDescription className="text-xs">
            Scheduled video calls and consultation details
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-xs self-start sm:self-auto shrink-0">
          <Link href="/doctor/appointments">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {!hasAppointments ? (
          <EmptyState
            title="No appointments booked yet"
            description="When patients book your published 20-minute slots, their appointment information will be listed here."
            icon={Users}
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

export default DoctorUpcomingAppointmentsCard;

