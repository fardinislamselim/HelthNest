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
    <Card className="shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold">
            Pending Doctor Verifications
          </CardTitle>
          <CardDescription>
            Medical practitioners awaiting license & credential review
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
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

