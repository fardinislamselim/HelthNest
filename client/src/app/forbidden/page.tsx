import * as React from "react";
import Link from "next/link";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
        <ShieldAlert className="h-8 w-8" aria-hidden="true" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Access Restricted
      </h1>
      <p className="mt-2 text-base text-muted-foreground max-w-md">
        You do not have the required permissions or role to access this area. If you believe this is an error, please contact platform support.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/" className="gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/login" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Switch Account
          </Link>
        </Button>
      </div>
    </div>
  );
}

