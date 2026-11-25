/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

import bcrypt from "bcryptjs";
import { pathToFileURL } from "url";
import config from "@/config";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/winston";
import {
  DoctorVerificationStatus,
  Role,
  ScheduleStatus,
  UserStatus,
} from "../../generated/prisma/enums";
import { generateSlots } from "@/modules/v1/schedule/schedule.service";
import { getZonedTime } from "@/modules/v1/schedule/schedule.utils";
import {
  minutesToTime,
  timeToMinutes,
} from "@/modules/v1/schedule/schedule.validation";

interface SeedDoctorInput {
  name: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  qualifications: string;
  experienceYears: number;
  consultationFee: number;
  bio: string;
  contactNumber: string;
  address: string;
  profileImageUrl: string;
  meetCode: string;
}

const SEED_DOCTORS: SeedDoctorInput[] = [
  {
    name: "Dr. Sarah Jenkins",
    email: "sarah.jenkins@healthnest.demo",
    specialization: "Cardiology",
    licenseNumber: "HN-MD-1001",
    qualifications: "MD, FACC — Johns Hopkins University",
    experienceYears: 14,
    consultationFee: 65,
    bio: "Board-certified interventional cardiologist specializing in preventive heart care, hypertension management, and lipid disorders.",
    contactNumber: "+1-555-0101",
    address: "120 Heart & Vascular Center, Boston, MA",
    profileImageUrl: "/images/doctors/doctor-1.jpg",
    meetCode: "hn-card-1001",
  },
  {
    name: "Dr. Marcus Vance",
    email: "marcus.vance@healthnest.demo",
    specialization: "Neurology",
    licenseNumber: "HN-MD-1002",
    qualifications: "MD, PhD, FAAN — Stanford Medical School",
    experienceYears: 18,
    consultationFee: 75,
    bio: "Clinical neurologist focused on migraine therapeutics, epilepsy care, and comprehensive neurodegenerative evaluations.",
    contactNumber: "+1-555-0102",
    address: "450 Neurosciences Pavilion, Palo Alto, CA",
    profileImageUrl: "/images/doctors/doctor-4.jpg",
    meetCode: "hn-neur-1002",
  },
  {
    name: "Dr. Elena Rostova",
    email: "elena.rostova@healthnest.demo",
    specialization: "Dermatology",
    licenseNumber: "HN-MD-1003",
    qualifications: "MD, FAAD — NYU Grossman School of Medicine",
    experienceYears: 9,
    consultationFee: 50,
    bio: "Medical and cosmetic dermatologist treating eczema, acne, rosacea, and early skin cancer screening via high-resolution tele-dermatology.",
    contactNumber: "+1-555-0103",
    address: "880 Madison Clinical Suite, New York, NY",
    profileImageUrl: "/images/doctors/doctor-3.jpg",
    meetCode: "hn-derm-1003",
  },
  {
    name: "Dr. David Chen",
    email: "david.chen@healthnest.demo",
    specialization: "Pediatrics",
    licenseNumber: "HN-MD-1004",
    qualifications: "MD, FAAP — University of Washington",
    experienceYears: 11,
    consultationFee: 40,
    bio: "Dedicated pediatrician providing developmental guidance, childhood immunization counseling, and acute pediatric telehealth visits.",
    contactNumber: "+1-555-0104",
    address: "215 Children's Wellness Clinic, Seattle, WA",
    profileImageUrl: "/images/doctors/doctor-2.jpg",
    meetCode: "hn-peds-1004",
  },
  {
    name: "Dr. Priya Nair",
    email: "priya.nair@healthnest.demo",
    specialization: "Gynecology",
    licenseNumber: "HN-MD-1005",
    qualifications: "MD, FACOG — University of Pennsylvania",
    experienceYears: 13,
    consultationFee: 55,
    bio: "Obstetrician-gynecologist offering compassionate women's health consultations, PCOS management, and prenatal care guidance.",
    contactNumber: "+1-555-0105",
    address: "310 Women's Health Plaza, Philadelphia, PA",
    profileImageUrl: "/images/doctors/doctor-5.jpg",
    meetCode: "hn-gyn-1005",
  },
  {
    name: "Dr. Robert Thorne",
    email: "robert.thorne@healthnest.demo",
    specialization: "Orthopedics",
    licenseNumber: "HN-MD-1006",
    qualifications: "MD, FAAOS — Mayo Clinic Alix School of Medicine",
    experienceYears: 20,
    consultationFee: 70,
    bio: "Sports medicine and orthopedic specialist helping patients recover from joint injuries, back pain, and post-operative rehabilitation.",
    contactNumber: "+1-555-0106",
    address: "700 Musculoskeletal Institute, Chicago, IL",
    profileImageUrl: "/images/doctors/doctor-6.png",
    meetCode: "hn-orth-1006",
  },
  {
    name: "Dr. Amara Okafor",
    email: "amara.okafor@healthnest.demo",
    specialization: "Psychiatry",
    licenseNumber: "HN-MD-1007",
    qualifications: "MD, MPH — Yale School of Medicine",
    experienceYears: 8,
    consultationFee: 60,
    bio: "Adult psychiatrist specializing in anxiety disorders, burnout recovery, sleep medicine, and evidence-based medication management.",
    contactNumber: "+1-555-0107",
    address: "190 Mindful Care Center, New Haven, CT",
    profileImageUrl: "/images/doctors/doctor-7.png",
    meetCode: "hn-psyc-1007",
  },
  {
    name: "Dr. Liam O'Connor",
    email: "liam.oconnor@healthnest.demo",
    specialization: "General Medicine",
    licenseNumber: "HN-MD-1008",
    qualifications: "MD, ABFM — University of Michigan",
    experienceYears: 7,
    consultationFee: 30,
    bio: "Primary care physician focused on acute illness triage, chronic disease check-ins, lab review, and holistic preventive medicine.",
    contactNumber: "+1-555-0108",
    address: "540 Harbor Family Practice, Portland, ME",
    profileImageUrl: "/images/doctors/doctor-4.jpg",
    meetCode: "hn-genm-1008",
  },
  {
    name: "Dr. Nadia Al-Mansoor",
    email: "nadia.almansoor@healthnest.demo",
    specialization: "Endocrinology",
    licenseNumber: "HN-MD-1009",
    qualifications: "MD, FACE — Columbia University",
    experienceYears: 12,
    consultationFee: 58,
    bio: "Endocrinologist specializing in diabetes technology, thyroid disorders, metabolic health, and osteoporosis care.",
    contactNumber: "+1-555-0109",
    address: "610 Metabolic Care Tower, New York, NY",
    profileImageUrl: "/images/doctors/doctor-1.jpg",
    meetCode: "hn-endo-1009",
  },
  {
    name: "Dr. Kenji Takahashi",
    email: "kenji.takahashi@healthnest.demo",
    specialization: "Gastroenterology",
    licenseNumber: "HN-MD-1010",
    qualifications: "MD, FACG — UCLA David Geffen School of Medicine",
    experienceYears: 16,
    consultationFee: 68,
    bio: "Digestive health specialist managing IBS, acid reflux, celiac disease, and personalized nutrition-linked GI care.",
    contactNumber: "+1-555-0110",
    address: "920 Digestive Wellness Center, Los Angeles, CA",
    profileImageUrl: "/images/doctors/doctor-2.jpg",
    meetCode: "hn-gast-1010",
  },
  {
    name: "Dr. Sofia Morales",
    email: "sofia.morales@healthnest.demo",
    specialization: "Ophthalmology",
    licenseNumber: "HN-MD-1011",
    qualifications: "MD, FAAO — Baylor College of Medicine",
    experienceYears: 6,
    consultationFee: 45,
    bio: "Ophthalmologist providing tele-triage for ocular allergies, dry eye syndrome, vision changes, and diabetic eye screening guidance.",
    contactNumber: "+1-555-0111",
    address: "330 Vision Care Clinic, Houston, TX",
    profileImageUrl: "/images/doctors/doctor-3.jpg",
    meetCode: "hn-opht-1011",
  },
  {
    name: "Dr. Benjamin Wright",
    email: "benjamin.wright@healthnest.demo",
    specialization: "Cardiology",
    licenseNumber: "HN-MD-1012",
    qualifications: "MD, FACC — Duke University School of Medicine",
    experienceYears: 22,
    consultationFee: 80,
    bio: "Senior cardiologist with two decades of experience in arrhythmia evaluation, heart failure optimization, and cardiac second opinions.",
    contactNumber: "+1-555-0112",
    address: "805 Piedmont Heart Institute, Durham, NC",
    profileImageUrl: "/images/doctors/doctor-6.png",
    meetCode: "hn-card-1012",
  },
  {
    name: "Dr. Hannah Kim",
    email: "hannah.kim@healthnest.demo",
    specialization: "Pediatrics",
    licenseNumber: "HN-MD-1013",
    qualifications: "MD, FAAP — Northwestern University Feinberg",
    experienceYears: 5,
    consultationFee: 35,
    bio: "Pediatrician passionate about newborn care, adolescent wellness, allergy management, and parent-friendly virtual follow-ups.",
    contactNumber: "+1-555-0113",
    address: "145 Lakeshore Pediatrics, Chicago, IL",
    profileImageUrl: "/images/doctors/doctor-7.png",
    meetCode: "hn-peds-1013",
  },
  {
    name: "Dr. Tariq Hassan",
    email: "tariq.hassan@healthnest.demo",
    specialization: "General Medicine",
    licenseNumber: "HN-MD-1014",
    qualifications: "MBBS, MD — University of Toronto",
    experienceYears: 10,
    consultationFee: 25,
    bio: "Internal and general medicine physician offering accessible, thorough virtual consultations for everyday acute and chronic health needs.",
    contactNumber: "+1-555-0114",
    address: "410 Community Care Medical, Detroit, MI",
    profileImageUrl: "/images/doctors/doctor-5.jpg",
    meetCode: "hn-genm-1014",
  },
];

const addDays = (dateStr: string, days: number): string => {
  const date = new Date(`${dateStr}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const UPCOMING_SHIFT_PATTERNS: { startTime: string; endTime: string }[] = [
  { startTime: "09:00", endTime: "15:00" }, // 6 hours (18 slots)
  { startTime: "14:00", endTime: "20:00" }, // 6 hours (18 slots)
  { startTime: "16:00", endTime: "22:00" }, // 6 hours (18 slots)
  { startTime: "10:00", endTime: "14:00" }, // 4 hours (12 slots)
];

const upsertPublishedScheduleWithSlots = async (params: {
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink: string;
  isToday: boolean;
  currentTime: string;
}) => {
  const { doctorId, date, startTime, endTime, meetLink, isToday, currentTime } =
    params;

  const existing = await prisma.schedule.findUnique({
    where: {
      unique_doctor_schedule_date: {
        doctorId,
        date,
      },
    },
    include: {
      slots: true,
      appointments: {
        select: { id: true },
      },
    },
  });

  const slots = generateSlots(startTime, endTime);
  if (slots.length === 0) return;

  if (!existing) {
    await prisma.$transaction(async (tx) => {
      await tx.schedule.create({
        data: {
          doctorId,
          date,
          startTime,
          endTime,
          meetLink,
          status: ScheduleStatus.PUBLISHED,
          totalSlots: slots.length,
          slots: {
            create: slots.map((s) => ({
              serialNumber: s.serialNumber,
              startTime: s.startTime,
              endTime: s.endTime,
              isBooked: false,
            })),
          },
        },
      });
    });
    return;
  }

  // If today's existing seeded schedule already passed its startTime and has no appointments,
  // refresh it to a future window today so demo/today views stay populated.
  if (
    isToday &&
    existing.startTime <= currentTime &&
    existing.appointments.length === 0
  ) {
    await prisma.$transaction(async (tx) => {
      await tx.slot.deleteMany({
        where: { scheduleId: existing.id },
      });

      await tx.schedule.update({
        where: { id: existing.id },
        data: {
          startTime,
          endTime,
          meetLink,
          status: ScheduleStatus.PUBLISHED,
          isDeleted: false,
          totalSlots: slots.length,
          slots: {
            create: slots.map((s) => ({
              serialNumber: s.serialNumber,
              startTime: s.startTime,
              endTime: s.endTime,
              isBooked: false,
            })),
          },
        },
      });
    });
  }
};

export const seedDoctorsAndSchedules = async () => {
  try {
    const defaultPassword =
      process.env.SEED_DOCTOR_PASSWORD || "Doctor@123456";
    const hashedPassword = await bcrypt.hash(
      defaultPassword,
      Number(config.bcrypt_salt_rounds) || 12,
    );

    const { todayDate, currentTime } = getZonedTime(
      new Date(),
      config.timezone || "Asia/Dhaka",
    );
    const currentMinutes = timeToMinutes(currentTime);

    // Round current time + 30 min up to next 30-min boundary for today's schedules
    const baseTodayStartMin = Math.ceil((currentMinutes + 30) / 30) * 30;
    const maxEndMinutes = 23 * 60 + 40; // 23:40 same calendar day
    const canSeedToday = baseTodayStartMin + 180 <= maxEndMinutes;

    let doctorsSeeded = 0;
    let schedulesChecked = 0;

    for (let idx = 0; idx < SEED_DOCTORS.length; idx++) {
      const doc = SEED_DOCTORS[idx];

      try {
        const user = await prisma.user.upsert({
          where: { email: doc.email },
          update: {
            name: doc.name,
            role: Role.DOCTOR,
            status: UserStatus.ACTIVE,
            emailVerified: true,
            isDeleted: false,
            profileImageUrl: doc.profileImageUrl,
          },
          create: {
            name: doc.name,
            email: doc.email,
            password: hashedPassword,
            role: Role.DOCTOR,
            status: UserStatus.ACTIVE,
            emailVerified: true,
            needPasswordChange: false,
            profileImageUrl: doc.profileImageUrl,
          },
        });

        const doctor = await prisma.doctor.upsert({
          where: { email: doc.email },
          update: {
            name: doc.name,
            specialization: doc.specialization,
            qualifications: doc.qualifications,
            experienceYears: doc.experienceYears,
            consultationFee: doc.consultationFee,
            bio: doc.bio,
            contactNumber: doc.contactNumber,
            address: doc.address,
            verificationStatus: DoctorVerificationStatus.APPROVED,
            isDeleted: false,
            userId: user.id,
          },
          create: {
            name: doc.name,
            email: doc.email,
            specialization: doc.specialization,
            licenseNumber: doc.licenseNumber,
            qualifications: doc.qualifications,
            experienceYears: doc.experienceYears,
            consultationFee: doc.consultationFee,
            bio: doc.bio,
            contactNumber: doc.contactNumber,
            address: doc.address,
            verificationStatus: DoctorVerificationStatus.APPROVED,
            reviewedAt: new Date(),
            userId: user.id,
          },
        });

        doctorsSeeded++;

        // Seed TODAY schedule for first 8 doctors (diverse specialties) if >= 3h left today
        if (canSeedToday && idx < 8) {
          const staggerOffset = (idx % 3) * 30;
          const candidateStart = baseTodayStartMin + staggerOffset;
          const todayStartMin =
            candidateStart + 180 <= maxEndMinutes
              ? candidateStart
              : baseTodayStartMin;
          const todayEndMin = Math.min(todayStartMin + 240, maxEndMinutes); // 4 hours (or up to 23:40)

          if (todayEndMin - todayStartMin >= 180) {
            await upsertPublishedScheduleWithSlots({
              doctorId: doctor.id,
              date: todayDate,
              startTime: minutesToTime(todayStartMin),
              endTime: minutesToTime(todayEndMin),
              meetLink: `https://meet.google.com/${doc.meetCode}-t0`,
              isToday: true,
              currentTime,
            });
            schedulesChecked++;
          }
        }

        // Seed upcoming schedules (+1, +2, +3 days)
        const upcomingOffsets = [1, 2, 3];
        for (let i = 0; i < upcomingOffsets.length; i++) {
          const dayOffset = upcomingOffsets[i];
          const shift =
            UPCOMING_SHIFT_PATTERNS[
              (idx + i) % UPCOMING_SHIFT_PATTERNS.length
            ];
          const targetDate = addDays(todayDate, dayOffset);

          await upsertPublishedScheduleWithSlots({
            doctorId: doctor.id,
            date: targetDate,
            startTime: shift.startTime,
            endTime: shift.endTime,
            meetLink: `https://meet.google.com/${doc.meetCode}-d${dayOffset}`,
            isToday: false,
            currentTime,
          });
          schedulesChecked++;
        }
      } catch (docError) {
        logger.warn(
          `Failed seeding doctor ${doc.email}: ${(docError as Error)?.message}`,
        );
      }
    }

    logger.info(
      `Seeded/verified ${doctorsSeeded} doctors and ${schedulesChecked} published schedules (today=${todayDate}).`,
    );
  } catch (error) {
    logger.error("Error in seedDoctorsAndSchedules:", error);
  }
};

// Allow standalone CLI execution (`pnpm seed:doctors`)
const isDirectExecution =
  typeof process !== "undefined" &&
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  prisma
    .$connect()
    .then(() => seedDoctorsAndSchedules())
    .catch((err) => {
      console.error("Standalone doctor seed failed:", err);
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
