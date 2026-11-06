import * as React from "react";
import { Stethoscope } from "lucide-react";

export function DoctorApplyHeader() {
  return (
    <div className="text-center space-y-2 mb-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-2 shadow-xs">
        <Stethoscope className="h-7 w-7" aria-hidden="true" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        Apply as a Medical Practitioner
      </h1>
      <p className="max-w-xl mx-auto text-muted-foreground text-sm sm:text-base">
        Join the HealthNest network to conduct 20-minute video consultations,
        publish flexible schedules, and manage clinical prescriptions digitally.
      </p>
    </div>
  );
}

export default DoctorApplyHeader;

