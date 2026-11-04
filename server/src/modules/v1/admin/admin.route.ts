/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

import { Router } from "express";
import { Role, UserStatus } from "../../../../generated/prisma/enums";
import { auth } from "@/middleware/checkAuth";
import validateRequest from "@/middleware/validateRequest";
import { adminController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";

const router = Router();
const adminOnly = auth(Role.ADMIN, Role.SUPER_ADMIN);
const superAdminOnly = auth(Role.SUPER_ADMIN);
const userParamsValidation = validateRequest(
  AdminValidation.userIdParamsValidationSchema,
);
const doctorParamsValidation = validateRequest(
  AdminValidation.doctorIdParamsValidationSchema,
);
const patientParamsValidation = validateRequest(
  AdminValidation.patientIdParamsValidationSchema,
);
const queryValidation = validateRequest(
  AdminValidation.getAllPatientsQueryValidationSchema,
);

/**
 * Create an Admin
 * @access Admin / Super Admin
 * @method POST /api/v1/admin/users/admins
 */
router.post(
  "/users/admins",
  adminOnly,
  validateRequest(AdminValidation.createAdminValidationSchema),
  adminController.createAdmin(Role.ADMIN),
);

/**
 * Create a Super Admin
 * @access Super Admin
 * @method POST /api/v1/admin/users/super-admins
 */
router.post(
  "/users/super-admins",
  superAdminOnly,
  validateRequest(AdminValidation.createAdminValidationSchema),
  adminController.createAdmin(Role.SUPER_ADMIN),
);

/**
 * List Admins
 * @access Admin / Super Admin
 * @method GET /api/v1/admin/users/admins
 */
router.get("/users/admins", adminOnly, adminController.listAdmins(Role.ADMIN));

/**
 * List Super Admins
 * @access Super Admin
 * @method GET /api/v1/admin/users/super-admins
 */
router.get(
  "/users/super-admins",
  superAdminOnly,
  adminController.listAdmins(Role.SUPER_ADMIN),
);

/**
 * Get User Account Details
 * @access Admin / Super Admin
 * @method GET /api/v1/admin/users/:userId
 */
router.get(
  "/users/:userId",
  adminOnly,
  userParamsValidation,
  adminController.getUserById,
);

/**
 * Block or unblock an Admin
 * @access Super Admin
 * @method PATCH /api/v1/admin/users/admins/:userId/{block|unblock}
 */
router.patch(
  "/users/admins/:userId/block",
  superAdminOnly,
  userParamsValidation,
  adminController.setBlocked(Role.ADMIN, UserStatus.BLOCKED),
);
router.patch(
  "/users/admins/:userId/unblock",
  superAdminOnly,
  userParamsValidation,
  adminController.setBlocked(Role.ADMIN, UserStatus.ACTIVE),
);

/**
 * Block or unblock a Super Admin
 * @access Super Admin
 * @method PATCH /api/v1/admin/users/super-admins/:userId/{block|unblock}
 */
router.patch(
  "/users/super-admins/:userId/block",
  superAdminOnly,
  userParamsValidation,
  adminController.setBlocked(Role.SUPER_ADMIN, UserStatus.BLOCKED),
);
router.patch(
  "/users/super-admins/:userId/unblock",
  superAdminOnly,
  userParamsValidation,
  adminController.setBlocked(Role.SUPER_ADMIN, UserStatus.ACTIVE),
);

/**
 * List all doctors
 * @access Admin / Super Admin
 * @method GET /api/v1/admin/doctors
 */
router.get("/doctors", adminOnly, adminController.getAllDoctors);

/**
 * List pending doctor applications
 * @access Admin / Super Admin
 * @method GET /api/v1/admin/doctors/pending
 */
router.get("/doctors/pending", adminOnly, adminController.getPendingDoctors);

/**
 * Get doctor details
 * @access Admin / Super Admin
 * @method GET /api/v1/admin/doctors/:doctorId
 */
router.get(
  "/doctors/:doctorId",
  adminOnly,
  doctorParamsValidation,
  adminController.getDoctorById,
);

/**
 * Approve a doctor application
 * @access Admin / Super Admin
 * @method PATCH /api/v1/admin/doctors/:doctorId/approve
 */
router.patch(
  "/doctors/:doctorId/approve",
  adminOnly,
  doctorParamsValidation,
  adminController.approveDoctor,
);

/**
 * Reject a doctor application
 * @access Admin / Super Admin
 * @method PATCH /api/v1/admin/doctors/:doctorId/reject
 */
router.patch(
  "/doctors/:doctorId/reject",
  adminOnly,
  validateRequest(AdminValidation.rejectDoctorValidationSchema),
  adminController.rejectDoctor,
);

/**
 * Block or unblock a doctor account
 * @access Admin / Super Admin
 * @method PATCH /api/v1/admin/doctors/:doctorId/{block|unblock}
 */
router.patch(
  "/doctors/:doctorId/block",
  adminOnly,
  doctorParamsValidation,
  adminController.blockDoctor,
);
router.patch(
  "/doctors/:doctorId/unblock",
  adminOnly,
  doctorParamsValidation,
  adminController.unblockDoctor,
);

/**
 * List all patients
 * @access Admin / Super Admin
 * @method GET /api/v1/admin/patients
 */
router.get(
  "/patients",
  adminOnly,
  queryValidation,
  adminController.getAllPatients,
);

/**
 * Get patient details
 * @access Admin / Super Admin
 * @method GET /api/v1/admin/patients/:patientId
 */
router.get(
  "/patients/:patientId",
  adminOnly,
  patientParamsValidation,
  adminController.getPatientById,
);

/**
 * Block a patient account
 * @access Admin / Super Admin
 * @method PATCH /api/v1/admin/patients/:patientId/block
 */
router.patch(
  "/patients/:patientId/block",
  adminOnly,
  patientParamsValidation,
  adminController.blockPatient,
);

/**
 * Unblock a patient account
 * @access Admin / Super Admin
 * @method PATCH /api/v1/admin/patients/:patientId/unblock
 */
router.patch(
  "/patients/:patientId/unblock",
  adminOnly,
  patientParamsValidation,
  adminController.unblockPatient,
);


export const adminRoutes = router;
