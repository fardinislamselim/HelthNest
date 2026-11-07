"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { DoctorScheduleForm } from "./DoctorScheduleForm";
import { useScheduleMutations } from "../hooks/useScheduleMutations";

export function CreateScheduleView() {
  const { createSchedule, isCreating } = useScheduleMutations();

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="gap-1.5 -ml-2 text-xs">
          <Link href="/doctor/schedules">
            <ArrowLeft className="h-4 w-4" />
            Back to Schedules
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Create Consultation Schedule"
        description="Set your available date and hours to automatically generate discrete 20-minute patient booking slots"
      />

      <DoctorScheduleForm onSubmit={createSchedule} isSubmitting={isCreating} />
    </div>
  );
}

export default CreateScheduleView;
