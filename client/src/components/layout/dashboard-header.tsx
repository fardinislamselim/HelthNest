"use client";

import * as React from "react";
import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUiStore } from "@/stores/ui-store";
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

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={toggleMobileNav}
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        {title && <h1 className="text-lg font-semibold tracking-tight">{title}</h1>}
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="outline" className="text-xs uppercase font-medium tracking-wider">
          {role.replace("_", " ")}
        </Badge>

        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium hidden sm:inline-block max-w-[120px] truncate">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
