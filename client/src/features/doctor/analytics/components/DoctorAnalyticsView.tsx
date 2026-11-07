"use client";

import * as React from "react";
import { useDoctorAnalytics } from "../hooks/useDoctorAnalytics";
import { DoctorAnalyticsSummaryCards } from "./DoctorAnalyticsSummaryCards";
import { DoctorConsultationStatusCard } from "./DoctorConsultationStatusCard";
import { DoctorScheduleUtilizationCard } from "./DoctorScheduleUtilizationCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";

export function DoctorAnalyticsView() {
  const { dashboardData, isLoading, isError, error, refetch, metrics } =
    useDoctorAnalytics();

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Practitioner Analytics"
          description="Track consultation volume, capacity utilization, and patient completion metrics"
        />
        <ErrorState
          title="Failed to load analytics"
          message={error?.message || "Could not retrieve doctor performance metrics from the server."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Practitioner Analytics"
        description="Monitor consultation completion rates, 20-minute slot utilization, and patient reach"
      />

      <DoctorAnalyticsSummaryCards
        completionRate={metrics.completionRate}
        slotUtilizationRate={metrics.slotUtilizationRate}
        cancellationRate={metrics.cancellationRate}
        totalPatients={metrics.totalPatients}
        totalPrescriptions={metrics.totalPrescriptions}
        publishedSchedules={dashboardData?.schedules.published ?? 0}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <DoctorConsultationStatusCard appointments={dashboardData?.appointments} />
        <DoctorScheduleUtilizationCard schedules={dashboardData?.schedules} />
      </div>
    </div>
  );
}

export default DoctorAnalyticsView;
