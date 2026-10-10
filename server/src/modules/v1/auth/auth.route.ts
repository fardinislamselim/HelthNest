/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Third-Party Modules
 */
import { Router } from 'express'

/**
 * Prisma Module
 */
import { Role } from '../../../../generated/prisma/enums'

/**
 * Middleware
 */
import { auth } from '@/middleware/checkAuth'

/**
 * Auth Controller
 */
import { AuthController } from './auth.controller'

/**
 * Auth Routes
 */
const router = Router()

/**
 * Register Patient Route
 */
router.post('/register', AuthController.registerPatient)

/**
 * Login User Route
 */
router.post('/login', AuthController.loginUser)
router.get(
    '/me',
    auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
    AuthController.getMe,
)
router.post('/refresh-token', AuthController.refreshToken)
router.post('/google', AuthController.googleLogin)

export const authRoutes = router