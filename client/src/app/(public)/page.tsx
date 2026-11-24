import type { Metadata } from "next";
import {
  HeroSection,
  QuickBookingBar,
  HowItWorksSection,
  FeaturedDoctorsSection,
  TrustBannerSection,
} from "@/features/home";

export const metadata: Metadata = {
  title: "HealthNest | Consult Top Doctors Online, Today - Telemedicine & Online Appointments",
  description:
    "Skip the waiting room. Connect with verified, board-certified specialists for instant 20-minute video consultations from the comfort of your home. Secure, seamless, and insurance-accepted.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-surface">
      {/* 1. Hero Section with Live Triage & Interactive Consultation Card Preview */}
      <HeroSection />

      {/* 2. Interactive Search / Quick Booking Bar Anchor */}
      <QuickBookingBar />

      {/* 3. Care Delivery Architecture: How It Works 3-Step Section & Metrics */}
      <HowItWorksSection />

      {/* 4. On-Duty Clinicians: Featured Specialists Grid */}
      <FeaturedDoctorsSection />

      {/* 5. Certified Telemedicine Trust & Security Banner */}
      <TrustBannerSection />
    </div>
  );
}
