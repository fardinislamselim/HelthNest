"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldAlert, Lock, Eye, EyeOff, Loader2, LogOut } from "lucide-react";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../validations/password.schema";
import { useChangePasswordMutation } from "../hooks/usePassword";
import { useAuth } from "../hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModalFocusTrap } from "@/hooks/useModalFocusTrap";

export function ForcePasswordChangeModal() {
  const { user, logout, isLoggingOut } = useAuth();
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const isRequired = Boolean(user && user.needPasswordChange);

  const dialogRef = useModalFocusTrap<HTMLDivElement>({
    isOpen: isRequired,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = useChangePasswordMutation({
    onSuccess: () => {
      reset();
    },
  });

  // Lock background scroll when open
  React.useEffect(() => {
    if (isRequired) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isRequired]);

  if (!isRequired) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Heavy Backdrop (Cannot be dismissed) */}
      <div className="fixed inset-0 bg-background/95 backdrop-blur-md" aria-hidden="true" />

      {/* Modal Dialog */}
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="force-password-title"
        className="relative z-50 w-full max-w-lg rounded-2xl border border-destructive/30 bg-card p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in-0 zoom-in-95 duration-200"
      >
        <div className="flex items-start gap-3.5 border-b border-border/60 pb-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive mt-0.5">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-destructive/10 text-destructive mb-1">
              Action Required
            </div>
            <h2
              id="force-password-title"
              className="text-lg sm:text-xl font-bold tracking-tight text-foreground"
            >
              First-Time Login: Password Change Required
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Hello <strong className="text-foreground">{user?.name}</strong>. Your account was created with a temporary password and requires an immediate password update before administrative features can be accessed.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit((data) => changePasswordMutation.mutate(data))}
          className="space-y-4 pt-1"
        >
          {/* Current Temporary Password */}
          <div className="space-y-1.5">
            <Label htmlFor="forceCurrentPassword" className="text-xs font-medium">
              Current Temporary Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="forceCurrentPassword"
                type={showCurrent ? "text" : "password"}
                placeholder="Enter the password provided to you"
                className="pr-10 text-sm"
                {...register("currentPassword")}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="forceNewPassword" className="text-xs font-medium">
              Choose New Secure Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="forceNewPassword"
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
            <Label htmlFor="forceConfirmPassword" className="text-xs font-medium">
              Confirm New Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="forceConfirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-type your new password"
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

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              disabled={isLoggingOut || changePasswordMutation.isPending}
              className="text-xs text-muted-foreground hover:text-destructive gap-1.5"
            >
              {isLoggingOut ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LogOut className="h-3.5 w-3.5" />
              )}
              Sign Out Instead
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={changePasswordMutation.isPending}
              className="text-xs gap-1.5 bg-primary hover:bg-primary/90"
            >
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  Save New Password & Continue
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForcePasswordChangeModal;
