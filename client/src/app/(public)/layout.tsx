import * as React from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground w-full max-w-full overflow-x-hidden">
      <PublicHeader />
      <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>
      <PublicFooter />
    </div>
  );
}

