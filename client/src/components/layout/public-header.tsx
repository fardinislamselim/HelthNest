"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/ui-store";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Find Doctors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const { isMobileNavOpen, toggleMobileNav, closeAllNav } = useUiStore();
  const { user, isAuthenticated, isLoading, logout, isLoggingOut, getDashboardPath } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={closeAllNav}
          className="flex items-center gap-2.5 font-semibold text-lg text-foreground hover:opacity-90 transition-opacity"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="font-bold tracking-tight">HealthNest</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-foreground/60",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-16 animate-pulse rounded-md bg-muted/60" />
              <div className="h-8 w-24 animate-pulse rounded-md bg-muted/60" />
            </div>
          ) : isAuthenticated && user ? (
            <>
              <Button asChild size="sm" className="gap-2">
                <Link href={getDashboardPath(user.role)}>
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                disabled={isLoggingOut}
                className="text-xs text-muted-foreground hover:text-destructive gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={toggleMobileNav}
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
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
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeAllNav}
                  className={cn(
                    "px-3 py-2 rounded-md text-base font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-4 border-t border-border flex flex-col gap-2">
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-9 w-full animate-pulse rounded-md bg-muted/60" />
                <div className="h-9 w-full animate-pulse rounded-md bg-muted/60" />
              </div>
            ) : isAuthenticated && user ? (
              <>
                <Button asChild className="w-full justify-center gap-2" onClick={closeAllNav}>
                  <Link href={getDashboardPath(user.role)}>
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard ({user.name})
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-center text-destructive"
                  onClick={() => {
                    closeAllNav();
                    logout();
                  }}
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full justify-center" onClick={closeAllNav}>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="w-full justify-center" onClick={closeAllNav}>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default PublicHeader;

