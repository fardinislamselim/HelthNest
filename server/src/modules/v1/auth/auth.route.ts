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
import validateRequest from '@/middleware/validateRequest'

/**
 * Auth Controller
 */
import { AuthController } from './auth.controller'

/**
 * Auth Validation
 */
import { AuthValidation } from './auth.validation'

/**
 * Auth Routes
 */
const router = Router()

/**
 * Patient Registration Route
 * @access - public
 * @method - POST
 * @route - /api/v1/auth/register
 */
router.post(
    '/register',
    validateRequest(AuthValidation.registerPatientValidationSchema),
    AuthController.registerPatient,
)

/**
 * User Login Route
 * @access - public
 * @method - POST
 * @route - /api/v1/auth/login
 */
router.post(
    '/login',
    validateRequest(AuthValidation.loginUserValidationSchema),
    AuthController.loginUser,
)

/**
 * Get My Profile Route
 * @access - authenticated
 * @method - POST
 * @route - /api/v1/auth/login
 */
router.get(
    '/me',
    auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
    AuthController.getMe,
)

/**
 * Refresh Token Route
 * @access - public
 * @method - POST
 * @route - /api/v1/auth/refresh-token
 */
router.post(
    '/refresh-token',
    validateRequest(AuthValidation.refreshTokenValidationSchema),
    AuthController.refreshToken,
)

/**
 * Google Login Route
 * @access - public
 * @method - POST
 * @route - /api/v1/auth/google
 */
router.post(
    '/google',
    validateRequest(AuthValidation.googleLoginValidationSchema),
    AuthController.googleLogin,
)

/**
 * Forgot Password Route
 * @access - public
 * @method - POST
 * @route - /api/v1/auth/forgot-password
 */
router.post(
    '/forgot-password',
    validateRequest(AuthValidation.forgotPasswordValidationSchema),
    AuthController.forgotPassword,
)

/**
 * Reset Password Route
 * @access - public
 * @method - POST
 * @route - /api/v1/auth/reset-password
 */
router.post(
    '/reset-password',
    validateRequest(AuthValidation.resetPasswordValidationSchema),
    AuthController.resetPassword,
)

export const authRoutes = router