import * as React from "react";
import Link from "next/link";
import { Stethoscope, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";

export interface PendingDoctorApprovalsCardProps {
  hasPendingDoctors?: boolean;
}

export function PendingDoctorApprovalsCard({
  hasPendingDoctors = false,
}: PendingDoctorApprovalsCardProps) {
  return (
    <Card className="shadow-xs min-w-0">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3">
        <div className="min-w-0">
          <CardTitle className="text-base font-semibold truncate">
            Pending Doctor Verifications
          </CardTitle>
          <CardDescription className="text-xs">
            Medical practitioners awaiting license & credential review
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-xs self-start sm:self-auto shrink-0">
          <Link href="/admin/doctors?status=PENDING">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {!hasPendingDoctors ? (
          <EmptyState
            title="All applications reviewed"
            description="There are currently no practitioner applications awaiting verification."
            icon={Stethoscope}
            className="my-1 py-6"
          />
        ) : (
          <div className="space-y-3">
            {/* Populated pending doctor items will render here */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PendingDoctorApprovalsCard;

