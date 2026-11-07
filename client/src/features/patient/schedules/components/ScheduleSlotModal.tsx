"use client";

import * as React from "react";
import { X, Calendar, DollarSign, Clock, ArrowRight, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useScheduleSlots } from "../hooks/useScheduleSlots";
import { TimeSlotSelector } from "./TimeSlotSelector";
import type {
  PatientScheduleItem,
  PatientSlotItem,
} from "../types/schedule.types";

interface ScheduleSlotModalProps {
  schedule: PatientScheduleItem | null;
  open: boolean;
  onClose: () => void;
  onProceedToBooking: (
    schedule: PatientScheduleItem,
    slot: PatientSlotItem,
  ) => void;
}

export function ScheduleSlotModal({
  schedule,
  open,
  onClose,
  onProceedToBooking,
}: ScheduleSlotModalProps) {
  const { slotsData, isLoading } = useScheduleSlots(
    open && schedule ? schedule.id : null,
  );
  const [prevScheduleId, setPrevScheduleId] = React.useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = React.useState<PatientSlotItem | null>(null);

  if (schedule?.id !== prevScheduleId) {
    setPrevScheduleId(schedule?.id ?? null);
    setSelectedSlot(null);
  }

  // Prevent background scrolling while modal is open
  React.useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !schedule) return null;

  const doctor = schedule.doctor;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-50 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card p-4 sm:p-6 shadow-2xl space-y-4 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/60 pb-3 gap-2">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground flex items-center gap-2 truncate">
              <Stethoscope className="h-5 w-5 text-primary shrink-0" />
              <span>Choose 20-Min Slot</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              Select an available time slot with Dr. {doctor.name} ({doctor.specialization})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground shrink-0"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Schedule Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-lg bg-muted/40 border border-border/60 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="font-medium text-foreground">{schedule.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="font-medium text-foreground">
              {schedule.startTime} - {schedule.endTime}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground sm:justify-end">
            <DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-bold text-foreground">
              ${Number(doctor.consultationFee || 0).toFixed(2)} Fee
            </span>
          </div>
        </div>

        {/* Slot Grid or Loading */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Available Slots
          </h4>
          {isLoading ? (
            <div className="flex h-44 items-center justify-center">
              <LoadingSpinner size="md" label="Loading 20-min slots..." />
            </div>
          ) : (
            <TimeSlotSelector
              slots={slotsData?.slots ?? []}
              selectedSlotId={selectedSlot?.id ?? null}
              onSelectSlot={(slot) => setSelectedSlot(slot)}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border/60 pt-3">
          <div className="text-xs text-muted-foreground truncate">
            {selectedSlot ? (
              <span className="text-foreground font-semibold">
                Selected: Slot #{selectedSlot.serialNumber} ({selectedSlot.startTime} – {selectedSlot.endTime})
              </span>
            ) : (
              "Please select a slot to continue"
            )}
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="w-full sm:w-auto text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!selectedSlot}
              onClick={() => {
                if (selectedSlot) {
                  onProceedToBooking(schedule, selectedSlot);
                }
              }}
              className="w-full sm:w-auto gap-2 shadow-xs text-xs whitespace-nowrap"
            >
              Continue to Review <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduleSlotModal;
