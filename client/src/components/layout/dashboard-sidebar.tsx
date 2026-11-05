"use client";

import * as React from "react";
import Link from "next/link";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";
import type { Role } from "@/types/user";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PATIENT_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
  { href: "/dashboard/prescriptions", label: "Prescriptions", icon: FileText },
  { href: "/dashboard/payments", label: "Payments & Refunds", icon: CreditCard },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
];

const DOCTOR_NAV: NavItem[] = [
  { href: "/doctor", label: "Overview", icon: LayoutDashboard },
  { href: "/doctor/schedules", label: "My Schedules", icon: Clock },
  { href: "/doctor/appointments", label: "Consultations", icon: Calendar },
  { href: "/doctor/prescriptions", label: "Prescriptions", icon: FileText },
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
  const { isSidebarOpen, toggleSidebar } = useUiStore();

  const navItems =
    role === "DOCTOR"
      ? DOCTOR_NAV
      : role === "ADMIN" || role === "SUPER_ADMIN"
        ? ADMIN_NAV
        : PATIENT_NAV;

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border bg-card transition-all duration-300 select-none",
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
          const isActive = pathname === item.href;

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
  );
}

export default DashboardSidebar;
