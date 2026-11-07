"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "../services/auth.service";
import { AUTH_QUERY_KEY } from "./useAuth";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { ChangePasswordFormValues, SetPasswordFormValues } from "../validations/password.schema";

export function useChangePasswordMutation(options?: {
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ChangePasswordFormValues) =>
      authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    onSuccess: (res) => {
      toast.success(res?.message || "Password changed successfully!");
      // Invalidate current user query to refresh needPasswordChange and session state
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      options?.onSuccess?.();
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });
}

export function useSetPasswordMutation(options?: {
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: SetPasswordFormValues) =>
      authService.setPassword({
        newPassword: values.newPassword,
      }),
    onSuccess: (res) => {
      toast.success(res?.message || "Password set successfully! You can now log in with email and password.");
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      options?.onSuccess?.();
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });
}
