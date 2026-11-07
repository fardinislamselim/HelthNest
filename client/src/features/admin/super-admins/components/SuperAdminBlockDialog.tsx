"use client";

import * as React from "react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import {
  useBlockSuperAdminMutation,
  useUnblockSuperAdminMutation,
} from "../../hooks/useAdmin";
import type { AdminUserRecord } from "../../types/admin.types";

interface SuperAdminBlockDialogProps {
  superAdmin: AdminUserRecord | null;
  mode: "block" | "unblock" | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SuperAdminBlockDialog({
  superAdmin,
  mode,
  open,
  onClose,
  onSuccess,
}: SuperAdminBlockDialogProps) {
  const blockMutation = useBlockSuperAdminMutation();
  const unblockMutation = useUnblockSuperAdminMutation();

  if (!superAdmin || !mode) return null;

  const isBlock = mode === "block";
  const isLoading = blockMutation.isPending || unblockMutation.isPending;

  const handleConfirm = async () => {
    if (isBlock) {
      await blockMutation.mutateAsync(superAdmin.id);
    } else {
      await unblockMutation.mutateAsync(superAdmin.id);
    }
    onSuccess?.();
    onClose();
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      title={
        isBlock
          ? "Block Super Administrator Account?"
          : "Unblock Super Administrator Account?"
      }
      description={
        isBlock
          ? `CAUTION: You are about to block Super Administrator privileges for ${
              superAdmin.name || superAdmin.email
            }. They will immediately lose platform root access and governance permissions.`
          : `Are you sure you want to restore Super Administrator privileges for ${
              superAdmin.name || superAdmin.email
            }? They will regain full governance access.`
      }
      confirmLabel={isBlock ? "Yes, Block Super Admin" : "Yes, Unblock Super Admin"}
      cancelLabel="Cancel"
      variant={isBlock ? "destructive" : "default"}
      isLoading={isLoading}
      onConfirm={handleConfirm}
    />
  );
}

export default SuperAdminBlockDialog;
