"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Video,
  Info,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createScheduleSchema,
  calculateExpectedSlots,
  timeToMinutes,
  type CreateScheduleFormValues,
} from "../validations/schedule.validation";

interface DoctorScheduleFormProps {
  onSubmit: (values: CreateScheduleFormValues) => Promise<unknown>;
  isSubmitting?: boolean;
}

export function DoctorScheduleForm({
  onSubmit,
  isSubmitting = false,
}: DoctorScheduleFormProps) {
  const todayDateStr = format(new Date(), "yyyy-MM-dd");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateScheduleFormValues>({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: {
      date: todayDateStr,
      startTime: "09:00",
      endTime: "13:00",
      meetLink: "https://meet.google.com/",
    },
  });

  const watchedStartTime = useWatch({ control, name: "startTime" });
  const watchedEndTime = useWatch({ control, name: "endTime" });

  const calculatedSlots = React.useMemo(() => {
    return calculateExpectedSlots(watchedStartTime || "", watchedEndTime || "");
  }, [watchedStartTime, watchedEndTime]);

  const durationMinutes = React.useMemo(() => {
    if (!watchedStartTime || !watchedEndTime) return 0;
    try {
      const start = timeToMinutes(watchedStartTime);
      const end = timeToMinutes(watchedEndTime);
      return end > start ? end - start : 0;
    } catch {
      return 0;
    }
  }, [watchedStartTime, watchedEndTime]);

  const durationHours = (durationMinutes / 60).toFixed(1);
  const isDurationValid = durationMinutes >= 180 && durationMinutes <= 480;

  return (
    <Card className="shadow-xs max-w-2xl mx-auto">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">
            Create Consultation Schedule
          </CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          Schedules are saved as <strong className="text-foreground">DRAFT</strong>. You can review all 20-minute slots before publishing to patients.
        </p>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-5 pt-5">
          {/* Schedule Date */}
          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-xs font-medium flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              Schedule Calendar Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              min={todayDateStr}
              disabled={isSubmitting}
              className="text-sm"
              {...register("date")}
            />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date.message}</p>
            )}
            <p className="text-[11px] text-muted-foreground">
              You can only create one schedule per calendar date.
            </p>
          </div>

          {/* Time Window Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startTime" className="text-xs font-medium flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                Start Time (24h) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startTime"
                type="time"
                disabled={isSubmitting}
                className="text-sm font-mono"
                {...register("startTime")}
              />
              {errors.startTime && (
                <p className="text-xs text-destructive">{errors.startTime.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="endTime" className="text-xs font-medium flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                End Time (24h) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="endTime"
                type="time"
                disabled={isSubmitting}
                className="text-sm font-mono"
                {...register("endTime")}
              />
              {errors.endTime && (
                <p className="text-xs text-destructive">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          {/* Real-time Slot & Duration Calculation Preview Card */}
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Automatic 20-Minute Slot Generation</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                3 to 8 hours required
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-background/80 p-2.5 rounded-lg border border-border/50">
                <span className="text-[11px] text-muted-foreground">Total Window</span>
                <p className="text-base font-bold text-foreground">
                  {durationHours} hrs ({durationMinutes} mins)
                </p>
              </div>

              <div className="bg-background/80 p-2.5 rounded-lg border border-border/50">
                <span className="text-[11px] text-muted-foreground">Generated Slots</span>
                <p className="text-base font-bold text-primary">
                  {calculatedSlots} Patient Slots
                </p>
              </div>
            </div>

            {isDurationValid ? (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>Valid window. Exactly {calculatedSlots} discrete 20-minute slots will be created.</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-medium">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {durationMinutes < 180
                    ? `Window is too short (${durationMinutes}m). Must be at least 180m (3h).`
                    : `Window exceeds 8 hours (${durationMinutes}m). Max allowed is 480m (8h).`}
                </span>
              </div>
            )}
          </div>

          {/* Meeting Video Room URL */}
          <div className="space-y-1.5">
            <Label htmlFor="meetLink" className="text-xs font-medium flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5 text-muted-foreground" />
              Telehealth Video Room URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="meetLink"
              type="url"
              placeholder="https://meet.google.com/xyz-abcd-efg"
              disabled={isSubmitting}
              className="text-sm font-mono"
              {...register("meetLink")}
            />
            {errors.meetLink && (
              <p className="text-xs text-destructive">{errors.meetLink.message}</p>
            )}
            <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>
                Provide your Google Meet or preferred WebRTC video consultation room. Patients will receive this room link once their appointment is confirmed.
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
          <Button
            type="submit"
            disabled={!isDurationValid || isSubmitting}
            className="min-w-36"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Slots...
              </>
            ) : (
              "Save as Draft Schedule"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default DoctorScheduleForm;
