"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Stethoscope, Shield, Calendar, Search, ChevronDown } from "lucide-react";

export function QuickBookingBar() {
  const router = useRouter();
  const [specialty, setSpecialty] = React.useState("Cardiology");
  const [insurance, setInsurance] = React.useState("bluecross");
  const [day, setDay] = React.useState("today");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (day === "today") {
      router.push(`/dashboard/schedules`);
    } else {
      router.push(`/doctors?specialization=${encodeURIComponent(specialty)}`);
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-10 overflow-hidden" id="quick-booking">
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl p-5 lg:p-6 border border-border/60 w-full">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end w-full">
          {/* Specialty Dropdown */}
          <div className="flex flex-col gap-1.5 w-full">
            <label
              htmlFor="quick-specialty"
              className="text-xs font-semibold text-on-surface flex items-center gap-1.5"
            >
              <Stethoscope className="h-4 w-4 text-primary shrink-0" />
              <span>Medical Specialty</span>
            </label>
            <div className="relative w-full">
              <select
                id="quick-specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-surface text-sm text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-border/60 truncate"
              >
                <option value="Cardiology">Cardiology &amp; Preventive</option>
                <option value="General Medicine">General Practice / Family Care</option>
                <option value="Pediatrics">Pediatrics &amp; Child Health</option>
                <option value="Dermatology">Dermatology &amp; Skin Care</option>
                <option value="Psychiatry">Psychiatry &amp; Counseling</option>
                <option value="Neurology">Neurology &amp; Headaches</option>
                <option value="Orthopedics">Orthopedics &amp; Joint Care</option>
                <option value="Ophthalmology">Ophthalmology &amp; Eye Care</option>
              </select>
              <ChevronDown className="h-4 w-4 text-on-surface-variant absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
            </div>
          </div>

          {/* Insurance Dropdown */}
          <div className="flex flex-col gap-1.5 w-full">
            <label
              htmlFor="quick-insurance"
              className="text-xs font-semibold text-on-surface flex items-center gap-1.5"
            >
              <Shield className="h-4 w-4 text-primary shrink-0" />
              <span>Insurance Provider</span>
            </label>
            <div className="relative w-full">
              <select
                id="quick-insurance"
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-surface text-sm text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-border/60 truncate"
              >
                <option value="bluecross">Blue Cross Blue Shield</option>
                <option value="aetna">Aetna Healthcare</option>
                <option value="cigna">Cigna Global</option>
                <option value="united">UnitedHealthcare</option>
                <option value="medicare">Medicare Advantage</option>
                <option value="selfpay">Self-Pay / HSA Eligible ($49)</option>
              </select>
              <ChevronDown className="h-4 w-4 text-on-surface-variant absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
            </div>
          </div>

          {/* Consultation Day */}
          <div className="flex flex-col gap-1.5 w-full">
            <label
              htmlFor="quick-day"
              className="text-xs font-semibold text-on-surface flex items-center gap-1.5"
            >
              <Calendar className="h-4 w-4 text-primary shrink-0" />
              <span>Appointment Day</span>
            </label>
            <div className="relative w-full">
              <select
                id="quick-day"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-surface text-sm text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-border/60 truncate"
              >
                <option value="today">Today (Immediate On-Demand)</option>
                <option value="tomorrow">Tomorrow, Morning</option>
                <option value="weekend">This Upcoming Weekend</option>
              </select>
              <ChevronDown className="h-4 w-4 text-on-surface-variant absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
            </div>
          </div>

          {/* Find Doctor Submit */}
          <div className="w-full">
            <button
              type="submit"
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-all shadow-md cursor-pointer active:scale-[0.98] whitespace-nowrap"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span>Find Doctor</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default QuickBookingBar;
