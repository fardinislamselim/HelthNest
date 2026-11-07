"use client";

import * as React from "react";
import { X, ShieldCheck, Mail, User, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateSuperAdminMutation } from "../../hooks/useAdmin";

interface CreateSuperAdminModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateSuperAdminModal({
  open,
  onClose,
  onSuccess,
}: CreateSuperAdminModalProps) {
  const [organizationEmail, setOrganizationEmail] = React.useState("");
  const [personalEmail, setPersonalEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [clientError, setClientError] = React.useState<string | null>(null);

  const createMutation = useCreateSuperAdminMutation();

  const handleClose = React.useCallback(() => {
    setOrganizationEmail("");
    setPersonalEmail("");
    setName("");
    setClientError(null);
    onClose();
  }, [onClose]);

  // Lock background scroll
  React.useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  // Handle Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !createMutation.isPending) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, createMutation.isPending, handleClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);

    const org = organizationEmail.trim().toLowerCase();
    const pers = personalEmail.trim().toLowerCase();

    if (!org || !pers) {
      setClientError("Both organization email and personal email are required.");
      return;
    }

    if (org === pers) {
      setClientError("Organization and personal emails must be distinct addresses.");
      return;
    }

    await createMutation.mutateAsync({
      organizationEmail: org,
      personalEmail: pers,
      name: name.trim() || undefined,
    });

    onSuccess?.();
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
        onClick={() => !createMutation.isPending && handleClose()}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-card p-4 sm:p-6 shadow-xl transition-all">
        <button
          type="button"
          onClick={handleClose}
          disabled={createMutation.isPending}
          className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground hover:bg-muted focus:outline-hidden"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Provision Super Administrator</h2>
              <p className="text-xs text-muted-foreground">
                Grant full root governance privileges over platform credentials, operators, and billing.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3 text-xs text-muted-foreground flex items-start gap-2">
            <Info className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <span>
              The system creates the account with role <strong className="text-foreground">SUPER_ADMIN</strong> and delivers an encrypted temporary passkey to the personal email address.
            </span>
          </div>

          {clientError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
              {clientError}
            </div>
          )}

          <div className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="superAdminName" className="text-xs font-medium">
                Full Name (Optional)
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="superAdminName"
                  placeholder="e.g. Chief Executive / Lead Architect"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 text-xs sm:text-sm"
                  disabled={createMutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="superAdminOrgEmail" className="text-xs font-medium">
                Organization Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="superAdminOrgEmail"
                  type="email"
                  required
                  placeholder="superadmin@healthnest.com"
                  value={organizationEmail}
                  onChange={(e) => setOrganizationEmail(e.target.value)}
                  className="pl-9 text-xs sm:text-sm"
                  disabled={createMutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="superAdminPersonalEmail" className="text-xs font-medium">
                Personal Email (For Initial Credentials) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="superAdminPersonalEmail"
                  type="email"
                  required
                  placeholder="executive.personal@gmail.com"
                  value={personalEmail}
                  onChange={(e) => setPersonalEmail(e.target.value)}
                  className="pl-9 text-xs sm:text-sm"
                  disabled={createMutation.isPending}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending}
              className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Provision Super Admin
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSuperAdminModal;
