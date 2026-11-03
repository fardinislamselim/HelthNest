import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { upload } from "@/lib/multer";
import { auth } from "@/middleware/checkAuth";
import validateRequest from "@/middleware/validateRequest";
import { UserController } from "@/modules/v1/user/user.controller";
import { UserValidation } from "@/modules/v1/user/user.validation";

const router = Router();

/**
 * Get My Profile Route
 * @access - authenticated
 * @method - GET
 * @route - /api/v1/user/me
 */
router.get(
    "/me",
    auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
    UserController.getMyProfile
);

/**
 * Update My Profile Route
 * @access - authenticated
 * @method - PATCH
 * @route - /api/v1/user/me
 */
router.patch(
    "/me",
    auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
    validateRequest(UserValidation.updateMyProfileValidationSchema),
    UserController.updateMyProfile
);

/**
 * Update My Profile Image Route
 * @access - authenticated
 * @method - PATCH
 * @route - /api/v1/user/me
 */
router.patch(
    "/me/profile-image",
    auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
    upload.single("profileImage"),
    UserController.updateProfileImage
);

/**
 * Get User By ID Route
 * @access - authenticated
 * @method - GET
 * @route - /api/v1/user/:userId
 */
router.get(
    "/:userId",
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(UserValidation.getUserByIdValidationSchema),
    UserController.getUserById
);

/**
 * Legacy Profile Image Alias
 * @access - authenticated
 * @method - PATCH
 * @route - /api/v1/user/profile-image
 */
router.patch(
    "/profile-image",
    auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
    upload.single("profileImage"),
    UserController.updateProfileImage
);

export const userRoutes = router;