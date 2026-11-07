"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, User, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUiStore } from "@/stores/ui-store";
import { useAuth } from "@/features/auth/hooks/use-auth";
import type { Role } from "@/types/user";

interface DashboardHeaderProps {
  role?: Role;
  userName?: string;
  title?: string;
}

export function DashboardHeader({
  role = "PATIENT",
  userName = "User",
  title,
}: DashboardHeaderProps) {
  const { toggleMobileNav } = useUiStore();
  const { user, logout, isLoggingOut } = useAuth();

  const profileHref =
    role === "DOCTOR"
      ? "/doctor/profile"
      : role === "ADMIN" || role === "SUPER_ADMIN"
        ? "/admin"
        : "/dashboard/profile";

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-3 sm:px-6 backdrop-blur">
      {/* Left section: Hamburger button + Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden shrink-0 h-9 w-9"
          onClick={toggleMobileNav}
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {title && (
          <h1 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-foreground truncate max-w-[130px] xs:max-w-[200px] sm:max-w-none">
            {title}
          </h1>
        )}
      </div>

      {/* Right section: Role badge + User profile image & name + Sign Out */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <Badge
          variant="outline"
          className="hidden xs:inline-flex text-[10px] sm:text-xs uppercase font-semibold tracking-wider px-2 py-0.5"
        >
          {role.replace("_", " ")}
        </Badge>

        <Link
          href={profileHref}
          className="flex items-center gap-2 pl-1.5 sm:pl-2 sm:border-l border-border hover:opacity-85 transition-opacity"
          title="View profile"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 overflow-hidden bg-primary/10 text-primary shrink-0">
            {user?.profileImageUrl ? (
              <Image
                src={user.profileImageUrl}
                alt={user.name || userName}
                width={32}
                height={32}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          <span className="text-xs sm:text-sm font-medium hidden sm:inline-block max-w-[100px] md:max-w-[140px] truncate">
            {user?.name || userName}
          </span>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="h-8 px-2 sm:px-3 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5 shrink-0"
          title="Sign out of account"
          aria-label="Sign out of account"
        >
          {isLoggingOut ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <LogOut className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}

export default DashboardHeader;
