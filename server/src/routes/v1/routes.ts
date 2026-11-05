/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

import { Router } from "express";

import { authRoutes } from "@/modules/v1/auth/auth.route";
import { userRoutes } from "@/modules/v1/user/user.route";
import { doctorRoutes } from "@/modules/v1/doctor/doctor.route";
import { adminRoutes } from "@/modules/v1/admin/admin.route";
import { scheduleRoutes } from "@/modules/v1/schedule/schedule.routes";
import { appointmentRoutes } from "@/modules/v1/appointment/appointment.routes";
import { paymentRoutes } from "@/modules/v1/payment/payment.routes";
import { prescriptionRoutes } from "@/modules/v1/prescription/prescription.routes";
import { refundRoutes } from "@/modules/v1/refund/refund.routes";

// Router Initialization
const router: Router = Router();

const moduleRoutes = [
  {
    // Public and authenticated account flows.
    path: "/auth",
    route: authRoutes,
  },
  {
    // Authenticated profile operations.
    path: "/users",
    route: userRoutes,
  },
  {
    // Backward-compatible singular profile alias.
    path: "/user",
    route: userRoutes,
  },
  {
    // Administrator account management.
    path: "/admin",
    route: adminRoutes,
  },
  {
    // Public doctor application and applicant-status flows.
    path: "/doctors",
    route: doctorRoutes,
  },
  {
    // Backward-compatible singular doctor alias.
    path: "/doctor",
    route: doctorRoutes,
  },
  {
    // Doctor schedule management.
    path: "/schedules",
    route: scheduleRoutes,
  },
  {
    // Backward-compatible singular schedule alias.
    path: "/schedule",
    route: scheduleRoutes,
  },
  {
    // Appointment management.
    path: "/appointments",
    route: appointmentRoutes,
  },
  {
    // Backward-compatible singular appointment alias.
    path: "/payments",
    route: paymentRoutes,
  },
  {
    // Prescription management.
    path: "/prescriptions",
    route: prescriptionRoutes,
  },
  {
    // Backward-compatible singular prescription alias.
    path: "/prescription",
    route: prescriptionRoutes,
  },
  {
    // Cancellation refund management.
    path: "/refunds",
    route: refundRoutes,
  },
  {
    // Backward-compatible singular refund alias.
    path: "/refund",
    route: refundRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

// Export Router
export default router;
