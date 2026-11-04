/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

import AppError from "@/middleware/AppError";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { adminService } from "./admin.service";
import { Role, UserStatus } from "../../../../generated/prisma/enums";

// Create an administrator and deliver the generated credentials by email.
const createAdmin = (role:"ADMIN" | "SUPER_ADMIN" ) =>
  catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.createAdmin(req.body, role);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Administrator created successfully",
      data: result,
    });
  });

// List administrators of the requested role.
const listAdmins = (role: "ADMIN" | "SUPER_ADMIN") =>
  catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.listAdmins(role);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Administrators retrieved successfully",
      data: result,
    });
  });

// Return account details for an authorized administrator.
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getUserById(String(req.params.userId));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

// Block or unblock an administrator without allowing self-lockout.
const setBlocked = (
  role: "ADMIN" | "SUPER_ADMIN",
  status: "BLOCKED" | "ACTIVE",
) =>
  catchAsync(async (req: Request, res: Response) => {
    if (req.user?.userId === req.params.userId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You cannot change your own account status",
      );
    }
    const result = await adminService.setAdminBlocked(
      String(req.params.userId),
      role,
      status,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        status === "BLOCKED"
          ? "Administrator blocked successfully"
          : "Administrator unblocked successfully",
      data: result,
    });
  });

// List all active doctor records for administrator screens.
const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllDoctors();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctors retrieved successfully",
    data: result,
  });
});

// List verified applications waiting for administrative review.
const getPendingDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getPendingDoctors();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending doctors retrieved successfully",
    data: result,
  });
});

// Return the complete doctor record for administrative review.
const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getDoctorById(String(req.params.doctorId));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor details retrieved successfully",
    data: result,
  });
});

// Approve an application, activate its user account, and send the welcome email.
const approveDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.approveDoctor(
    String(req.params.doctorId),
    req.user!.userId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor approved successfully",
    data: result,
  });
});

// Reject an application and persist the optional review reason.
const rejectDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.rejectDoctor(
    String(req.params.doctorId),
    req.user!.userId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor application rejected successfully",
    data: result,
  });
});

// Block a doctor's user account while retaining the doctor record.
const blockDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.setDoctorBlocked(
    String(req.params.doctorId),
    UserStatus.BLOCKED,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor blocked successfully",
    data: result,
  });
});

// Restore a blocked doctor's user account.
const unblockDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.setDoctorBlocked(
    String(req.params.doctorId),
    UserStatus.ACTIVE,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor unblocked successfully",
    data: result,
  });
});

// Retrieve a paginated list of all patients.
const getAllPatients = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllPatients(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patients retrieved successfully",
    data: {
      patients: result.patients,
      meta: result.meta,
    },
    meta: {
      page: result.meta.page,
      limit: result.meta.limit,
      total: result.meta.total,
      totalPage: result.meta.totalPages,
    },
  });
});

// Retrieve complete details of a specific patient.
const getPatientById = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getPatientById(
    String(req.params.patientId),
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient details retrieved successfully",
    data: {
      patient: result,
    },
  });
});

//Block a patient account.
const blockPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.blockPatient(
    String(req.params.patientId),
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient blocked successfully",
    data: {
      patient: result,
    },
  });
});

// Restore a blocked patient account.
const unblockPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.unblockPatient(
    String(req.params.patientId),
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient unblocked successfully",
    data: {
      patient: result,
    },
  });
});

export const adminController = {
  createAdmin,
  listAdmins,
  getUserById,
  setBlocked,
  getAllDoctors,
  getPendingDoctors,
  getDoctorById,
  approveDoctor,
  rejectDoctor,
  blockDoctor,
  unblockDoctor,
  getAllPatients,
  getPatientById,
  blockPatient,
  unblockPatient,
};
