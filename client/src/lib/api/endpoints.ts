/**
 * Centralized API endpoint constants for the HealthNest backend
 */
export const API_ENDPOINTS = {
  // Dashboard
  DASHBOARD: {
    PATIENT: "/dashboard/patient",
    DOCTOR: "/dashboard/doctor",
    ADMIN: "/dashboard/admin",
    SUPER_ADMIN: "/dashboard/super-admin",
  },

  // Auth
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    GOOGLE_LOGIN: "/auth/google-login",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_OTP: "/auth/resend-otp",
    ME: "/auth/me",
    REFRESH_TOKEN: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    LOGOUT: "/auth/logout",
    CHANGE_PASSWORD: "/auth/change-password",
    SET_PASSWORD: "/auth/set-password",
  },

  // Users
  USERS: {
    ME: "/users/me",
    UPDATE_ME: "/users/me",
    PROFILE_IMAGE: "/users/me/profile-image",
    BY_ID: (userId: string) => `/users/${userId}`,
  },

  // Doctors
  DOCTORS: {
    AVAILABLE_TODAY: "/doctors/available-today",
    APPLY: "/doctors/apply",
    VERIFY_EMAIL: "/doctors/verify-email",
    RESEND_OTP: "/doctors/resend-otp",
    APPLICATION_STATUS: "/doctors/application-status",
  },

  // Schedules
  SCHEDULES: {
    CREATE: "/schedules",
    MY_SCHEDULES: "/schedules/me",
    BY_ID: (scheduleId: string) => `/schedules/${scheduleId}`,
    UPDATE: (scheduleId: string) => `/schedules/${scheduleId}`,
    PUBLISH: (scheduleId: string) => `/schedules/${scheduleId}/publish`,
    UNPUBLISH: (scheduleId: string) => `/schedules/${scheduleId}/unpublish`,
    DELETE: (scheduleId: string) => `/schedules/${scheduleId}`,
    TODAY: "/schedules/today",
    SLOTS: (scheduleId: string) => `/schedules/${scheduleId}/slots`,
  },

  // Appointments
  APPOINTMENTS: {
    CREATE: "/appointments",
    MY_APPOINTMENTS: "/appointments/my-appointments",
    DOCTOR_APPOINTMENTS: "/appointments/doctor/my-appointments",
    BY_ID: (appointmentId: string) => `/appointments/${appointmentId}`,
    START: (appointmentId: string) => `/appointments/${appointmentId}/start`,
    COMPLETE: (appointmentId: string) => `/appointments/${appointmentId}/complete`,
    CANCEL: (appointmentId: string) => `/appointments/${appointmentId}/cancel`,
  },

  // Payments
  PAYMENTS: {
    CHECKOUT: (appointmentId: string) => `/payments/checkout/${appointmentId}`,
  },

  // Refunds
  REFUNDS: {
    PROCESS: "/refunds",
    MY_REFUNDS: "/refunds/my-refunds",
    BY_ID: (refundId: string) => `/refunds/${refundId}`,
  },

  // Prescriptions
  PRESCRIPTIONS: {
    CREATE: "/prescriptions",
    MY_PRESCRIPTIONS: "/prescriptions/my-prescriptions",
    BY_ID: (prescriptionId: string) => `/prescriptions/${prescriptionId}`,
    PDF: (prescriptionId: string) => `/prescriptions/${prescriptionId}/pdf`,
  },

  // Admin
  ADMIN: {
    DOCTORS: "/admin/doctors",
    PENDING_DOCTORS: "/admin/doctors/pending",
    DOCTOR_BY_ID: (doctorId: string) => `/admin/doctors/${doctorId}`,
    APPROVE_DOCTOR: (doctorId: string) => `/admin/doctors/${doctorId}/approve`,
    REJECT_DOCTOR: (doctorId: string) => `/admin/doctors/${doctorId}/reject`,
    BLOCK_DOCTOR: (doctorId: string) => `/admin/doctors/${doctorId}/block`,
    UNBLOCK_DOCTOR: (doctorId: string) => `/admin/doctors/${doctorId}/unblock`,
    PATIENTS: "/admin/patients",
    PATIENT_BY_ID: (patientId: string) => `/admin/patients/${patientId}`,
    BLOCK_PATIENT: (patientId: string) => `/admin/patients/${patientId}/block`,
    UNBLOCK_PATIENT: (patientId: string) => `/admin/patients/${patientId}/unblock`,
    ADMINS: "/admin/users/admins",
    SUPER_ADMINS: "/admin/users/super-admins",
    BLOCK_ADMIN: (userId: string) => `/admin/users/admins/${userId}/block`,
    UNBLOCK_ADMIN: (userId: string) => `/admin/users/admins/${userId}/unblock`,
    BLOCK_SUPER_ADMIN: (userId: string) => `/admin/users/super-admins/${userId}/block`,
    UNBLOCK_SUPER_ADMIN: (userId: string) => `/admin/users/super-admins/${userId}/unblock`,
  },
} as const;

