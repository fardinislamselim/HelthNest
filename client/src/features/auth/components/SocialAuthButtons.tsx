"use client";

import * as React from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { Loader2 } from "lucide-react";

export interface SocialAuthButtonsProps {
  isLoading?: boolean;
  onGoogleSuccess: (credentialResponse: CredentialResponse) => void;
  onGoogleError?: () => void;
  text?: "signin_with" | "signup_with" | "continue_with";
}

export function SocialAuthButtons({
  isLoading = false,
  onGoogleSuccess,
  onGoogleError,
  text = "signin_with",
}: SocialAuthButtonsProps) {
  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing in with Google...
        </div>
      ) : (
        <div className="flex justify-center w-full overflow-hidden rounded-md">
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={onGoogleError}
            text={text}
            shape="rectangular"
            size="large"
            theme="outline"
          />
        </div>
      )}

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative bg-card px-2 text-xs uppercase text-muted-foreground tracking-wider">
          Or continue with email
        </div>
      </div>
    </div>
  );
}

export default SocialAuthButtons;
