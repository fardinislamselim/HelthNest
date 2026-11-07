"use client";

import * as React from "react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useBlockPatientMutation, useUnblockPatientMutation } from "../../hooks/useAdmin";
import type { PatientAdminRecord } from "../../types/admin.types";

interface PatientBlockDialogProps {
  patient: PatientAdminRecord | null;
  mode: "block" | "unblock" | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PatientBlockDialog({
  patient,
  mode,
  open,
  onClose,
  onSuccess,
}: PatientBlockDialogProps) {
  const blockMutation = useBlockPatientMutation();
  const unblockMutation = useUnblockPatientMutation();

  if (!patient || !mode) return null;

  const isBlock = mode === "block";
  const isLoading = blockMutation.isPending || unblockMutation.isPending;

  const handleConfirm = async () => {
    if (isBlock) {
      await blockMutation.mutateAsync(patient.id);
    } else {
      await unblockMutation.mutateAsync(patient.id);
    }
    onSuccess?.();
    onClose();
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      title={isBlock ? "Block Patient Account?" : "Unblock Patient Account?"}
      description={
        isBlock
          ? `Are you sure you want to block ${patient.name} (${patient.email})? When blocked, the patient will be prevented from signing in or booking appointments. Their historical appointment, billing, and prescription records will be preserved.`
          : `Are you sure you want to unblock ${patient.name} (${patient.email})? The patient account will be restored to active status immediately.`
      }
      confirmLabel={isBlock ? "Yes, Block Patient" : "Yes, Unblock Patient"}
      cancelLabel="Cancel"
      variant={isBlock ? "destructive" : "default"}
      isLoading={isLoading}
      onConfirm={handleConfirm}
    />
  );
}

export default PatientBlockDialog;
