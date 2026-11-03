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

/**
 * Router Initialization
 */
const router:Router = Router()

/**
 * Module Routes
 */
const moduleRoutes = [
    {
        path:"/auth",
        route:authRoutes
    },
    {
        path:"/user",
        route:userRoutes
    },
    {
        path:"/doctor",
        route:doctorRoutes
    }
]

moduleRoutes.forEach((route =>router.use(route.path, route.route) ))

/**
 * Export Router
 */
export default router