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
 * Router Initialization
 */
const router:Router = Router()

/**
 * Module Routes
 */
const moduleRoutes = [
    {
        path:"/user",
        // route:userRouter
    }
]

// moduleRoutes.forEach((route =>router.use(route.path, route.route) ))

/**
 * Export Router
 */
export default router