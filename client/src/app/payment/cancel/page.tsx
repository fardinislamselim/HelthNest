import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Payment Incomplete | HealthNest",
  description: "Checkout session was cancelled or timed out",
};

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto max-w-lg py-16 px-4">
      <Card className="shadow-lg border-border/80 text-center animate-in fade-in-50 zoom-in-95">
        <CardHeader className="pb-4 items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-2">
            <AlertCircle className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Payment Incomplete
          </CardTitle>
          <CardDescription className="text-sm">
            Your Stripe checkout session was cancelled or timed out. No payment was charged.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-left">
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground space-y-2">
            <p>
              • Your appointment was not confirmed because payment was not completed.
            </p>
            <p>
              • Unconfirmed appointment slots are automatically released for other patients after timeout.
            </p>
            <p>
              • You can browse today&apos;s available doctors and pick another slot at any time.
            </p>
          </div>
        </CardContent>

        <CardFooter className="border-t border-border/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button asChild variant="outline" className="w-full sm:w-auto gap-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto gap-2">
            <Link href="/dashboard/schedules">
              <RefreshCw className="h-4 w-4" />
              Try Booking Again
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
