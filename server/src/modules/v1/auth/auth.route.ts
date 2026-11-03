import { Router } from 'express'
import { Role } from '../../../../generated/prisma/enums'
import { auth } from '@/middleware/checkAuth'
import validateRequest from '@/middleware/validateRequest'
import { AuthController } from './auth.controller'
import { AuthValidation } from './auth.validation'


// Auth Routes
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
 * Verify Email Route
 * @access - public
 * @method - POST
 * @route - /api/v1/auth/verify-email
 */
router.post(
    '/verify-email',
    validateRequest(AuthValidation.verifyEmailValidationSchema),
    AuthController.verifyEmail,
)

/**
 * Resend OTP Route
 * @access - public
 * @method - POST
 * @route - /api/v1/auth/resend-otp
 */
router.post(
    '/resend-otp',
    validateRequest(AuthValidation.resendOtpValidationSchema),
    AuthController.resendOtp,
)

/**
 * Get My Profile Route
 * @access - authenticated
 * @method - GET
 * @route - /api/v1/auth/me
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
    '/google-login',
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
router.patch(
    '/reset-password',
    validateRequest(AuthValidation.resetPasswordValidationSchema),
    AuthController.resetPassword,
)

/**
 * Logout Route
 * @access - authenticated
 * @method - POST
 * @route - /api/v1/auth/logout
 */
router.post(
    '/logout',
    auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
    AuthController.logout,
)

/**
 * Change Password Route
 * @access - authenticated
 * @method - PATCH
 * @route - /api/v1/auth/change-password
 */
router.patch(
    '/change-password',
    auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
    validateRequest(AuthValidation.changePasswordValidationSchema),
    AuthController.changePassword,
)

/**
 * Set Password Route
 * @access - authenticated
 * @method - PATCH
 * @route - /api/v1/auth/set-password
 */
router.patch(
    '/set-password',
    auth(Role.PATIENT),
    validateRequest(AuthValidation.setPasswordValidationSchema),
    AuthController.setPassword,
)

export const authRoutes = router