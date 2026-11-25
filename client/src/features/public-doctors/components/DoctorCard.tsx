"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Award,
  Briefcase,
  DollarSign,
  ShieldCheck,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PublicDoctorItem } from "../types/doctor.types";

interface DoctorCardProps {
  doctor: PublicDoctorItem;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Card className="flex flex-col justify-between h-full p-6 rounded-2xl bg-white border border-slate-200/80 hover:shadow-md hover:border-teal-200 transition-all duration-200 overflow-hidden group">
      {/* Top & Middle Content */}
      <div className="flex-1">
        {/* Top Header: Avatar + Name + Verified Badge + Specialization */}
        <div className="flex items-start gap-4">
          <div className="relative flex w-20 h-20 shrink-0 items-center justify-center rounded-xl border border-teal-100 overflow-hidden bg-teal-50/70 text-teal-700">
            {doctor.profileImageUrl ? (
              <Image
                src={doctor.profileImageUrl}
                alt={doctor.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            ) : (
              <User className="h-8 w-8" />
            )}
          </div>

          <div className="space-y-3 min-w-0 flex-1 pt-0.5">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                  {doctor.name}
                </h3>
                <span
                  title="Verified Healthcare Practitioner"
                  className="shrink-0"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </span>
              </div>

              <Badge
                variant="secondary"
                className="mt-1.5 inline-flex text-xs font-medium tracking-wide px-2.5 py-0.5 bg-teal-50 text-teal-700 hover:bg-teal-100/80 border-transparent"
              >
                {doctor.specialization}
              </Badge>
            </div>
          </div>
        </div>

        {/* Middle Details Section: Experience, Qualifications & Bio */}
        <div className="my-4 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="truncate">
              {doctor.experienceYears}{" "}
              {doctor.experienceYears === 1 ? "Year" : "Years"} Clinical
              Experience
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="truncate" title={doctor.qualifications}>
              {doctor.qualifications}
            </span>
          </div>

          {doctor.bio && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
              {doctor.bio}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Footer Section: Full-width Divider + Consultation Fee + View Profile */}
      <div className="w-full border-t border-slate-100 pt-4 mt-4 flex items-center justify-between gap-4">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
            Consultation
          </span>
          <div className="flex items-center text-sm font-bold text-slate-900 mt-0.5">
            {doctor.consultationFee !== undefined &&
            doctor.consultationFee !== null ? (
              <>
                <DollarSign className="h-3.5 w-3.5 text-emerald-600 -mr-0.5 shrink-0" />
                <span>{doctor.consultationFee.toLocaleString()}</span>
                <span className="text-xs text-slate-500 font-normal ml-1">
                  / 20 min
                </span>
              </>
            ) : (
              <span className="text-xs text-slate-500 font-normal">
                Fee on profile
              </span>
            )}
          </div>
        </div>

        <Button
          variant="default"
          size="sm"
          asChild
          className="px-4 py-2.5 h-auto rounded-xl text-xs font-medium gap-1.5 shadow-xs whitespace-nowrap shrink-0"
        >
          <Link href={`/doctors/${doctor.id}`}>
            <span>View Profile</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

export default DoctorCard;
