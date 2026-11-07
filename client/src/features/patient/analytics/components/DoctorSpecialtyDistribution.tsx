"use client";

import * as React from "react";
import { Stethoscope } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface SpecialtyItem {
  name: string;
  count: number;
  percentage: number;
}

interface DoctorSpecialtyDistributionProps {
  specialties: SpecialtyItem[];
}

export function DoctorSpecialtyDistribution({
  specialties,
}: DoctorSpecialtyDistributionProps) {
  return (
    <Card className="shadow-xs h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-primary" />
          Specialties Consulted
        </CardTitle>
        <CardDescription className="text-xs">
          Frequency of medical disciplines consulted across your appointments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {specialties.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-6 text-center">
            No specialty distribution data available yet.
          </p>
        ) : (
          <div className="space-y-3">
            {specialties.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-xs font-medium">
                  <span className="text-foreground truncate min-w-0">{item.name}</span>
                  <span className="text-muted-foreground shrink-0">
                    {item.count} {item.count === 1 ? "visit" : "visits"} ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%` }}
                    className="h-full rounded-full bg-primary transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DoctorSpecialtyDistribution;
