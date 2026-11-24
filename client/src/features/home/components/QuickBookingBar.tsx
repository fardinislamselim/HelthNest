"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

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
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-10" id="quick-booking">
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl p-5 lg:p-6 border border-border/60">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Specialty Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="quick-specialty"
              className="text-xs font-semibold text-on-surface flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">medical_services</span>
              <span>Medical Specialty</span>
            </label>
            <div className="relative">
              <select
                id="quick-specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-surface text-sm text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer pr-10 border border-border/60"
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
              <span className="material-symbols-outlined text-on-surface-variant absolute right-3 top-3 pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Insurance Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="quick-insurance"
              className="text-xs font-semibold text-on-surface flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">health_and_safety</span>
              <span>Insurance Provider</span>
            </label>
            <div className="relative">
              <select
                id="quick-insurance"
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-surface text-sm text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer pr-10 border border-border/60"
              >
                <option value="bluecross">Blue Cross Blue Shield</option>
                <option value="aetna">Aetna Healthcare</option>
                <option value="cigna">Cigna Global</option>
                <option value="united">UnitedHealthcare</option>
                <option value="medicare">Medicare Advantage</option>
                <option value="selfpay">Self-Pay / HSA Eligible ($49)</option>
              </select>
              <span className="material-symbols-outlined text-on-surface-variant absolute right-3 top-3 pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Consultation Day */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="quick-day"
              className="text-xs font-semibold text-on-surface flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
              <span>Appointment Day</span>
            </label>
            <div className="relative">
              <select
                id="quick-day"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-surface text-sm text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer pr-10 border border-border/60"
              >
                <option value="today">Today (Immediate On-Demand)</option>
                <option value="tomorrow">Tomorrow, Morning</option>
                <option value="weekend">This Upcoming Weekend</option>
              </select>
              <span className="material-symbols-outlined text-on-surface-variant absolute right-3 top-3 pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Find Doctor Submit */}
          <div>
            <button
              type="submit"
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-all shadow-md cursor-pointer active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
              <span>Find Doctor</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default QuickBookingBar;
