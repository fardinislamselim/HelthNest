"use client";

import * as React from "react";
import { Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PatientSlotItem } from "../types/schedule.types";

interface TimeSlotSelectorProps {
  slots: PatientSlotItem[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: PatientSlotItem) => void;
}

export function TimeSlotSelector({
  slots,
  selectedSlotId,
  onSelectSlot,
}: TimeSlotSelectorProps) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-muted-foreground">
        No consultation slots found for this schedule.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-80 overflow-y-auto p-1">
      {slots.map((slot) => {
        const isSelected = selectedSlotId === slot.id;
        const isAvailable = slot.isAvailable;

        return (
          <button
            key={slot.id}
            type="button"
            disabled={!isAvailable}
            onClick={() => onSelectSlot(slot)}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all select-none relative",
              isAvailable
                ? isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-md ring-2 ring-primary/40 font-semibold"
                  : "border-border bg-card text-foreground hover:border-primary/60 hover:bg-muted/50 active:scale-95"
                : "border-border/40 bg-muted/40 text-muted-foreground/60 cursor-not-allowed opacity-60",
            )}
          >
            {isSelected && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-foreground text-primary">
                <Check className="h-2.5 w-2.5" />
              </span>
            )}
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider mb-1 px-1.5 py-0.5 rounded",
                isSelected
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : isAvailable
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground",
              )}
            >
              Slot #{slot.serialNumber}
            </span>
            <div className="flex items-center gap-1 text-xs font-medium">
              <Clock className="h-3 w-3 shrink-0" />
              <span>{slot.startTime}</span>
            </div>
            <span className="text-[11px] text-muted-foreground/80 mt-0.5">
              to {slot.endTime}
            </span>
            {!isAvailable && (
              <span className="text-[10px] font-semibold text-destructive mt-1">
                Booked
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default TimeSlotSelector;
