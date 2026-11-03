import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { auth } from "@/middleware/checkAuth";
import validateRequest from "@/middleware/validateRequest";
import { doctorController } from "./doctor.controller";
import { DoctorValidation } from "./doctor.validation";


const router = Router();
const adminAuth = auth(Role.ADMIN, Role.SUPER_ADMIN);
const doctorIdValidation = validateRequest(DoctorValidation.doctorIdParamsValidationSchema);

router.get("/", adminAuth, doctorController.getAllDoctors);
router.get("/pending", adminAuth, doctorController.getPendingDoctors);
router.get("/:doctorId", adminAuth, doctorIdValidation, doctorController.getDoctorById);
router.patch("/:doctorId/approve", adminAuth, doctorIdValidation, doctorController.approveDoctor);
router.patch(
  "/:doctorId/reject",
  adminAuth,
  validateRequest(DoctorValidation.rejectDoctorValidationSchema),
  doctorController.rejectDoctor,
);
router.patch("/:doctorId/block", adminAuth, doctorIdValidation, doctorController.blockDoctor);
router.patch("/:doctorId/unblock", adminAuth, doctorIdValidation, doctorController.unblockDoctor);

export const adminDoctorRoutes = router;
