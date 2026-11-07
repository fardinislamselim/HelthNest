"use client";

import * as React from "react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useBlockDoctorMutation, useUnblockDoctorMutation } from "../../hooks/useAdmin";
import type { DoctorAdminRecord } from "../../types/admin.types";

interface DoctorBlockDialogProps {
  doctor: DoctorAdminRecord | null;
  mode: "block" | "unblock" | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DoctorBlockDialog({
  doctor,
  mode,
  open,
  onClose,
  onSuccess,
}: DoctorBlockDialogProps) {
  const blockMutation = useBlockDoctorMutation();
  const unblockMutation = useUnblockDoctorMutation();

  if (!doctor || !mode) return null;

  const isBlock = mode === "block";
  const isLoading = blockMutation.isPending || unblockMutation.isPending;

  const handleConfirm = async () => {
    if (isBlock) {
      await blockMutation.mutateAsync(doctor.id);
    } else {
      await unblockMutation.mutateAsync(doctor.id);
    }
    onSuccess?.();
    onClose();
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      title={isBlock ? `Block Doctor Account?` : `Unblock Doctor Account?`}
      description={
        isBlock
          ? `Are you sure you want to block the account for Dr. ${doctor.name} (${doctor.email})? When blocked, the doctor will be unable to log in, accept new consultations, or publish schedules. Their existing historical consultation records will be safely preserved.`
          : `Are you sure you want to unblock Dr. ${doctor.name} (${doctor.email})? Their practitioner account will be restored to active status and they will regain normal platform access.`
      }
      confirmLabel={isBlock ? "Yes, Block Doctor" : "Yes, Unblock Doctor"}
      cancelLabel="Cancel"
      variant={isBlock ? "destructive" : "default"}
      isLoading={isLoading}
      onConfirm={handleConfirm}
    />
  );
}

export default DoctorBlockDialog;
