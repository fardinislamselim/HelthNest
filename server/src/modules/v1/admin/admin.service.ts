/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

import fs from "fs";
import crypto from "crypto";
import ejs from "ejs";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import path from "path";
import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/nodemailer";
import { logger } from "@/lib/winston";
import config from "@/config";
import AppError from "@/middleware/AppError";
import {
  DoctorVerificationStatus,
  Role,
  UserStatus,
} from "../../../../generated/prisma/enums";
import { IPatientFilterQuery, IPatientResponse, IPatientsListResult, IPatientStatusUpdateResponse, TCreateAdmin, TRejectDoctorApplication } from "./admin.interface";
import { Prisma } from "../../../../generated/prisma/client";

// Get the absolute path to a template file, checking multiple possible locations.
const getTemplatePath = (templateName: string) => {
  const possiblePaths = [
    path.join(process.cwd(), "src/templates", templateName),
    path.join(process.cwd(), "server/src/templates", templateName),
    path.join(__dirname, "../../../templates", templateName),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return possiblePaths[0];
};

// Define the fields to be returned for public administrator account data.
const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  personalEmail: true,
  role: true,
  status: true,
  needPasswordChange: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

// Generate a password that is only delivered to the administrator's personal email.
const generateTemporaryPassword = () =>
  `${crypto.randomBytes(9).toString("base64url")}A1!`;

// Render and send the administrator's initial login credentials.
const sendCredentialsEmail = async (
  user: {
    name: string;
    email: string;
    personalEmail: string;
  },
  password: string,
) => {
  const html = await ejs.renderFile(
    path.join(process.cwd(), "src/templates/admin-credentials.ejs"),
    {
      name: user.name,
      organizationEmail: user.email,
      password,
    },
  );

  await transporter.sendMail({
    from: config.email_sender,
    to: user.personalEmail,
    subject: "Your HealthNest administrator account",
    html,
  });
};

// Create an administrator with a forced first-login password change.
const createAdmin = async (
  payload: TCreateAdmin,
  role: "ADMIN" | "SUPER_ADMIN",
) => {
  if (payload.organizationEmail === payload.personalEmail) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Organization and personal emails must be different",
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: payload.organizationEmail },
  });
  if (existingUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Organization email is already in use",
    );
  }

  const temporaryPassword = generateTemporaryPassword();
  const password = await bcrypt.hash(
    temporaryPassword,
    Number(config.bcrypt_salt_rounds) || 12,
  );
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.organizationEmail,
      personalEmail: payload.personalEmail,
      password,
      role: role,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      needPasswordChange: true,
    },
    select: publicUserSelect,
  });

  try {
    await sendCredentialsEmail(
      {
        name: user.name,
        email: user.email,
        personalEmail: user.personalEmail ?? payload.personalEmail,
      },
      temporaryPassword,
    );
  } catch (error) {
    logger.error(
      "Admin account created but credentials email could not be sent:",
      error,
    );
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "Admin account was created, but the credentials email could not be sent",
    );
  }

  return user;
};

// Return non-sensitive administrator account data.
const listAdmins = async (role: Role) =>
  prisma.user.findMany({
    where: { role, isDeleted: false },
    select: publicUserSelect,
    orderBy: { createdAt: "desc" },
  });

// Find one non-deleted user account by ID.
const getUserById = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, isDeleted: false },
    select: publicUserSelect,
  });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  return user;
};

// Change status only when the account currently has the expected administrator role.
const setAdminBlocked = async (
  userId: string,
  role: "ADMIN" | "SUPER_ADMIN",
  status: "BLOCKED" | "ACTIVE",
) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, role, isDeleted: false },
  });
  if (!user)
    throw new AppError(httpStatus.NOT_FOUND, "Administrator not found");

  return prisma.user.update({
    where: { id: userId },
    data: { status },
    select: publicUserSelect,
  });
};

// Doctor management functions for administrators, including listing, approving, rejecting, and blocking doctors.
const doctorSelection = {
  id: true,
  name: true,
  email: true,
  address: true,
  specialization: true,
  licenseNumber: true,
  qualifications: true,
  experienceYears: true,
  bio: true,
  consultationFee: true,
  contactNumber: true,
  verificationStatus: true,
  rejectionReason: true,
  reviewedBy: true,
  reviewedAt: true,
  resume: true,
  additionalFiles: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      emailVerified: true,
      status: true,
      role: true,
    },
  },
} as const;

// Retrieve a list of all doctors.
const getAllDoctors = async () =>
  prisma.doctor.findMany({
    where: { isDeleted: false },
    select: doctorSelection,
    orderBy: { createdAt: "desc" },
  });

// Retrieve a list of all pending doctor applications that have verified emails.
const getPendingDoctors = async () =>
  prisma.doctor.findMany({
    where: {
      isDeleted: false,
      verificationStatus: DoctorVerificationStatus.PENDING,
      user: { emailVerified: true },
    },
    select: doctorSelection,
    orderBy: { createdAt: "asc" },
  });

// Retrieve a single doctor record by ID, ensuring it is not deleted.
const getDoctorById = async (doctorId: string) => {
  const doctor = await prisma.doctor.findFirst({
    where: { id: doctorId, isDeleted: false },
    select: doctorSelection,
  });

  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  return doctor;
};

// Send a welcome email to the doctor after their application is approved.
const sendDoctorWelcomeEmail = async (doctor: {
  name: string;
  email: string;
}) => {
  const templatePath = getTemplatePath("doctor-welcome.ejs");
  const html = await ejs.renderFile(templatePath, { name: doctor.name });

  await transporter.sendMail({
    from: config.email_sender,
    to: doctor.email,
    subject: "Welcome to HealthNest - Your doctor application is approved",
    html,
  });
};

// Approve a doctor application, activate their user account, and send a welcome email.
const approveDoctor = async (doctorId: string, reviewerId: string) => {
  const doctor = await prisma.$transaction(async (tx) => {
    const existingDoctor = await tx.doctor.findFirst({
      where: { id: doctorId, isDeleted: false },
      include: { user: true },
    });

    if (!existingDoctor) {
      throw new AppError(httpStatus.NOT_FOUND, "Doctor not found");
    }

    if (
      existingDoctor.verificationStatus === DoctorVerificationStatus.APPROVED
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, "Doctor is already approved");
    }
    if (!existingDoctor.user.emailVerified) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Doctor email must be verified before approval",
      );
    }

    return tx.doctor.update({
      where: { id: doctorId },
      data: {
        verificationStatus: DoctorVerificationStatus.APPROVED,
        rejectionReason: null,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        user: { update: { status: "ACTIVE" } },
      },
      select: doctorSelection,
    });
  });

  try {
    await sendDoctorWelcomeEmail(doctor);
  } catch (error) {
    logger.error("Doctor approved but welcome email could not be sent:", error);
  }

  return doctor;
};

// Reject a doctor application, update their status, and record the rejection reason.
const rejectDoctor = async (
  doctorId: string,
  reviewerId: string,
  payload: TRejectDoctorApplication,
) => {
  const existingDoctor = await prisma.doctor.findFirst({
    where: { id: doctorId, isDeleted: false },
  });

  if (!existingDoctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor not found");
  }
  if (existingDoctor.verificationStatus === DoctorVerificationStatus.APPROVED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "An approved doctor cannot be rejected",
    );
  }

  return prisma.doctor.update({
    where: { id: doctorId },
    data: {
      verificationStatus: DoctorVerificationStatus.REJECTED,
      rejectionReason: payload.rejectionReason ?? null,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
    },
    select: doctorSelection,
  });
};

// Block or unblock a doctor's user account while retaining the doctor record.
const setDoctorBlocked = async (doctorId: string, status: UserStatus) => {
  const doctor = await prisma.doctor.findFirst({
    where: { id: doctorId, isDeleted: false },
    select: { userId: true },
  });

  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  await prisma.user.update({
    where: { id: doctor.userId },
    data: { status },
  });

  return getDoctorById(doctorId);
};

// Patient management functions for administrators, including listing, retrieving, blocking, and unblocking patients.


const patientSelect = {
  id: true,
  name: true,
  email: true,
  contactNumber: true,
  address: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      profileImageUrl: true,
      createdAt: true,
      updatedAt: true,
      isDeleted: true,
    },
  },
} as const;

// Helper to format patient record safely without sensitive credentials
const formatPatient = (
  patient: Prisma.PatientGetPayload<{ select: typeof patientSelect }>,
): IPatientResponse => ({
  id: patient.id,
  name: patient.name,
  email: patient.email,
  contactNumber: patient.contactNumber,
  address: patient.address,
  isDeleted: patient.isDeleted,
  createdAt: patient.createdAt,
  updatedAt: patient.updatedAt,
  userId: patient.userId,
  status: patient.user.status,
  user: {
    id: patient.user.id,
    name: patient.user.name,
    email: patient.user.email,
    role: patient.user.role,
    status: patient.user.status,
    emailVerified: patient.user.emailVerified,
    profileImageUrl: patient.user.profileImageUrl,
    createdAt: patient.user.createdAt,
    updatedAt: patient.user.updatedAt,
  },
});

// List all patient accounts with pagination and optional search/filter.
const getAllPatients = async (
  query: IPatientFilterQuery = {},
): Promise<IPatientsListResult> => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const searchTerm = (query.searchTerm || query.search || "").trim();

  const whereClause: Prisma.PatientWhereInput = {
    isDeleted: false,
    user: {
      isDeleted: false,
      role: Role.PATIENT,
      ...(query.status
        ? { status: query.status }
        : { status: { not: UserStatus.DELETED } }),
    },
  };

  if (searchTerm) {
    whereClause.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } },
      { contactNumber: { contains: searchTerm, mode: "insensitive" } },
      { address: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  const [total, rawPatients] = await Promise.all([
    prisma.patient.count({ where: whereClause }),
    prisma.patient.findMany({
      where: whereClause,
      select: patientSelect,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return {
    patients: rawPatients.map(formatPatient),
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

// Helper to find a patient by patientId (matches patient.id or patient.userId)
const findPatientOrThrow = async (patientId: string) => {
  const patient = await prisma.patient.findFirst({
    where: {
      OR: [{ id: patientId }, { userId: patientId }],
      isDeleted: false,
    },
    select: patientSelect,
  });

  if (!patient) {
    // Check if ID corresponds to another role's account to return appropriate business error
    const nonPatientUser = await prisma.user.findFirst({
      where: { id: patientId, isDeleted: false },
    });
    if (nonPatientUser && nonPatientUser.role !== Role.PATIENT) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Target account is not a patient",
      );
    }

    const nonPatientDoctor = await prisma.doctor.findFirst({
      where: { id: patientId, isDeleted: false },
    });
    if (nonPatientDoctor) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Target account is not a patient",
      );
    }

    throw new AppError(httpStatus.NOT_FOUND, "Patient not found");
  }

  if (
    patient.user.role !== Role.PATIENT ||
    patient.user.isDeleted ||
    patient.user.status === UserStatus.DELETED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Target account is not a patient",
    );
  }

  return patient;
};

// Retrieve complete details of a specific patient by ID.
const getPatientById = async (patientId: string): Promise<IPatientResponse> => {
  const patient = await findPatientOrThrow(patientId);
  return formatPatient(patient);
};

// Block a patient account.
const blockPatient = async (
  patientId: string,
): Promise<IPatientStatusUpdateResponse> => {
  const patient = await findPatientOrThrow(patientId);

  if (patient.user.status === UserStatus.BLOCKED) {
    throw new AppError(httpStatus.CONFLICT, "Patient is already blocked");
  }

  await prisma.user.update({
    where: { id: patient.userId },
    data: { status: UserStatus.BLOCKED },
  });

  return {
    id: patient.id,
    status: UserStatus.BLOCKED,
    userId: patient.userId,
    name: patient.name,
    email: patient.email,
    contactNumber: patient.contactNumber,
    address: patient.address,
  };
};

// Unblock a blocked patient account.
const unblockPatient = async (
  patientId: string,
): Promise<IPatientStatusUpdateResponse> => {
  const patient = await findPatientOrThrow(patientId);

  if (patient.user.status === UserStatus.ACTIVE) {
    throw new AppError(httpStatus.CONFLICT, "Patient is already active");
  }

  await prisma.user.update({
    where: { id: patient.userId },
    data: { status: UserStatus.ACTIVE },
  });

  return {
    id: patient.id,
    status: UserStatus.ACTIVE,
    userId: patient.userId,
    name: patient.name,
    email: patient.email,
    contactNumber: patient.contactNumber,
    address: patient.address,
  };
};

export const adminService = {
  createAdmin,
  listAdmins,
  getUserById,
  setAdminBlocked,
  getAllDoctors,
  getPendingDoctors,
  getDoctorById,
  approveDoctor,
  rejectDoctor,
  setDoctorBlocked,
  getAllPatients,
  getPatientById,
  blockPatient,
  unblockPatient,
};
