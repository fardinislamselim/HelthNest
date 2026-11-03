import { Router } from "express";

import { doctorController } from "@/modules/v1/doctor/doctor.controller";
import { upload } from "@/lib/multer";
import validateRequest from "@/middleware/validateRequest";
import { DoctorValidation } from "@/modules/v1/doctor/doctor.validation";
import { doctorApplicantAuth } from "@/middleware/doctorApplicantAuth";

// Router Initialization
const router = Router();

/**
 * Apply as Doctor Route
 * @access Public
 * @method POST
 * @route /api/v1/doctors/apply
 */
router.post(
  "/apply",
  upload.fields([
    {
      name: "resume",
      maxCount: 1,
    },
    {
      name: "additionalFiles",
      maxCount: 10,
    },
    {
      name: "aditionalFiles",
      maxCount: 10,
    },
  ]),
  validateRequest(DoctorValidation.applyAsDoctorValidationSchema),
  doctorController.applyAsDoctor,
);

/**
 * Verify Doctor Application Email Route
 * @access Public
 * @method POST
 * @route /api/v1/doctors/verify-email
 */
router.post(
  "/verify-email",
  validateRequest(DoctorValidation.verifyDoctorEmailValidationSchema),
  doctorController.verifyDoctorEmail,
);

/**
 * Legacy Alias for Doctor Email Verification
 * @access Public
 * @method POST
 * @route /api/v1/doctors/apply/email-verify
 */
router.post(
  "/apply/email-verify",
  validateRequest(DoctorValidation.verifyDoctorEmailValidationSchema),
  doctorController.verifyDoctorEmail,
);

/**
 * Resend Doctor Application OTP Route
 * @access Public
 * @method POST
 * @route /api/v1/doctors/resend-otp
 */
router.post(
  "/resend-otp",
  validateRequest(DoctorValidation.resendDoctorOtpValidationSchema),
  doctorController.resendDoctorOtp,
);

/**
 * Check Doctor Application Status Route
 * @access Doctor applicant
 * @method GET
 * @route /api/v1/doctors/application-status
 */
router.get(
  "/application-status",
  doctorApplicantAuth,
  doctorController.getApplicationStatus,
);

export const doctorRoutes = router;