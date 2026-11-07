"use client";

import * as React from "react";
import { X, ShieldAlert, Mail, User, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAdminMutation } from "../../hooks/useAdmin";

interface CreateAdminModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateAdminModal({ open, onClose, onSuccess }: CreateAdminModalProps) {
  const [organizationEmail, setOrganizationEmail] = React.useState("");
  const [personalEmail, setPersonalEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [clientError, setClientError] = React.useState<string | null>(null);

  const createMutation = useCreateAdminMutation();

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
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Create Administrator</h2>
              <p className="text-xs text-muted-foreground">
                Provision a new operator account with administrative platform privileges.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground flex items-start gap-2">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>
              The backend will generate a secure temporary password and send credentials directly to the administrator&apos;s personal email. A password change is enforced on first login.
            </span>
          </div>

          {clientError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
              {clientError}
            </div>
          )}

          <div className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-medium">
                Full Name (Optional)
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 text-xs sm:text-sm"
                  disabled={createMutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="organizationEmail" className="text-xs font-medium">
                Organization / Work Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="organizationEmail"
                  type="email"
                  required
                  placeholder="admin.ops@healthnest.com"
                  value={organizationEmail}
                  onChange={(e) => setOrganizationEmail(e.target.value)}
                  className="pl-9 text-xs sm:text-sm"
                  disabled={createMutation.isPending}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                This email will serve as their primary login identifier.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="personalEmail" className="text-xs font-medium">
                Personal Email (For Initial Credentials) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="personalEmail"
                  type="email"
                  required
                  placeholder="sarah.jenkins.personal@gmail.com"
                  value={personalEmail}
                  onChange={(e) => setPersonalEmail(e.target.value)}
                  className="pl-9 text-xs sm:text-sm"
                  disabled={createMutation.isPending}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Must be different from organization email. One-time setup password will be delivered here.
              </p>
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
              className="gap-2"
            >
              {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create & Send Credentials
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAdminModal;
