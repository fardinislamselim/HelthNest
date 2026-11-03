/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

import { Router } from "express";
import { doctorController } from "@/modules/v1/doctor/doctor.controller";
import { upload } from "@/lib/multer";
import validateRequest from "@/middleware/validateRequest";
import { DoctorValidation } from "@/modules/v1/doctor/doctor.validation";
const router = Router();

/**
 * Doctor Routes
 * @access - Public
 * @description - Apply as Doctor
 * @method - POST
 * @route - /api/v1/doctor/apply
 */
router.post(
    "/apply",
    upload.fields([
        {
            name: "resume",
            maxCount: 1
        },
        {
            name: "aditionalFiles",
            maxCount: 10
        }
    ]),
    validateRequest(DoctorValidation.applyAsDoctorValidationSchema),
    doctorController.applyAsDoctor
);


router.post(
    "/apply/email-verify",
    validateRequest(DoctorValidation.verifyDoctorEmailValidationSchema),
    doctorController.verifyDoctorEmail
);


export const doctorRoutes = router;