/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { auth } from "@/middleware/checkAuth";
import validateRequest from "@/middleware/validateRequest";
import { scheduleController } from "./schedule.controller";
import { ScheduleValidation } from "./schedule.validation";

const router = Router();
const doctorAuth = auth(Role.DOCTOR);
const patientAuth = auth(Role.PATIENT);
const scheduleIdValidation = validateRequest(
  ScheduleValidation.scheduleIdParamsValidationSchema,
);

/**
 * Retrieve all doctors' available schedules for today
 * @access PATIENT
 * @method GET /api/v1/schedules/today
 */
router.get(
  "/today",
  patientAuth,
  validateRequest(ScheduleValidation.getTodaySchedulesQueryValidationSchema),
  scheduleController.getTodayAvailableSchedules,
);

/**
 * Retrieve available slots for a specific schedule
 * @access PATIENT
 * @method GET /api/v1/schedules/:scheduleId/slots
 */
router.get(
  "/:scheduleId/slots",
  patientAuth,
  scheduleIdValidation,
  scheduleController.getScheduleAvailableSlots,
);

/**
 * Create a new consultation schedule
 * @access DOCTOR
 * @method POST /api/v1/schedules
 */
router.post(
  "/",
  doctorAuth,
  validateRequest(ScheduleValidation.createScheduleValidationSchema),
  scheduleController.createSchedule,
);

/**
 * Retrieve all schedules belonging to the authenticated doctor
 * @access DOCTOR
 * @method GET /api/v1/schedules/me
 */
router.get(
  "/me",
  doctorAuth,
  validateRequest(ScheduleValidation.getMySchedulesQueryValidationSchema),
  scheduleController.getMySchedules,
);

/**
 * Retrieve details of a specific schedule
 * @access DOCTOR
 * @method GET /api/v1/schedules/:scheduleId
 */
router.get(
  "/:scheduleId",
  doctorAuth,
  scheduleIdValidation,
  scheduleController.getScheduleById,
);

/**
 * Update an existing schedule
 * @access DOCTOR
 * @method PATCH /api/v1/schedules/:scheduleId
 */
router.patch(
  "/:scheduleId",
  doctorAuth,
  validateRequest(ScheduleValidation.updateScheduleValidationSchema),
  scheduleController.updateSchedule,
);

/**
 * Publish a draft or eligible unpublished schedule
 * @access DOCTOR
 * @method PATCH /api/v1/schedules/:scheduleId/publish
 */
router.patch(
  "/:scheduleId/publish",
  doctorAuth,
  scheduleIdValidation,
  scheduleController.publishSchedule,
);

/**
 * Unpublish an existing published schedule
 * @access DOCTOR
 * @method PATCH /api/v1/schedules/:scheduleId/unpublish
 */
router.patch(
  "/:scheduleId/unpublish",
  doctorAuth,
  scheduleIdValidation,
  scheduleController.unpublishSchedule,
);

/**
 * Delete an eligible schedule
 * @access DOCTOR
 * @method DELETE /api/v1/schedules/:scheduleId
 */
router.delete(
  "/:scheduleId",
  doctorAuth,
  scheduleIdValidation,
  scheduleController.deleteSchedule,
);

export const scheduleRoutes = router;
export default router;

