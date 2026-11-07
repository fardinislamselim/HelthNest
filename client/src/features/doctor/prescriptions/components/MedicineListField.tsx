"use client";

import * as React from "react";
import { useFieldArray, Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Plus, Trash2, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreatePrescriptionFormValues } from "../validations/prescription.validation";

interface MedicineListFieldProps {
  control: Control<CreatePrescriptionFormValues>;
  register: UseFormRegister<CreatePrescriptionFormValues>;
  errors: FieldErrors<CreatePrescriptionFormValues>;
  disabled?: boolean;
}

export function MedicineListField({
  control,
  register,
  errors,
  disabled = false,
}: MedicineListFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-sm font-semibold flex items-center gap-1.5">
            <Pill className="h-4 w-4 text-primary" />
            Prescribed Medications <span className="text-destructive">*</span>
          </Label>
          <p className="text-xs text-muted-foreground">
            Prescribe pharmaceutical drugs, dosage, frequencies, and durations.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() =>
            append({
              name: "",
              dosage: "",
              frequency: "",
              duration: "",
              instructions: "",
            })
          }
          className="h-8 text-xs gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Medicine</span>
        </Button>
      </div>

      {errors.medicines?.message && (
        <p className="text-xs text-destructive">{errors.medicines.message}</p>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => {
          const itemErrors = errors.medicines?.[index];

          return (
            <div
              key={field.id}
              className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">
                  Medication #{index + 1}
                </span>

                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={disabled}
                    onClick={() => remove(index)}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    <span>Remove</span>
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Medicine Name */}
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium">
                    Medicine Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Paracetamol"
                    disabled={disabled}
                    className="h-8 text-xs"
                    {...register(`medicines.${index}.name`)}
                  />
                  {itemErrors?.name && (
                    <p className="text-[10px] text-destructive">{itemErrors.name.message}</p>
                  )}
                </div>

                {/* Dosage */}
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium">
                    Dosage <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. 500mg"
                    disabled={disabled}
                    className="h-8 text-xs font-mono"
                    {...register(`medicines.${index}.dosage`)}
                  />
                  {itemErrors?.dosage && (
                    <p className="text-[10px] text-destructive">{itemErrors.dosage.message}</p>
                  )}
                </div>

                {/* Frequency */}
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium">
                    Frequency <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. 1-0-1 or TID"
                    disabled={disabled}
                    className="h-8 text-xs"
                    {...register(`medicines.${index}.frequency`)}
                  />
                  {itemErrors?.frequency && (
                    <p className="text-[10px] text-destructive">{itemErrors.frequency.message}</p>
                  )}
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium">
                    Duration <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. 5 days"
                    disabled={disabled}
                    className="h-8 text-xs"
                    {...register(`medicines.${index}.duration`)}
                  />
                  {itemErrors?.duration && (
                    <p className="text-[10px] text-destructive">{itemErrors.duration.message}</p>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-1">
                <Label className="text-[11px] font-medium">
                  Intake Instructions (Optional)
                </Label>
                <Input
                  placeholder="e.g. Take orally after food with a full glass of water"
                  disabled={disabled}
                  className="h-8 text-xs"
                  {...register(`medicines.${index}.instructions`)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MedicineListField;
