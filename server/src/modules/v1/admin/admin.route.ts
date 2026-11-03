import { Router } from "express";
import { Role, UserStatus } from "../../../../generated/prisma/enums";
import { auth } from "@/middleware/checkAuth";
import validateRequest from "@/middleware/validateRequest";
import { adminController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";

const router = Router();
const adminOnly = auth(Role.ADMIN, Role.SUPER_ADMIN);
const superAdminOnly = auth(Role.SUPER_ADMIN);
const paramsValidation = validateRequest(AdminValidation.userIdParamsValidationSchema);

/**
 * Create an Admin
 * @access Admin / Super Admin
 * @method POST /api/v1/admin/users/admins
 */
router.post("/admins", adminOnly, validateRequest(AdminValidation.createAdminValidationSchema), adminController.createAdmin(Role.ADMIN));

/**
 * Create a Super Admin
 * @access Super Admin
 * @method POST /api/v1/admin/users/super-admins
 */
router.post("/super-admins", superAdminOnly, validateRequest(AdminValidation.createAdminValidationSchema), adminController.createAdmin(Role.SUPER_ADMIN));

/**
 * List Admins
 * @access Admin / Super Admin
 * @method GET /api/v1/admin/users/admins
 */
router.get("/admins", adminOnly, adminController.listAdmins(Role.ADMIN));

/**
 * List Super Admins
 * @access Super Admin
 * @method GET /api/v1/admin/users/super-admins
 */
router.get("/super-admins", superAdminOnly, adminController.listAdmins(Role.SUPER_ADMIN));

/**
 * Get User Account Details
 * @access Admin / Super Admin
 * @method GET /api/v1/admin/users/:userId
 */
router.get("/:userId", adminOnly, paramsValidation, adminController.getUserById);

/**
 * Block or unblock an Admin
 * @access Super Admin
 * @method PATCH /api/v1/admin/users/admins/:userId/{block|unblock}
 */
router.patch("/admins/:userId/block", superAdminOnly, paramsValidation, adminController.setBlocked(Role.ADMIN, UserStatus.BLOCKED));
router.patch("/admins/:userId/unblock", superAdminOnly, paramsValidation, adminController.setBlocked(Role.ADMIN, UserStatus.ACTIVE));

/**
 * Block or unblock a Super Admin
 * @access Super Admin
 * @method PATCH /api/v1/admin/users/super-admins/:userId/{block|unblock}
 */
router.patch("/super-admins/:userId/block", superAdminOnly, paramsValidation, adminController.setBlocked(Role.SUPER_ADMIN, UserStatus.BLOCKED));
router.patch("/super-admins/:userId/unblock", superAdminOnly, paramsValidation, adminController.setBlocked(Role.SUPER_ADMIN, UserStatus.ACTIVE));

export const adminRoutes = router;
