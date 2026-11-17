"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Award,
  DollarSign,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { usePublicDoctors } from "@/features/public-doctors/hooks/usePublicDoctors";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function FeaturedDoctorsSection() {
  const { doctors, isLoading, isError, error, refetch } = usePublicDoctors({
    limit: 4,
    page: 1,
  });

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-muted/20 border-b border-border/70">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header with exact heading requested */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Verified Medical Specialists</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground text-balance">
              Top Specialists Dedicated To Your Care
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty">
              Meet experienced medical professionals ready to help you.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="self-start md:self-auto gap-2">
            <Link href="/doctors">
              <span>View All Doctors</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-96 rounded-2xl border border-border/80 bg-card p-5 space-y-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-xl bg-muted shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-28 bg-muted rounded" />
                    <div className="h-3 w-20 bg-muted/70 rounded" />
                  </div>
                </div>
                <div className="h-4 w-full bg-muted/50 rounded" />
                <div className="h-16 rounded-lg bg-muted/30" />
                <div className="h-9 w-full bg-muted rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-3">
            <p className="text-sm font-semibold text-destructive">
              {error?.message || "Could not retrieve doctor profiles at this time."}
            </p>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && doctors.length === 0 && (
          <div className="rounded-2xl border border-border/80 bg-card p-10 text-center space-y-4 max-w-lg mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
              <User className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                Doctors Joining Shortly
              </h3>
              <p className="text-xs text-muted-foreground">
                Our medical review board is currently processing practitioner applications.
              </p>
            </div>
            <Button asChild size="sm">
              <Link href="/doctors/apply">Apply as a Doctor</Link>
            </Button>
          </div>
        )}

        {/* Doctors 4-Column Grid */}
        {!isLoading && !isError && doctors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="flex flex-col justify-between h-full border border-border/80 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-200 group rounded-2xl overflow-hidden"
              >
                <CardContent className="p-5 space-y-4 flex-1">
                  {/* Top Doctor Avatar & Details */}
                  <div className="flex items-start gap-3.5">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-primary/20 overflow-hidden bg-primary/10 text-primary">
                      {doctor.profileImageUrl ? (
                        <Image
                          src={doctor.profileImageUrl}
                          alt={doctor.name}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      ) : (
                        <User className="h-7 w-7 text-primary/70" />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm sm:text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          Dr. {doctor.name}
                        </h3>
                        <span title="Verified Healthcare Practitioner">
                          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[11px] font-semibold bg-primary/10 text-primary border-transparent truncate max-w-full"
                      >
                        {doctor.specialization}
                      </Badge>
                    </div>
                  </div>

                  {/* Qualifications & Experience */}
                  <div className="space-y-1.5 text-xs">
                    {doctor.qualifications && (
                      <p className="text-muted-foreground truncate" title={doctor.qualifications}>
                        {doctor.qualifications}
                      </p>
                    )}
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/40 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Award className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="tabular-nums">{doctor.experienceYears} Years Exp.</span>
                      </div>
                      {doctor.consultationFee != null && (
                        <div className="flex items-center gap-0.5 font-bold text-foreground">
                          <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="tabular-nums">${Number(doctor.consultationFee).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio snippet if available */}
                  {doctor.bio && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {doctor.bio}
                    </p>
                  )}
                </CardContent>

                {/* Card Actions */}
                <CardFooter className="p-5 pt-0 grid grid-cols-2 gap-2 border-t border-border/40">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="text-xs h-9 w-full"
                  >
                    <Link href={`/doctors/${doctor.id}`}>View Profile</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="text-xs h-9 w-full shadow-xs gap-1"
                  >
                    <Link href={`/doctors/${doctor.id}`}>
                      <span>Book Slot</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedDoctorsSection;