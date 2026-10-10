/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Third-Party Modules
 */
import { authRoutes } from "@/modules/v1/auth/auth.route";
import { Router } from "express";

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
]

moduleRoutes.forEach((route =>router.use(route.path, route.route) ))

/**
 * Export Router
 */
export default router