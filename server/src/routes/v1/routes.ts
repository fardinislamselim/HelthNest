/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Third-Party Modules
 */
import { Router } from "express";

/**
 * Application Module
 */
import { authRoutes } from "@/modules/v1/auth/auth.route";
import { userRoutes } from "@/modules/v1/user/user.route";
import { doctorRoutes } from "@/modules/v1/doctor/doctor.route";
import { adminDoctorRoutes } from "@/modules/v1/admin/admin-doctor.route";
import { adminRoutes } from "@/modules/v1/admin/admin.route";

/**
 * Router Initialization
 */
const router: Router = Router();

/**
 * Module Routes
 */
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
    path: "/admin/users",
    route: adminRoutes,
  },
  {
    // Doctor application and account management.
    path: "/admin/doctors",
    route: adminDoctorRoutes,
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

/**
 * Export Router
 */
export default router;
