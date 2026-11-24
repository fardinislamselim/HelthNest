"use client";

import * as React from "react";
import { Clock, Calendar, Sparkles } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTodaySchedules } from "@/features/patient/schedules/hooks/useTodaySchedules";
import { useUpcomingSchedules } from "@/features/patient/schedules/hooks/useUpcomingSchedules";
import { useBookingFlow } from "@/features/patient/booking/hooks/useBookingFlow";
import { TodayScheduleFilters } from "./TodayScheduleFilters";
import { DoctorScheduleList } from "./DoctorScheduleList";
import { ScheduleSlotModal } from "./ScheduleSlotModal";
import { BookingReviewCard } from "@/features/patient/booking/components";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type {
  PatientScheduleItem,
  PatientSlotItem,
} from "@/features/patient/schedules/types/schedule.types";
import type { BookingSelection } from "@/features/patient/booking/types/booking.types";

export function PatientSchedulesView() {
  const { user } = useAuth();
  const [scheduleScope, setScheduleScope] = React.useState<"today" | "upcoming">("today");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSpecialization, setSelectedSpecialization] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState("");
  const [activeSchedule, setActiveSchedule] = React.useState<PatientScheduleItem | null>(null);
  const [isSlotModalOpen, setIsSlotModalOpen] = React.useState(false);
  const [pendingBooking, setPendingBooking] = React.useState<BookingSelection | null>(null);

  const upcomingFilterParams = React.useMemo(
    () => ({
      startDate: selectedDate || undefined,
      specialization: selectedSpecialization || undefined,
    }),
    [selectedDate, selectedSpecialization],
  );

  const todayQuery = useTodaySchedules();
  const upcomingQuery = useUpcomingSchedules(upcomingFilterParams);

  const isUpcoming = scheduleScope === "upcoming";
  const currentQuery = isUpcoming ? upcomingQuery : todayQuery;
  const schedules = currentQuery.schedules;
  const isLoading = currentQuery.isLoading;
  const isError = currentQuery.isError;
  const error = currentQuery.error;
  const refetch = currentQuery.refetch;

  const { initiateBooking, isBooking } = useBookingFlow();

  // Derive unique specializations from current schedules
  const specializations = React.useMemo(() => {
    const set = new Set<string>();
    schedules.forEach((s) => {
      if (s?.doctor?.specialization) set.add(s.doctor.specialization);
    });
    return Array.from(set).sort();
  }, [schedules]);

  // Filter schedules based on search and specialization (and date if in upcoming mode without server date query)
  const filteredSchedules = React.useMemo(() => {
    return schedules.filter((s) => {
      if (!s?.doctor) return false;
      const doctorName = s.doctor.name || "";
      const doctorSpec = s.doctor.specialization || "";
      const doctorQual = s.doctor.qualifications || "";

      const matchesSearch =
        searchQuery === "" ||
        doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctorSpec.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctorQual.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpec =
        selectedSpecialization === "" ||
        doctorSpec.toLowerCase() === selectedSpecialization.toLowerCase();

      const matchesDate =
        !isUpcoming ||
        selectedDate === "" ||
        s.date === selectedDate;

      return matchesSearch && matchesSpec && matchesDate;
    });
  }, [schedules, searchQuery, selectedSpecialization, isUpcoming, selectedDate]);

  const handleCloseSlotModal = React.useCallback(() => {
    setIsSlotModalOpen(false);
  }, []);

  const handleOpenSlotModal = React.useCallback((schedule: PatientScheduleItem) => {
    setActiveSchedule(schedule);
    setIsSlotModalOpen(true);
  }, []);

  const handleProceedToBooking = React.useCallback((
    schedule: PatientScheduleItem,
    slot: PatientSlotItem,
  ) => {
    setIsSlotModalOpen(false);
    setPendingBooking({ schedule, slot });
  }, []);

  const handleConfirmAndPay = React.useCallback(async () => {
    if (!pendingBooking) return;
    await initiateBooking({
      scheduleId: pendingBooking.schedule.id,
      slotId: pendingBooking.slot.id,
    });
  }, [pendingBooking, initiateBooking]);

  const handleResetFilters = React.useCallback(() => {
    setSearchQuery("");
    setSelectedSpecialization("");
    setSelectedDate("");
  }, []);

  // If in review mode, show the BookingReviewCard
  if (pendingBooking && user) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Confirm Consultation"
          description="Final review before proceeding to secure payment"
        />
        <BookingReviewCard
          booking={pendingBooking}
          currentUser={user}
          onBack={() => setPendingBooking(null)}
          onConfirm={handleConfirmAndPay}
          isSubmitting={isBooking}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Book Doctor Consultation"
        description={
          isUpcoming
            ? "Browse upcoming doctor consultation schedules across future dates and select a 20-minute slot"
            : "Browse certified doctors with published 20-minute consultation schedules for today"
        }
      />

      {/* Scope Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={!isUpcoming ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setScheduleScope("today");
              handleResetFilters();
            }}
            className="gap-2 text-xs h-9"
          >
            <Clock className="h-4 w-4" />
            <span>Today&apos;s Schedules</span>
            {todayQuery.schedules.length > 0 && (
              <Badge
                variant={!isUpcoming ? "secondary" : "outline"}
                className="ml-1 h-5 px-1.5 text-[10px]"
              >
                {todayQuery.schedules.length}
              </Badge>
            )}
          </Button>

          <Button
            type="button"
            variant={isUpcoming ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setScheduleScope("upcoming");
              handleResetFilters();
            }}
            className="gap-2 text-xs h-9"
          >
            <Calendar className="h-4 w-4" />
            <span>All Upcoming Schedules</span>
            {upcomingQuery.schedules.length > 0 && (
              <Badge
                variant={isUpcoming ? "secondary" : "outline"}
                className="ml-1 h-5 px-1.5 text-[10px]"
              >
                {upcomingQuery.schedules.length}
              </Badge>
            )}
          </Button>
        </div>

        {isUpcoming && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Book appointments in advance for any upcoming calendar day</span>
          </div>
        )}
      </div>

      {isError ? (
        <ErrorState
          title={
            isUpcoming
              ? "Failed to load upcoming schedules"
              : "Failed to load today's schedules"
          }
          message={error?.message || "Could not retrieve doctor schedules from the server."}
          onRetry={() => refetch()}
          className="my-8"
        />
      ) : (
        <>
          <TodayScheduleFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedSpecialization={selectedSpecialization}
            onSpecializationChange={setSelectedSpecialization}
            specializations={specializations}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            isUpcoming={isUpcoming}
            onReset={handleResetFilters}
          />

          <DoctorScheduleList
            schedules={filteredSchedules}
            isLoading={isLoading}
            onSelectSchedule={handleOpenSlotModal}
            emptyTitle={
              isUpcoming
                ? "No Upcoming Schedules Found"
                : "No Available Schedules Today"
            }
            emptyDescription={
              isUpcoming
                ? "There are currently no doctor consultation schedules published for the selected upcoming filters. Please check another date or specialization."
                : "There are currently no doctors with published open schedules remaining for today. Schedules open daily before their consultation start time."
            }
          />

          {isSlotModalOpen && activeSchedule && (
            <ScheduleSlotModal
              key={activeSchedule.id}
              schedule={activeSchedule}
              open={isSlotModalOpen}
              onClose={handleCloseSlotModal}
              onProceedToBooking={handleProceedToBooking}
            />
          )}
        </>
      )}
    </div>
  );
}

export default PatientSchedulesView;
