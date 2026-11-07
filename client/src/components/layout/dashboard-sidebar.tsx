"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Activity,
  Calendar,
  Clock,
  FileText,
  CreditCard,
  User,
  Users,
  UserCheck,
  LayoutDashboard,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Role } from "@/types/user";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PATIENT_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/schedules", label: "Book Consultation", icon: Clock },
  { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
  { href: "/dashboard/prescriptions", label: "Prescriptions", icon: FileText },
  { href: "/dashboard/payments", label: "Payments & Refunds", icon: CreditCard },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
];

const DOCTOR_NAV: NavItem[] = [
  { href: "/doctor", label: "Overview", icon: LayoutDashboard },
  { href: "/doctor/schedules", label: "My Schedules", icon: Clock },
  { href: "/doctor/appointments", label: "Consultations", icon: Calendar },
  { href: "/doctor/prescriptions", label: "Prescriptions", icon: FileText },
  { href: "/doctor/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/doctor/profile", label: "Doctor Profile", icon: User },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Platform Overview", icon: LayoutDashboard },
  { href: "/admin/doctors", label: "Doctor Management", icon: UserCheck },
  { href: "/admin/patients", label: "Patient Management", icon: Users },
  { href: "/admin/appointments", label: "All Appointments", icon: Calendar },
  { href: "/admin/payments", label: "Payments & Refunds", icon: CreditCard },
];

interface DashboardSidebarProps {
  role?: Role;
  className?: string;
}

export function DashboardSidebar({ role = "PATIENT", className }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar, isMobileNavOpen, closeAllNav } = useUiStore();
  const { user, logout, isLoggingOut } = useAuth();

  const navItems =
    role === "DOCTOR"
      ? DOCTOR_NAV
      : role === "ADMIN" || role === "SUPER_ADMIN"
        ? ADMIN_NAV
        : PATIENT_NAV;

  // Prevent background scrolling while the mobile drawer is open
  React.useEffect(() => {
    if (isMobileNavOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileNavOpen]);

  // Handle Escape key to close mobile drawer
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileNavOpen) {
        closeAllNav();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileNavOpen, closeAllNav]);

  // Close mobile navigation drawer whenever route changes
  React.useEffect(() => {
    closeAllNav();
  }, [pathname, closeAllNav]);

  return (
    <>
      {/* =========================================================================
          1. DESKTOP / TABLET PERSISTENT SIDEBAR (Hidden on mobile < 768px)
          ========================================================================= */}
      <aside
        className={cn(
          "relative hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 select-none shrink-0",
          isSidebarOpen ? "w-64" : "w-16",
          className,
        )}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2.5 font-bold text-foreground overflow-hidden",
              !isSidebarOpen && "justify-center w-full",
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Activity className="h-5 w-5" aria-hidden="true" />
            </div>
            {isSidebarOpen && (
              <span className="truncate tracking-tight font-bold">HealthNest</span>
            )}
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                item.href !== "/doctor" &&
                item.href !== "/admin" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  !isSidebarOpen && "justify-center px-2",
                )}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {isSidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle Footer */}
        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
              !isSidebarOpen && "justify-center px-0",
            )}
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse Sidebar</span>
              </>
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>

      {/* =========================================================================
          2. MOBILE NAVIGATION DRAWER & BACKDROP (Rendered on mobile < 768px)
          ========================================================================= */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
            onClick={closeAllNav}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-border bg-card shadow-2xl animate-in slide-in-from-left duration-250 ease-out"
          >
            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <Link
                href="/"
                onClick={closeAllNav}
                className="flex items-center gap-2.5 font-bold text-foreground"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <Activity className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col">
                  <span className="truncate tracking-tight font-bold text-sm leading-tight">
                    HealthNest
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Healthcare Portal
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={closeAllNav}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Close navigation drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Role indicator */}
            <div className="px-4 py-2 bg-muted/40 border-b border-border/60 flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Active Portal</span>
              <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                {role.replace("_", " ")}
              </Badge>
            </div>

            {/* Drawer Navigation Links */}
            <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    item.href !== "/doctor" &&
                    item.href !== "/admin" &&
                    pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeAllNav}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer with Profile & Sign Out */}
            <div className="border-t border-border p-4 bg-muted/20 space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/20 overflow-hidden bg-primary/10 text-primary">
                  {user?.profileImageUrl ? (
                    <Image
                      src={user.profileImageUrl}
                      alt={user.name || "User"}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user?.name || "User Account"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || ""}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  closeAllNav();
                  logout();
                }}
                disabled={isLoggingOut}
                className="w-full justify-center gap-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <LogOut className="h-3.5 w-3.5" />
                )}
                <span>Sign Out</span>
              </Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default DashboardSidebar;
