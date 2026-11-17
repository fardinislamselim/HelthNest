import * as React from "react";
import Link from "next/link";
import {
  Stethoscope,
  Heart,
  Sparkles,
  Activity,
  UserCheck,
  Smile,
  Eye,
  Pill,
  ArrowRight,
  ShieldPlus,
  Flame,
  Layers,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SpecialtyCategory {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgClass: string;
}

const MEDICAL_CATEGORIES: SpecialtyCategory[] = [
  {
    name: "General Medicine",
    description: "Primary healthcare, preventative wellness, and day-to-day illness treatment.",
    icon: Stethoscope,
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-500/10 group-hover:bg-blue-500/20",
  },
  {
    name: "Cardiology",
    description: "Heart wellness, blood pressure monitoring, and cardiovascular care.",
    icon: Heart,
    colorClass: "text-rose-600 dark:text-rose-400",
    bgClass: "bg-rose-500/10 group-hover:bg-rose-500/20",
  },
  {
    name: "Dermatology",
    description: "Clinical skin evaluations, eczema, acne, and allergy telemedicine care.",
    icon: Sparkles,
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-500/10 group-hover:bg-amber-500/20",
  },
  {
    name: "Neurology",
    description: "Brain and nerve health, migraine management, and neurological diagnosis.",
    icon: Activity,
    colorClass: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-500/10 group-hover:bg-purple-500/20",
  },
  {
    name: "Pediatrics",
    description: "Compassionate, gentle medical care for infants, children, and teens.",
    icon: UserCheck,
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
  },
  {
    name: "Orthopedics",
    description: "Joint pain, bone injuries, spine ergonomics, and mobility wellness.",
    icon: Layers,
    colorClass: "text-cyan-600 dark:text-cyan-400",
    bgClass: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
  },
  {
    name: "Psychiatry",
    description: "Mental health guidance, anxiety, stress therapy, and emotional health.",
    icon: Smile,
    colorClass: "text-indigo-600 dark:text-indigo-400",
    bgClass: "bg-indigo-500/10 group-hover:bg-indigo-500/20",
  },
  {
    name: "Ophthalmology",
    description: "Vision care, eye strain evaluations, and optical consultation advice.",
    icon: Eye,
    colorClass: "text-teal-600 dark:text-teal-400",
    bgClass: "bg-teal-500/10 group-hover:bg-teal-500/20",
  },
  {
    name: "Gastroenterology",
    description: "Digestive health, gut balance, stomach acidity, and liver diagnostics.",
    icon: Pill,
    colorClass: "text-orange-600 dark:text-orange-400",
    bgClass: "bg-orange-500/10 group-hover:bg-orange-500/20",
  },
  {
    name: "Endocrinology",
    description: "Hormone balance, thyroid diagnostics, and comprehensive diabetes care.",
    icon: Flame,
    colorClass: "text-red-600 dark:text-red-400",
    bgClass: "bg-red-500/10 group-hover:bg-red-500/20",
  },
  {
    name: "Oncology",
    description: "Second opinions, cancer screening reviews, and supportive oncology care.",
    icon: ShieldPlus,
    colorClass: "text-violet-600 dark:text-violet-400",
    bgClass: "bg-violet-500/10 group-hover:bg-violet-500/20",
  },
  {
    name: "Gynecology",
    description: "Women's wellness, hormonal health, and reproductive telemedicine.",
    icon: Heart,
    colorClass: "text-pink-600 dark:text-pink-400",
    bgClass: "bg-pink-500/10 group-hover:bg-pink-500/20",
  },
];

export function MedicalCategoriesSection() {
  return (
    <section id="specialties" className="py-16 sm:py-20 lg:py-24 bg-background border-b border-border/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header with exact heading requested */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-3xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <span>Medical Specialties</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground text-balance">
              Medical Support For Every Need
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty">
              Explore medical specialties and find the right doctor for your healthcare needs.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="self-start md:self-auto gap-1.5 text-xs">
            <Link href="/doctors">
              <span>View All Specialties</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Categories Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {MEDICAL_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/doctors?specialization=${encodeURIComponent(cat.name)}`}
                className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
              >
                <Card className="h-full border border-border/70 group-hover:border-primary/40 group-hover:shadow-md transition-all duration-200 bg-card hover:bg-card">
                  <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-3">
                      {/* Icon */}
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200 ${cat.bgClass} ${cat.colorClass}`}
                      >
                        <Icon className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1.5">
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    {/* Action link */}
                    <div className="flex items-center gap-1 text-xs font-semibold text-primary pt-2 border-t border-border/40 group-hover:translate-x-1 transition-transform">
                      <span>Find Doctors</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default MedicalCategoriesSection;