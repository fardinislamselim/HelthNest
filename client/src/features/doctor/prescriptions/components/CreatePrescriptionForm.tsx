"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, FileText, Stethoscope, AlertCircle, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MedicineListField } from "./MedicineListField";
import {
  createPrescriptionSchema,
  type CreatePrescriptionFormValues,
} from "../validations/prescription.validation";
import type { DoctorAppointmentItem } from "@/features/doctor/appointments/types/appointment.types";

interface CreatePrescriptionFormProps {
  initialAppointmentId?: string;
  completedAppointments?: DoctorAppointmentItem[];
  onSubmit: (values: CreatePrescriptionFormValues) => Promise<unknown>;
  isSubmitting?: boolean;
}

export function CreatePrescriptionForm({
  initialAppointmentId,
  completedAppointments = [],
  onSubmit,
  isSubmitting = false,
}: CreatePrescriptionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePrescriptionFormValues>({
    resolver: zodResolver(createPrescriptionSchema),
    defaultValues: {
      appointmentId: initialAppointmentId || (completedAppointments[0]?.id ?? ""),
      keyFindings: "",
      medicines: [
        {
          name: "",
          dosage: "500mg",
          frequency: "Twice daily",
          duration: "5 days",
          instructions: "Take after meals",
        },
      ],
      additionalInstructions: "",
    },
  });

  return (
    <Card className="shadow-xs max-w-3xl mx-auto">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">
            Issue Digital Medical Prescription
          </CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          Prescriptions can only be created for completed consultations. The generated PDF will be instantly accessible to the patient.
        </p>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pt-5">
          {/* Appointment Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="appointmentId" className="text-xs font-semibold flex items-center gap-1.5">
              <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" />
              Completed Consultation <span className="text-destructive">*</span>
            </Label>
            {completedAppointments.length > 0 ? (
              <select
                id="appointmentId"
                disabled={isSubmitting}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                {...register("appointmentId")}
              >
                {completedAppointments.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    {apt.patient?.name || "Patient"} • {apt.schedule?.date} ({apt.slot?.startTime} - {apt.slot?.endTime})
                  </option>
                ))}
              </select>
            ) : initialAppointmentId ? (
              <input
                type="hidden"
                value={initialAppointmentId}
                {...register("appointmentId")}
              />
            ) : (
              <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>No eligible completed appointments found. Complete a consultation first before prescribing.</span>
              </div>
            )}
            {errors.appointmentId && (
              <p className="text-xs text-destructive">{errors.appointmentId.message}</p>
            )}
          </div>

          {/* Clinical Findings & Diagnosis */}
          <div className="space-y-1.5">
            <Label htmlFor="keyFindings" className="text-xs font-semibold flex items-center gap-1.5">
              Clinical Findings &amp; Primary Diagnosis <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="keyFindings"
              rows={3}
              placeholder="e.g. Acute upper respiratory tract infection. Mild pharyngeal congestion without tonsillar exudates. Lungs clear to auscultation."
              disabled={isSubmitting}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              {...register("keyFindings")}
            />
            {errors.keyFindings && (
              <p className="text-xs text-destructive">{errors.keyFindings.message}</p>
            )}
          </div>

          {/* Dynamic Medicines List */}
          <MedicineListField
            control={control}
            register={register}
            errors={errors}
            disabled={isSubmitting}
          />

          {/* Additional Advice & Instructions */}
          <div className="space-y-1.5">
            <Label htmlFor="additionalInstructions" className="text-xs font-semibold">
              Additional Clinical Advice &amp; Lifestyle Guidance (Optional)
            </Label>
            <textarea
              id="additionalInstructions"
              rows={2}
              placeholder="e.g. Ensure adequate hydration, bed rest for 48 hours, return for re-evaluation if fever persists beyond 3 days."
              disabled={isSubmitting}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              {...register("additionalInstructions")}
            />
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Info className="h-3.5 w-3.5 shrink-0" />
              <span>This guidance will be printed on the official digital prescription PDF.</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-40 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Rx PDF...
              </>
            ) : (
              "Issue & Sign Prescription"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default CreatePrescriptionForm;
