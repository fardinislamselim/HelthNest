import * as React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-muted/20">
      {/* Top minimal header */}
      <header className="p-4 sm:p-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-foreground hover:opacity-90 transition-opacity"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="tracking-tight text-lg">HealthNest</span>
        </Link>
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to Home
        </Link>
      </header>

      {/* Main card container */}
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Simple footer */}
      <footer className="p-4 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} HealthNest. All medical communications are confidential.
      </footer>
    </div>
  );
}

