import type { Metadata } from "next";
import {
  HeroSection,
  AnnouncementMarquee,
  QuickHealthcareServices,
  AboutSection,
  MedicalCategoriesSection,
  FeaturedDoctorsSection,
  HowItWorksSection,
  PatientTestimonialsSection,
  FinalCtaSection,
} from "@/features/home";

export const metadata: Metadata = {
  title: "HealthNest | Consult Best Doctors Near You - Telemedicine & Online Appointments",
  description:
    "Connect with trusted healthcare professionals, explore medical specialties, book 20-minute video appointments with ease, and receive digital prescriptions.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 2. Hero Section with Professional Doctor Images */}
      <HeroSection />

      {/* 3. Announcement Marquee */}
      <AnnouncementMarquee />

      {/* 4. Quick Healthcare Services */}
      <QuickHealthcareServices />

      {/* 5. About HealthNest */}
      <AboutSection />

      {/* 6. Medical Categories / Specialties */}
      <MedicalCategoriesSection />

      {/* 7. Top / Featured Doctors */}
      <FeaturedDoctorsSection />

      {/* 8. How HealthNest Works – 4 Easy Steps */}
      <HowItWorksSection />

      {/* 9. Patient Testimonials */}
      <PatientTestimonialsSection />

      {/* 11. Final Healthcare CTA Banner */}
      <FinalCtaSection />
    </div>
  );
}
