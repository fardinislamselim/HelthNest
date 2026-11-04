import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { auth } from "@/middleware/checkAuth";
import validateRequest from "@/middleware/validateRequest";
import { appointmentController } from "./appointment.controller";
import { AppointmentValidation } from "./appointment.validation";

const router = Router();
const patientAuth = auth(Role.PATIENT);
const doctorAuth = auth(Role.DOCTOR);
const appointmentIdValidation = validateRequest(AppointmentValidation.appointmentIdParams);

router.post("/", patientAuth, validateRequest(AppointmentValidation.createAppointment), appointmentController.createAppointment);
router.get("/my-appointments", patientAuth, validateRequest(AppointmentValidation.listQuery), appointmentController.getPatientAppointments);
router.get("/doctor/my-appointments", doctorAuth, validateRequest(AppointmentValidation.listQuery), appointmentController.getDoctorAppointments);
router.get("/:appointmentId", auth(Role.PATIENT, Role.DOCTOR), appointmentIdValidation, appointmentController.getAppointment);
router.patch("/:appointmentId/start", doctorAuth, appointmentIdValidation, appointmentController.startAppointment);
router.patch("/:appointmentId/complete", doctorAuth, appointmentIdValidation, appointmentController.completeAppointment);
router.patch("/:appointmentId/cancel", patientAuth, appointmentIdValidation, appointmentController.cancelAppointment);

export const appointmentRoutes = router;
export default router;
