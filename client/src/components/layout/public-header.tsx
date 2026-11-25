"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Activity,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User,
  Calendar,
  ChevronDown,
  Stethoscope,
  Heart,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/ui-store";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Find Doctors" },
  { href: "/#specialties", label: "Specialties" },
  { href: "/about", label: "About Us" },
  { href: "/#how-it-works", label: "How It Works" },
];

const SPECIALTY_DROPDOWN = [
  { name: "General Medicine", href: "/doctors?specialization=General%20Medicine", icon: Stethoscope },
  { name: "Cardiology", href: "/doctors?specialization=Cardiology", icon: Heart },
  { name: "Dermatology", href: "/doctors?specialization=Dermatology", icon: Sparkles },
];

export function PublicHeader() {
  const pathname = usePathname();
  const { isMobileNavOpen, toggleMobileNav, closeAllNav } = useUiStore();
  const { user, isAuthenticated, isLoading, logout, isLoggingOut, getDashboardPath } = useAuth();
  const [isSpecialtyMenuOpen, setIsSpecialtyMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80 shadow-xs">
      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={closeAllNav}
          className="flex items-center gap-2.5 font-bold text-lg text-foreground hover:opacity-90 transition-opacity"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="font-extrabold tracking-tight text-xl">HealthNest</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {NAV_LINKS.map((link) => {
            if (link.label === "Specialties") {
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setIsSpecialtyMenuOpen(true)}
                  onMouseLeave={() => setIsSpecialtyMenuOpen(false)}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 py-1 text-foreground/75 hover:text-foreground transition-colors"
                  >
                    <span>{link.label}</span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  </Link>

                  {/* Dropdown Menu */}
                  {isSpecialtyMenuOpen && (
                    <div className="absolute top-full left-0 w-52 py-2 bg-card border border-border/80 shadow-lg rounded-xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                      {SPECIALTY_DROPDOWN.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsSpecialtyMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-foreground/80 hover:text-primary hover:bg-muted/50 transition-colors"
                          >
                            <Icon className="h-4 w-4 text-primary" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                      <div className="pt-1 mt-1 border-t border-border/40 px-3">
                        <Link
                          href="/doctors"
                          onClick={() => setIsSpecialtyMenuOpen(false)}
                          className="flex items-center justify-between text-[11px] font-bold text-primary py-1 hover:underline"
                        >
                          <span>All Specialties</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "transition-colors hover:text-foreground py-1",
                  isActive
                    ? "text-primary font-bold"
                    : "text-foreground/75",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth & CTAs */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {isLoading ? (
            <div className="flex items-center gap-2 shrink-0">
              <div className="h-9 w-16 animate-pulse rounded-md bg-muted/60" />
              <div className="h-9 w-24 animate-pulse rounded-md bg-muted/60" />
            </div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3 shrink-0">
              {/* User Avatar */}
              <Link
                href={getDashboardPath(user.role)}
                className="flex items-center gap-2 rounded-full p-0.5 hover:opacity-85 transition-opacity shrink-0"
                title={`Dashboard (${user.name})`}
              >
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 overflow-hidden bg-primary/10 text-primary shrink-0">
                  {user.profileImageUrl ? (
                    <Image
                      src={user.profileImageUrl}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <span className="text-xs font-semibold text-foreground max-w-28 truncate hidden xl:inline-block">
                  {user.name}
                </span>
              </Link>

              <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs h-9 shrink-0 whitespace-nowrap">
                <Link href={getDashboardPath(user.role)}>
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Dashboard</span>
                </Link>
              </Button>

              {/* Prominent Get Appointment Button */}
              <Button asChild size="sm" className="gap-1.5 text-xs h-9 shadow-xs shrink-0 whitespace-nowrap">
                <Link href="/doctors">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Get Appointment</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                disabled={isLoggingOut}
                className="text-xs text-muted-foreground hover:text-destructive h-9 px-2 shrink-0"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 shrink-0">
              <Button asChild variant="ghost" size="sm" className="text-xs font-semibold h-9 shrink-0 whitespace-nowrap">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="text-xs font-semibold h-9 shrink-0 whitespace-nowrap">
                <Link href="/register">Register</Link>
              </Button>
              <Button asChild size="sm" className="gap-1.5 text-xs font-bold h-9 shadow-sm shrink-0 whitespace-nowrap">
                <Link href="/doctors">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Get Appointment</span>
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={toggleMobileNav}
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          aria-expanded={isMobileNavOpen}
          aria-label="Toggle navigation menu"
        >
          {isMobileNavOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileNavOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeAllNav}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-border flex flex-col gap-2.5">
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-9 w-full animate-pulse rounded-md bg-muted/60" />
                <div className="h-9 w-full animate-pulse rounded-md bg-muted/60" />
              </div>
            ) : isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/60">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 overflow-hidden bg-primary/10 text-primary shrink-0">
                    {user.profileImageUrl ? (
                      <Image
                        src={user.profileImageUrl}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Button asChild className="w-full justify-center gap-2" onClick={closeAllNav}>
                  <Link href="/doctors">
                    <Calendar className="h-4 w-4" />
                    <span>Get Appointment</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full justify-center gap-2" onClick={closeAllNav}>
                  <Link href={getDashboardPath(user.role)}>
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-center text-destructive"
                  onClick={() => {
                    closeAllNav();
                    logout();
                  }}
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="w-full justify-center gap-2 shadow-xs" onClick={closeAllNav}>
                  <Link href="/doctors">
                    <Calendar className="h-4 w-4" />
                    <span>Get Appointment</span>
                  </Link>
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" className="w-full justify-center" onClick={closeAllNav}>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-center" onClick={closeAllNav}>
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default PublicHeader;