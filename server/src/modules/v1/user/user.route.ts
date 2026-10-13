/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Third-Party Module
 */
import { Router } from "express";


/**
 * Application Module
 */
import { Role } from "../../../../generated/prisma/enums";
import { upload } from "@/lib/multer";
import { auth } from "@/middleware/checkAuth";

/**
 * Application Controller
 */
import { UserController } from "@/modules/v1/user/user.controller";



/**
 * Router Initialization
 */
const router = Router();




/**
 * Update Profile Image Route
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