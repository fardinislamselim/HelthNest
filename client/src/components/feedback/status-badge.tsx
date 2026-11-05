import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType =
  | "PENDING"
  | "BOOKED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "EXPIRED"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "BLOCKED"
  | "DRAFT"
  | "PUBLISHED";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  const getVariant = (): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" => {
    switch (normalized) {
      case "BOOKED":
      case "COMPLETED":
      case "PAID":
      case "APPROVED":
      case "ACTIVE":
      case "PUBLISHED":
        return "success";

      case "PENDING":
      case "ONGOING":
      case "PROCESSING":
      case "DRAFT":
        return "warning";

      case "FAILED":
      case "REJECTED":
      case "CANCELLED":
      case "BLOCKED":
      case "EXPIRED":
        return "destructive";

      case "REFUNDED":
      default:
        return "secondary";
    }
  };

  return (
    <Badge variant={getVariant()} className={cn("capitalize tracking-wide font-medium", className)}>
      {status.toLowerCase().replace(/_/g, " ")}
    </Badge>
  );
}

export default StatusBadge;

