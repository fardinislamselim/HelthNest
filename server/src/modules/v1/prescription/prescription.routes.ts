/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { auth } from "@/middleware/checkAuth";
import validateRequest from "@/middleware/validateRequest";
import { prescriptionController } from "./prescription.controller";
import { PrescriptionValidation } from "./prescription.validation";

const router = Router();

const doctorAuth = auth(Role.DOCTOR);
const patientAuth = auth(Role.PATIENT);
const patientOrDoctorAuth = auth(Role.PATIENT, Role.DOCTOR);
const prescriptionIdValidation = validateRequest(
  PrescriptionValidation.prescriptionIdParamsValidationSchema,
);

/**
 * Create a new prescription for an appointment
 * @access DOCTOR
 * @method POST /api/v1/prescriptions
 */
router.post(
  "/",
  doctorAuth,
  validateRequest(PrescriptionValidation.createPrescriptionValidationSchema),
  prescriptionController.createPrescription,
);

/**
 * Retrieve prescriptions belonging to the authenticated patient
 * @access PATIENT
 * @method GET /api/v1/prescriptions/my-prescriptions
 */
router.get(
  "/my-prescriptions",
  patientAuth,
  validateRequest(
    PrescriptionValidation.getMyPrescriptionsQueryValidationSchema,
  ),
  prescriptionController.getMyPrescriptions,
);

/**
 * Download prescription as PDF
 * @access PATIENT / DOCTOR
 * @method GET /api/v1/prescriptions/:prescriptionId/pdf
 */
router.get(
  "/:prescriptionId/pdf",
  patientOrDoctorAuth,
  prescriptionIdValidation,
  prescriptionController.downloadPrescriptionPdf,
);

/**
 * Retrieve details of a specific prescription
 * @access PATIENT / DOCTOR
 * @method GET /api/v1/prescriptions/:prescriptionId
 */
router.get(
  "/:prescriptionId",
  patientOrDoctorAuth,
  prescriptionIdValidation,
  prescriptionController.getPrescriptionById,
);

export const prescriptionRoutes = router;
export default router;

