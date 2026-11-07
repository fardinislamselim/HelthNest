"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Eye, EyeOff, Loader2, X, ShieldCheck } from "lucide-react";
import {
  setPasswordSchema,
  type SetPasswordFormValues,
} from "../validations/password.schema";
import { useSetPasswordMutation } from "../hooks/usePassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SetPasswordModal({
  open,
  onOpenChange,
}: SetPasswordModalProps) {
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const setPasswordMutation = useSetPasswordMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
    },
  });

  const handleClose = React.useCallback(() => {
    if (!setPasswordMutation.isPending) {
      reset();
      onOpenChange(false);
    }
  }, [setPasswordMutation.isPending, onOpenChange, reset]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="set-password-title"
        className="relative z-50 w-full max-w-md rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xl space-y-4 animate-in fade-in-0 zoom-in-95 duration-200"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="set-password-title"
                className="text-base sm:text-lg font-semibold text-foreground"
              >
                Set Account Password
              </h2>
              <p className="text-xs text-muted-foreground">
                Enable email and password sign-in alongside your Google account.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={setPasswordMutation.isPending}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit((data) => setPasswordMutation.mutate(data))}
          className="space-y-4 pt-1"
        >
          {/* New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="setPasswordNew" className="text-xs font-medium">
              New Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="setPasswordNew"
                type={showNew ? "text" : "password"}
                placeholder="At least 6 characters"
                className="pr-10 text-sm"
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-destructive">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="setPasswordConfirm" className="text-xs font-medium">
              Confirm Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="setPasswordConfirm"
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat password"
                className="pr-10 text-sm"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-2 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={setPasswordMutation.isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={setPasswordMutation.isPending}
              className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {setPasswordMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving Password...
                </>
              ) : (
                <>
                  <KeyRound className="h-3.5 w-3.5" />
                  Save Password
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SetPasswordModal;
