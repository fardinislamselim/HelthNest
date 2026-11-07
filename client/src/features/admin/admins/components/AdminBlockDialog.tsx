"use client";

import * as React from "react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useBlockAdminMutation, useUnblockAdminMutation } from "../../hooks/useAdmin";
import type { AdminUserRecord } from "../../types/admin.types";

interface AdminBlockDialogProps {
  admin: AdminUserRecord | null;
  mode: "block" | "unblock" | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AdminBlockDialog({
  admin,
  mode,
  open,
  onClose,
  onSuccess,
}: AdminBlockDialogProps) {
  const blockMutation = useBlockAdminMutation();
  const unblockMutation = useUnblockAdminMutation();

  if (!admin || !mode) return null;

  const isBlock = mode === "block";
  const isLoading = blockMutation.isPending || unblockMutation.isPending;

  const handleConfirm = async () => {
    if (isBlock) {
      await blockMutation.mutateAsync(admin.id);
    } else {
      await unblockMutation.mutateAsync(admin.id);
    }
    onSuccess?.();
    onClose();
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      title={isBlock ? "Block Administrator Account?" : "Unblock Administrator Account?"}
      description={
        isBlock
          ? `Are you sure you want to block administrative access for ${admin.name || admin.email}? They will immediately lose access to review doctor applications, block/unblock accounts, and view platform dashboard operations.`
          : `Are you sure you want to restore active status for ${admin.name || admin.email}? They will regain operator permissions immediately.`
      }
      confirmLabel={isBlock ? "Yes, Block Administrator" : "Yes, Unblock Administrator"}
      cancelLabel="Cancel"
      variant={isBlock ? "destructive" : "default"}
      isLoading={isLoading}
      onConfirm={handleConfirm}
    />
  );
}

export default AdminBlockDialog;
