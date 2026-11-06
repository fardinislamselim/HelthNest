import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface AuthCardWrapperProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthCardWrapper({
  title,
  description,
  icon,
  children,
  footer,
  className,
}: AuthCardWrapperProps) {
  return (
    <Card className={cn("shadow-lg border-border/80 w-full", className)}>
      <CardHeader className="space-y-1.5 text-center">
        {icon && (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
            {icon}
          </div>
        )}
        <CardTitle className="text-2xl font-bold tracking-tight">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && (
        <CardFooter className="flex flex-col gap-2 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

export default AuthCardWrapper;

