"use client";

import * as React from "react";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import type { DashboardPrescriptionItem } from "../types/dashboard.types";

interface RecentPrescriptionsSectionProps {
  recentPrescriptions: DashboardPrescriptionItem[];
  totalCount: number;
  isLoading?: boolean;
}

export function RecentPrescriptionsSection({
  recentPrescriptions,
  totalCount,
  isLoading = false,
}: RecentPrescriptionsSectionProps) {
  return (
    <Card className="shadow-xs h-full flex flex-col min-w-0">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3">
        <div className="min-w-0">
          <CardTitle className="text-base font-semibold truncate">
            Prescriptions ({totalCount})
          </CardTitle>
          <CardDescription className="text-xs">
            Digital treatment plans and doctor instructions
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-xs self-start sm:self-auto shrink-0">
          <Link href="/dashboard/prescriptions">
            All Prescriptions <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-muted/60 animate-pulse" />
            ))}
          </div>
        ) : recentPrescriptions.length === 0 ? (
          <EmptyState
            title="No prescriptions yet"
            description="Prescriptions issued by your doctors after completed consultations will appear here."
            icon={FileText}
            className="py-8"
          />
        ) : (
          <div className="space-y-3">
            {recentPrescriptions.map((rx) => {
              const formattedDate = new Date(rx.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={rx.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 sm:p-3.5 rounded-lg border border-border/70 bg-card hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-foreground truncate">
                        Dr. {rx.doctor.name}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        Issued on {formattedDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded font-mono">
                      #{rx.id.slice(0, 8)}
                    </span>
                    <Button asChild variant="link" size="xs" className="p-0 h-auto text-xs text-primary">
                      <Link href="/dashboard/prescriptions">
                        View Rx &rarr;
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentPrescriptionsSection;
