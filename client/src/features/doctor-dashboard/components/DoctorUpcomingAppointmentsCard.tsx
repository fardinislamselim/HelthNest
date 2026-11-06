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
    <Card className="shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold">
            Upcoming Patient Consultations
          </CardTitle>
          <CardDescription>
            Scheduled video calls and consultation details
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
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

