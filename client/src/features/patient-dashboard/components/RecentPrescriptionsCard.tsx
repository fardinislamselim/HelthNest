import * as React from "react";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";

export interface RecentPrescriptionsCardProps {
  hasPrescriptions?: boolean;
}

export function RecentPrescriptionsCard({
  hasPrescriptions = false,
}: RecentPrescriptionsCardProps) {
  return (
    <Card className="shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold">
            Recent Prescriptions
          </CardTitle>
          <CardDescription>
            Digital clinical advice and medicine plans from your doctors
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
          <Link href="/dashboard/prescriptions">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {!hasPrescriptions ? (
          <EmptyState
            title="No prescriptions yet"
            description="Your digital prescription records and downloadable PDFs will appear here after your doctor consultation."
            icon={FileText}
            className="my-1 py-6"
          />
        ) : (
          <div className="space-y-3">
            {/* Populated prescriptions will render here */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentPrescriptionsCard;

