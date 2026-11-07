"use client";

import * as React from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTodaySchedules } from "@/features/patient/schedules/hooks/useTodaySchedules";
import { useBookingFlow } from "@/features/patient/booking/hooks/useBookingFlow";
import {
  TodayScheduleFilters,
  DoctorScheduleList,
  ScheduleSlotModal,
} from "./index";
import { BookingReviewCard } from "@/features/patient/booking/components";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import type {
  PatientScheduleItem,
  PatientSlotItem,
} from "@/features/patient/schedules/types/schedule.types";
import type { BookingSelection } from "@/features/patient/booking/types/booking.types";

export function PatientSchedulesView() {
  const { user } = useAuth();
  const { schedules, isLoading, isError, error, refetch } = useTodaySchedules();
  const { initiateBooking, isBooking } = useBookingFlow();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSpecialization, setSelectedSpecialization] = React.useState("");
  const [activeSchedule, setActiveSchedule] = React.useState<PatientScheduleItem | null>(null);
  const [isSlotModalOpen, setIsSlotModalOpen] = React.useState(false);
  const [pendingBooking, setPendingBooking] = React.useState<BookingSelection | null>(null);

  // Derive unique specializations from schedules
  const specializations = React.useMemo(() => {
    const set = new Set<string>();
    schedules.forEach((s) => {
      if (s.doctor.specialization) set.add(s.doctor.specialization);
    });
    return Array.from(set).sort();
  }, [schedules]);

  // Filter schedules based on search and specialization
  const filteredSchedules = React.useMemo(() => {
    return schedules.filter((s) => {
      const matchesSearch =
        searchQuery === "" ||
        s.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.doctor.qualifications.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpec =
        selectedSpecialization === "" ||
        s.doctor.specialization.toLowerCase() === selectedSpecialization.toLowerCase();

      return matchesSearch && matchesSpec;
    });
  }, [schedules, searchQuery, selectedSpecialization]);

  const handleOpenSlotModal = (schedule: PatientScheduleItem) => {
    setActiveSchedule(schedule);
    setIsSlotModalOpen(true);
  };

  const handleProceedToBooking = (
    schedule: PatientScheduleItem,
    slot: PatientSlotItem,
  ) => {
    setIsSlotModalOpen(false);
    setPendingBooking({ schedule, slot });
  };

  const handleConfirmAndPay = async () => {
    if (!pendingBooking) return;
    await initiateBooking({
      scheduleId: pendingBooking.schedule.id,
      slotId: pendingBooking.slot.id,
    });
  };

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
        description="Browse certified doctors with published 20-minute consultation schedules for today"
      />

      {isError ? (
        <ErrorState
          title="Failed to load today's schedules"
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
          />

          <DoctorScheduleList
            schedules={filteredSchedules}
            isLoading={isLoading}
            onSelectSchedule={handleOpenSlotModal}
          />

          <ScheduleSlotModal
            schedule={activeSchedule}
            open={isSlotModalOpen}
            onClose={() => setIsSlotModalOpen(false)}
            onProceedToBooking={handleProceedToBooking}
          />
        </>
      )}
    </div>
  );
}

export default PatientSchedulesView;
