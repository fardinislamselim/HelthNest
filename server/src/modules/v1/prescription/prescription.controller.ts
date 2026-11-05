/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { prescriptionService } from "./prescription.service";

/**
 * Create a new prescription
 * @access DOCTOR
 */
const createPrescription = catchAsync(async (req: Request, res: Response) => {
  const result = await prescriptionService.createPrescription(
    req.user!.userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Prescription created successfully",
    data: result,
  });
});

/**
 * Retrieve current patient's prescriptions
 * @access PATIENT
 */
const getMyPrescriptions = catchAsync(async (req: Request, res: Response) => {
  const result = await prescriptionService.getMyPrescriptions(
    req.user!.userId,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Prescriptions retrieved successfully",
    data: result.prescriptions,
    meta: {
      page: result.meta.page,
      limit: result.meta.limit,
      total: result.meta.total,
      totalPage: result.meta.totalPages,
    },
  });
});

/**
 * Retrieve prescription details by ID
 * @access PATIENT / DOCTOR
 */
const getPrescriptionById = catchAsync(async (req: Request, res: Response) => {
  const result = await prescriptionService.getPrescriptionById(
    req.user!.userId,
    req.user!.role,
    String(req.params.prescriptionId),
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Prescription retrieved successfully",
    data: result,
  });
});

/**
 * Download prescription PDF
 * @access PATIENT / DOCTOR
 */
const downloadPrescriptionPdf = catchAsync(
  async (req: Request, res: Response) => {
    const { pdfBuffer, filename } =
      await prescriptionService.getPrescriptionPdf(
        req.user!.userId,
        req.user!.role,
        String(req.params.prescriptionId),
      );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.status(httpStatus.OK).end(pdfBuffer);
  },
);

export const prescriptionController = {
  createPrescription,
  getMyPrescriptions,
  getPrescriptionById,
  downloadPrescriptionPdf,
};

