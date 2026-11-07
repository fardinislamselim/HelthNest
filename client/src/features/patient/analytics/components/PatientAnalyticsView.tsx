"use client";

import * as React from "react";
import { BarChart3 } from "lucide-react";
import { usePatientAnalytics } from "@/features/patient/analytics/hooks/usePatientAnalytics";
import {
  AnalyticsStatsSummary,
  AppointmentStatusDistribution,
  FinancialAnalyticsCard,
  DoctorSpecialtyDistribution,
} from "./index";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";

export function PatientAnalyticsView() {
  const {
    total,
    completed,
    cancelled,
    booked,
    completionRate,
    cancellationRate,
    totalPaidAmount,
    totalRefundedAmount,
    specialties,
    hasData,
    isLoading,
    isError,
    error,
    refetch,
  } = usePatientAnalytics();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Personal Health & Consultation Analytics"
        description="Comprehensive breakdown of your appointments, visit completion trends, and healthcare expenditures"
      />

      {isError ? (
        <ErrorState
          title="Failed to load analytics"
          message={error?.message || "Could not retrieve analytical data from the server."}
          onRetry={refetch}
          className="my-8"
        />
      ) : !isLoading && !hasData ? (
        <EmptyState
          title="No Analytics Data Yet"
          description="Once you schedule consultations and complete appointments with doctors, your personal consultation ratios and healthcare financial breakdown will appear here."
          icon={BarChart3}
          className="my-8 py-16"
        />
      ) : (
        <div className="space-y-6">
          <AnalyticsStatsSummary
            total={total}
            completionRate={completionRate}
            cancellationRate={cancellationRate}
            totalPaidAmount={totalPaidAmount}
            isLoading={isLoading}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AppointmentStatusDistribution
              total={total}
              completed={completed}
              booked={booked}
              cancelled={cancelled}
            />
            <FinancialAnalyticsCard
              totalPaid={totalPaidAmount}
              totalRefunded={totalRefundedAmount}
            />
          </div>

          <DoctorSpecialtyDistribution specialties={specialties} />
        </div>
      )}
    </div>
  );
}

export default PatientAnalyticsView;
