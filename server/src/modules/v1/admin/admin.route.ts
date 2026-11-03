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

router.post("/admins", adminOnly, validateRequest(AdminValidation.createAdminValidationSchema), adminController.createAdmin(Role.ADMIN));
router.post("/super-admins", superAdminOnly, validateRequest(AdminValidation.createAdminValidationSchema), adminController.createAdmin(Role.SUPER_ADMIN));
router.get("/admins", adminOnly, adminController.listAdmins(Role.ADMIN));
router.get("/super-admins", superAdminOnly, adminController.listAdmins(Role.SUPER_ADMIN));
router.get("/:userId", adminOnly, paramsValidation, adminController.getUserById);
router.patch("/admins/:userId/block", superAdminOnly, paramsValidation, adminController.setBlocked(Role.ADMIN, UserStatus.BLOCKED));
router.patch("/admins/:userId/unblock", superAdminOnly, paramsValidation, adminController.setBlocked(Role.ADMIN, UserStatus.ACTIVE));
router.patch("/super-admins/:userId/block", superAdminOnly, paramsValidation, adminController.setBlocked(Role.SUPER_ADMIN, UserStatus.BLOCKED));
router.patch("/super-admins/:userId/unblock", superAdminOnly, paramsValidation, adminController.setBlocked(Role.SUPER_ADMIN, UserStatus.ACTIVE));

export const adminRoutes = router;
