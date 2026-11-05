/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

import httpStatus from "http-status";
import { prisma } from "@/lib/prisma";
import AppError from "@/middleware/AppError";
import { logger } from "@/lib/winston";
import { Prisma } from "../../../../generated/prisma/client";
import {
  Role,
  AppointmentStatus,
} from "../../../../generated/prisma/enums";
import {
  ICreatePrescriptionPayload,
  IPrescriptionQuery,
  IMedicineItem,
} from "./prescription.interface";
import { generatePrescriptionPdf } from "@/utils/generate-prescription-pdf";
import { sendPrescriptionEmail } from "@/services/email.service";

const prescriptionInclude = {
  doctor: {
    select: {
      id: true,
      name: true,
      email: true,
      specialization: true,
      qualifications: true,
      experienceYears: true,
      contactNumber: true,
      user: {
        select: {
          profileImageUrl: true,
        },
      },
    },
  },
  patient: {
    select: {
      id: true,
      name: true,
      email: true,
      contactNumber: true,
      address: true,
      user: {
        select: {
          profileImageUrl: true,
        },
      },
    },
  },
  appointment: {
    select: {
      id: true,
      serialNumber: true,
      status: true,
      schedule: {
        select: {
          id: true,
          date: true,
          startTime: true,
          endTime: true,
        },
      },
      slot: {
        select: {
          id: true,
          serialNumber: true,
          startTime: true,
          endTime: true,
        },
      },
    },
  },
} satisfies Prisma.PrescriptionInclude;

/**
 * Retrieve doctor profile associated with authenticated user
 */
const getDoctorByUserId = async (userId: string) => {
  const doctor = await prisma.doctor.findFirst({
    where: { userId, isDeleted: false },
  });
  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor profile not found");
  }
  return doctor;
};

/**
 * Retrieve patient profile associated with authenticated user
 */
const getPatientByUserId = async (userId: string) => {
  const patient = await prisma.patient.findFirst({
    where: { userId, isDeleted: false },
  });
  if (!patient) {
    throw new AppError(httpStatus.NOT_FOUND, "Patient profile not found");
  }
  return patient;
};

/**
 * Create a new prescription for a completed appointment
 */
const createPrescription = async (
  userId: string,
  payload: ICreatePrescriptionPayload,
) => {
  // 1. Authenticate and identify the doctor
  const doctor = await getDoctorByUserId(userId);

  // 2. Find and verify appointment existence
  const appointment = await prisma.appointment.findUnique({
    where: { id: payload.appointmentId },
    include: {
      doctor: true,
      patient: { include: { user: true } },
      schedule: true,
      slot: true,
    },
  });

  if (!appointment) {
    throw new AppError(httpStatus.NOT_FOUND, "Appointment not found");
  }

  // 3. Verify appointment ownership (must belong to authenticated doctor)
  if (appointment.doctorId !== doctor.id) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to create a prescription for this appointment",
    );
  }

  // 4. Verify appointment status is exactly COMPLETED
  if (appointment.status !== AppointmentStatus.COMPLETED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Prescription can only be created for completed appointments (current status: ${appointment.status})`,
    );
  }

  // 5. Check if prescription already exists for this appointment
  const existingPrescription = await prisma.prescription.findUnique({
    where: { appointmentId: payload.appointmentId },
  });

  if (existingPrescription) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A prescription has already been created for this appointment",
    );
  }

  // 6. Verify valid patient reference on appointment
  if (!appointment.patientId || !appointment.patient) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Appointment is missing a valid patient reference",
    );
  }

  // 7. Save prescription in database
  const prescription = await prisma.prescription.create({
    data: {
      appointmentId: appointment.id,
      doctorId: doctor.id,
      patientId: appointment.patient.id,
      keyFindings: payload.keyFindings,
      medicines: payload.medicines as any,
      additionalInstructions: payload.additionalInstructions || null,
    },
    include: prescriptionInclude,
  });

  // 8. Generate prescription PDF
  let pdfBuffer: Buffer | null = null;
  try {
    pdfBuffer = await generatePrescriptionPdf({
      prescription: {
        id: prescription.id,
        keyFindings: prescription.keyFindings,
        medicines: payload.medicines,
        additionalInstructions: prescription.additionalInstructions,
        createdAt: prescription.createdAt,
      },
      doctor: {
        name: doctor.name,
        specialization: doctor.specialization,
        qualifications: doctor.qualifications,
        experienceYears: doctor.experienceYears,
        contactNumber: doctor.contactNumber,
        email: doctor.email,
      },
      patient: {
        name: appointment.patient.name,
        email: appointment.patient.email,
        contactNumber: appointment.patient.contactNumber,
        address: appointment.patient.address,
      },
      appointment: {
        id: appointment.id,
        serialNumber: appointment.serialNumber,
        schedule: appointment.schedule,
        slot: appointment.slot,
      },
    });
  } catch (pdfError) {
    logger.error("Failed to generate prescription PDF on creation:", pdfError);
  }

  // 9. Deliver PDF via email to the patient
  if (pdfBuffer && appointment.patient.email) {
    // Deliver asynchronously; failure will be logged and will not delete prescription
    sendPrescriptionEmail({
      to: appointment.patient.email,
      patientName: appointment.patient.name,
      doctorName: doctor.name,
      prescriptionId: prescription.id,
      appointmentId: appointment.id,
      date: prescription.createdAt.toLocaleDateString(),
      pdfBuffer,
    }).catch((emailError) => {
      logger.error("Error during asynchronous prescription email sending:", emailError);
    });
  }

  return prescription;
};

/**
 * Retrieve all prescriptions belonging to the authenticated patient
 */
const getMyPrescriptions = async (
  userId: string,
  query: IPrescriptionQuery = {},
) => {
  const patient = await getPatientByUserId(userId);

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const [total, prescriptions] = await Promise.all([
    prisma.prescription.count({ where: { patientId: patient.id } }),
    prisma.prescription.findMany({
      where: { patientId: patient.id },
      include: prescriptionInclude,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    prescriptions,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

/**
 * Retrieve prescription details by ID (Patient or Doctor with ownership verification)
 */
const getPrescriptionById = async (
  userId: string,
  userRole: Role,
  prescriptionId: string,
) => {
  const prescription = await prisma.prescription.findUnique({
    where: { id: prescriptionId },
    include: prescriptionInclude,
  });

  if (!prescription) {
    throw new AppError(httpStatus.NOT_FOUND, "Prescription not found");
  }

  // Verify ownership based on user role
  if (userRole === Role.PATIENT) {
    const patient = await getPatientByUserId(userId);
    if (prescription.patientId !== patient.id) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to view this prescription",
      );
    }
  } else if (userRole === Role.DOCTOR) {
    const doctor = await getDoctorByUserId(userId);
    if (prescription.doctorId !== doctor.id) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to view this prescription",
      );
    }
  } else if (userRole !== Role.ADMIN && userRole !== Role.SUPER_ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this resource",
    );
  }

  return prescription;
};

/**
 * Retrieve downloadable prescription PDF (Patient or Doctor with ownership verification)
 */
const getPrescriptionPdf = async (
  userId: string,
  userRole: Role,
  prescriptionId: string,
) => {
  const prescription = await getPrescriptionById(
    userId,
    userRole,
    prescriptionId,
  );

  const pdfBuffer = await generatePrescriptionPdf({
    prescription: {
      id: prescription.id,
      keyFindings: prescription.keyFindings,
      medicines: prescription.medicines as unknown as IMedicineItem[],
      additionalInstructions: prescription.additionalInstructions,
      createdAt: prescription.createdAt,
    },
    doctor: {
      name: prescription.doctor.name,
      specialization: prescription.doctor.specialization,
      qualifications: prescription.doctor.qualifications,
      experienceYears: prescription.doctor.experienceYears,
      contactNumber: prescription.doctor.contactNumber,
      email: prescription.doctor.email,
    },
    patient: {
      name: prescription.patient.name,
      email: prescription.patient.email,
      contactNumber: prescription.patient.contactNumber,
      address: prescription.patient.address,
    },
    appointment: {
      id: prescription.appointment.id,
      serialNumber: prescription.appointment.serialNumber,
      schedule: prescription.appointment.schedule,
      slot: prescription.appointment.slot,
    },
  });

  return {
    pdfBuffer,
    filename: `Prescription-${prescription.id.slice(0, 8)}.pdf`,
  };
};

export const prescriptionService = {
  createPrescription,
  getMyPrescriptions,
  getPrescriptionById,
  getPrescriptionPdf,
};
