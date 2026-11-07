"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { CreatePrescriptionForm } from "./CreatePrescriptionForm";
import { useCreatePrescription } from "../hooks/useCreatePrescription";
import { doctorAppointmentService } from "@/features/doctor/appointments/services/appointment.service";

export function CreatePrescriptionView() {
  const searchParams = useSearchParams();
  const appointmentIdParam = searchParams.get("appointmentId") || undefined;

  const { createPrescription, isCreating } = useCreatePrescription();

  const { data: completedAptsData } = useQuery({
    queryKey: ["doctor", "appointments", "completed-for-rx"],
    queryFn: async () => {
      const res = await doctorAppointmentService.getMyAppointments({
        status: "COMPLETED",
        limit: 50,
      });
      return res.data.appointments;
    },
    staleTime: 60 * 1000,
  });

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="gap-1.5 -ml-2 text-xs">
          <Link href="/doctor/prescriptions">
            <ArrowLeft className="h-4 w-4" />
            Back to Prescriptions
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Issue Medical Prescription"
        description="Prescribe medications, enter clinical findings, and generate verifiable digital PDF prescriptions"
      />

      <CreatePrescriptionForm
        initialAppointmentId={appointmentIdParam}
        completedAppointments={completedAptsData || []}
        onSubmit={createPrescription}
        isSubmitting={isCreating}
      />
    </div>
  );
}

export default CreatePrescriptionView;
