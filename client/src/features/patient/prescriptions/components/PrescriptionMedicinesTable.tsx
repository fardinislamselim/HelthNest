"use client";

import * as React from "react";
import { Pill } from "lucide-react";
import type { MedicineItem } from "../types/prescription.types";

interface PrescriptionMedicinesTableProps {
  medicines: MedicineItem[];
}

export function PrescriptionMedicinesTable({
  medicines,
}: PrescriptionMedicinesTableProps) {
  if (medicines.length === 0) {
    return (
      <p className="text-xs text-muted-foreground italic">
        No specific pharmaceutical medications prescribed.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-border/70 overflow-hidden bg-card text-xs">
      <div className="overflow-x-auto min-w-full">
        <table className="w-full text-left min-w-[500px]">
          <thead className="bg-muted/50 border-b border-border/70 text-[11px] font-semibold text-muted-foreground uppercase">
            <tr>
              <th className="py-2.5 px-3">Medicine</th>
              <th className="py-2.5 px-3">Dosage</th>
              <th className="py-2.5 px-3">Frequency</th>
              <th className="py-2.5 px-3">Duration</th>
              <th className="py-2.5 px-3">Instructions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {medicines.map((med, idx) => (
              <tr key={idx} className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-bold text-foreground flex items-center gap-1.5 whitespace-nowrap">
                  <Pill className="h-3.5 w-3.5 text-primary shrink-0" />
                  {med.medicineName}
                </td>
                <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">{med.dosage}</td>
                <td className="py-2.5 px-3 font-medium text-foreground whitespace-nowrap">{med.frequency}</td>
                <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">{med.duration}</td>
                <td className="py-2.5 px-3 text-muted-foreground italic">
                  {med.instructions || "As directed"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PrescriptionMedicinesTable;
