"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "../services/auth.service";
import { getApiErrorMessage } from "@/lib/api/errors";
import type {
  LoginInput,
  RegisterPatientInput,
  RegisterDoctorInput,
  VerifyEmailInput,
  ResendOtpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@/types/auth";
import type { UserProfile, Role, DoctorProfile, PatientProfile } from "@/types/user";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

export type AuthenticatedUser = UserProfile & {
  doctor?: DoctorProfile | null;
  patient?: PatientProfile | null;
};

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Query authenticated session
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch: refetchUser,
  } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        const res = await authService.getCurrentUser();
        return res.data as AuthenticatedUser;
      } catch (err: unknown) {
        // 401 is normal for unauthenticated guests, don't throw an unhandled query error
        const status =
          (err as { statusCode?: number; response?: { status?: number } })
            ?.statusCode ||
          (err as { response?: { status?: number } })?.response?.status;
        if (status === 401) {
          return null;
        }
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  const user: AuthenticatedUser | null = data ?? null;
  const isAuthenticated = Boolean(user);
  const role: Role | null = user?.role ?? null;

  // Helper to determine dashboard path for a given role
  const getDashboardPath = (userRole?: Role): string => {
    switch (userRole) {
      case "DOCTOR":
        return "/doctor";
      case "ADMIN":
      case "SUPER_ADMIN":
        return "/admin";
      case "PATIENT":
      default:
        return "/dashboard";
    }
  };

  // Patient Registration Mutation
  const registerPatientMutation = useMutation({
    mutationFn: (payload: RegisterPatientInput) =>
      authService.registerPatient(payload),
    onSuccess: (res, variables) => {
      toast.success(
        res.message || "Registration successful! Please verify your email.",
      );
      if (res.data?.devOtp) {
        toast.info(`Verification code sent to ${variables.email}`, { duration: 20000 });
      }
      router.push(
        `/verify-email?email=${encodeURIComponent(variables.email)}&type=patient`,
      );
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  // Doctor Application Mutation
  const registerDoctorMutation = useMutation({
    mutationFn: (payload: RegisterDoctorInput) =>
      authService.registerDoctor(payload),
    onSuccess: (res, variables) => {
      toast.success(
        res.message ||
          "Application submitted! Please verify your email address.",
      );
      router.push(
        `/verify-email?email=${encodeURIComponent(variables.email)}&type=doctor`,
      );
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: (payload: LoginInput) => authService.login(payload),
    onSuccess: async (res) => {
      // 1. Immediately seed query cache with the returned user to update UI instantly
      const returnedUser = res.data?.user as AuthenticatedUser | undefined;
      if (returnedUser) {
        queryClient.setQueryData(AUTH_QUERY_KEY, returnedUser);
      }

      // 2. Fetch fresh user session from backend to confirm session cookie is active
      try {
        const freshRes = await authService.getCurrentUser();
        if (freshRes.data) {
          queryClient.setQueryData(AUTH_QUERY_KEY, freshRes.data as AuthenticatedUser);
        }
      } catch {
        // Fallback to returnedUser if /auth/me fails
      }

      toast.success("Welcome back!");

      // 3. Determine target route from authenticated user role
      const activeUser =
        queryClient.getQueryData<AuthenticatedUser>(AUTH_QUERY_KEY) || returnedUser;
      const redirectPath = getDashboardPath(activeUser?.role);

      // 4. Navigate using router.replace to avoid back-navigation loops and refresh server components
      router.replace(redirectPath);
      router.refresh();
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  // Google Login Mutation
  const googleLoginMutation = useMutation({
    mutationFn: (idToken: string) => authService.googleLogin(idToken),
    onSuccess: async (res) => {
      const returnedUser = res.data?.user as AuthenticatedUser | undefined;
      if (returnedUser) {
        queryClient.setQueryData(AUTH_QUERY_KEY, returnedUser);
      }

      try {
        const freshRes = await authService.getCurrentUser();
        if (freshRes.data) {
          queryClient.setQueryData(AUTH_QUERY_KEY, freshRes.data as AuthenticatedUser);
        }
      } catch {
        // Fallback to returnedUser
      }

      toast.success("Signed in with Google successfully!");

      const activeUser =
        queryClient.getQueryData<AuthenticatedUser>(AUTH_QUERY_KEY) || returnedUser;
      const redirectPath = getDashboardPath(activeUser?.role);

      router.replace(redirectPath);
      router.refresh();
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  // Verify Email Mutation
  const verifyEmailMutation = useMutation({
    mutationFn: (payload: VerifyEmailInput & { type?: "patient" | "doctor" }) => {
      const { type = "patient", ...rest } = payload;
      if (type === "doctor") {
        return authService.verifyDoctorEmail(rest);
      }
      return authService.verifyPatientEmail(rest);
    },
    onSuccess: (res, variables) => {
      toast.success(res.message || "Email verified successfully!");
      if (variables.type === "doctor") {
        toast.info(
          "Your practitioner application is under administrative review.",
        );
      }
      router.push("/login");
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  // Resend OTP Mutation
  const resendOtpMutation = useMutation({
    mutationFn: (payload: ResendOtpInput & { type?: "patient" | "doctor" }) => {
      const { type = "patient", ...rest } = payload;
      if (type === "doctor") {
        return authService.resendDoctorOtp(rest);
      }
      return authService.resendPatientOtp(rest);
    },
    onSuccess: (res) => {
      toast.success(res.message || "A new verification code has been sent!");
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  // Forgot Password Mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: (payload: ForgotPasswordInput) =>
      authService.forgotPassword(payload),
    onSuccess: (res, variables) => {
      toast.success(
        res.message || "Password reset code sent! Please check your email.",
      );
      router.push(
        `/reset-password?email=${encodeURIComponent(variables.email)}`,
      );
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  // Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (payload: ResetPasswordInput) =>
      authService.resetPassword(payload),
    onSuccess: (res) => {
      toast.success(
        res.message || "Password has been reset successfully! Please sign in.",
      );
      router.push("/login");
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
      queryClient.clear();
      toast.success("Signed out successfully");
      router.replace("/login");
      router.refresh();
    },
    onError: () => {
      // Even if network fails, clear local cache and redirect
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
      queryClient.clear();
      router.replace("/login");
      router.refresh();
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    isFetching,
    error,
    role,
    refetchUser,
    getDashboardPath,
    // Actions
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    googleLogin: googleLoginMutation.mutateAsync,
    isGoogleLoggingIn: googleLoginMutation.isPending,
    registerPatient: registerPatientMutation.mutateAsync,
    isRegisteringPatient: registerPatientMutation.isPending,
    registerDoctor: registerDoctorMutation.mutateAsync,
    isRegisteringDoctor: registerDoctorMutation.isPending,
    verifyEmail: verifyEmailMutation.mutateAsync,
    isVerifyingEmail: verifyEmailMutation.isPending,
    resendOtp: resendOtpMutation.mutateAsync,
    isResendingOtp: resendOtpMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isRequestingForgotPassword: forgotPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}

export default useAuth;

