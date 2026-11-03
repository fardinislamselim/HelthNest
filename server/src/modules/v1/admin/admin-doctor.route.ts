import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { auth } from "@/middleware/checkAuth";
import validateRequest from "@/middleware/validateRequest";
import { doctorController } from "@/modules/v1/doctor/doctor.controller";
import { DoctorValidation } from "@/modules/v1/doctor/doctor.validation";

const router = Router();
const adminAuth = auth(Role.ADMIN, Role.SUPER_ADMIN);
const doctorIdValidation = validateRequest(
  DoctorValidation.doctorIdParamsValidationSchema,
);

/**
 * List all doctors
 * @access Admin / Super Admin
 * @method GET /api/v1/admin/doctors
 */
router.get("/", adminAuth, doctorController.getAllDoctors);

/**
 * List pending doctor applications
 * @access Admin / Super Admin
 * @method GET /api/v1/admin/doctors/pending
 */
router.get("/pending", adminAuth, doctorController.getPendingDoctors);

/**
 * Get doctor details
 * @access Admin / Super Admin
 * @method GET /api/v1/admin/doctors/:doctorId
 */
router.get(
  "/:doctorId",
  adminAuth,
  doctorIdValidation,
  doctorController.getDoctorById,
);

/**
 * Approve a doctor application
 * @access Admin / Super Admin
 * @method PATCH /api/v1/admin/doctors/:doctorId/approve
 */
router.patch(
  "/:doctorId/approve",
  adminAuth,
  doctorIdValidation,
  doctorController.approveDoctor,
);

/**
 * Reject a doctor application
 * @access Admin / Super Admin
 * @method PATCH /api/v1/admin/doctors/:doctorId/reject
 */
router.patch(
  "/:doctorId/reject",
  adminAuth,
  validateRequest(DoctorValidation.rejectDoctorValidationSchema),
  doctorController.rejectDoctor,
);

/**
 * Block or unblock a doctor account
 * @access Admin / Super Admin
 * @method PATCH /api/v1/admin/doctors/:doctorId/{block|unblock}
 */
router.patch(
  "/:doctorId/block",
  adminAuth,
  doctorIdValidation,
  doctorController.blockDoctor,
);
router.patch(
  "/:doctorId/unblock",
  adminAuth,
  doctorIdValidation,
  doctorController.unblockDoctor,
);

export const adminDoctorRoutes = router;
