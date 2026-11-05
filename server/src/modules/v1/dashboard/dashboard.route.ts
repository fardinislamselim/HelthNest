import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { auth } from "@/middleware/checkAuth";
import { dashboardController } from "./dashboard.controller";

const router = Router();

router.get("/admin", auth(Role.ADMIN, Role.SUPER_ADMIN), dashboardController.getAdminDashboard);
router.get("/doctor", auth(Role.DOCTOR), dashboardController.getDoctorDashboard);
router.get("/patient", auth(Role.PATIENT), dashboardController.getPatientDashboard);
router.get("/super-admin", auth(Role.SUPER_ADMIN), dashboardController.getSuperAdminDashboard);

export const dashboardRoutes = router;
