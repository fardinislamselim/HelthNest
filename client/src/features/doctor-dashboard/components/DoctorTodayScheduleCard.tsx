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

export interface DoctorTodayScheduleCardProps {
  hasScheduleToday?: boolean;
}

export function DoctorTodayScheduleCard({
  hasScheduleToday = false,
}: DoctorTodayScheduleCardProps) {
  const router = useRouter();

  return (
    <Card className="shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold">
            Today&apos;s Consultation Schedule
          </CardTitle>
          <CardDescription>
            Active 20-minute slot availability for patients
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
          <Link href="/doctor/schedules">
            All schedules <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {!hasScheduleToday ? (
          <EmptyState
            title="No schedule published for today"
            description="You don't have any published consultation blocks for today. Create and publish a schedule to allow patients to book 20-min slots."
            icon={Calendar}
            actionLabel="Create New Schedule"
            onAction={() => {
              router.push("/doctor/schedules/create");
            }}
            className="my-1 py-6"
          />
        ) : (
          <div className="space-y-3">
            {/* Populated schedule slots will render here */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DoctorTodayScheduleCard;
