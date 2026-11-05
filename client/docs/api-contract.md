# HealthNest API Contract

This document contains the verified contract between the HealthNest Next.js frontend and Express/Prisma backend (`server/`).
All endpoints are rooted under `/api/v1` (with backward-compatible singular root aliases in Express).

## 1. Network & Security Settings

- **Protocol**: HTTP/HTTPS
- **Base URL**: `http://localhost:5000/api/v1` (`process.env.NEXT_PUBLIC_API_BASE_URL`)
- **CORS Configuration**: Configured with `credentials: true` and origin set to `config.frontend_url` (`http://localhost:3000`).
- **Axios Configuration**: MUST set `withCredentials: true` to receive and send HTTP-only authentication cookies.
- **Authentication Transport**:
  - `accessToken` (HTTP-only cookie, 24 hours expiry, `sameSite: "none"` or `"lax"`)
  - `refreshToken` (HTTP-only cookie, 7 days expiry, `sameSite: "none"` or `"lax"`)
  - The backend `checkAuth` middleware accepts either the `accessToken` cookie OR the `Authorization: Bearer <token>` header.
- **Token Storage Rule**: NEVER store authentication tokens in `localStorage` or `sessionStorage`. Browser memory (TanStack Query / Zustand) only stores sanitized non-sensitive session profile data (name, email, role, userId).

## 2. Standard Response Envelopes

### Success Response Envelope
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPage": 5
  }
}
```

### Error Response Envelope
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description message",
  "name": "AppError",
  "error": {}
}
```

## 3. Platform Roles & Enums

### Roles (`Role`)
- `PATIENT` — Self-registered patient.
- `DOCTOR` — Verified and approved medical practitioner.
- `ADMIN` — System administrator.
- `SUPER_ADMIN` — Super administrator with root privileges.

### User Status (`UserStatus`)
- `ACTIVE`
- `BLOCKED`
- `DELETED`

### Appointment Status (`AppointmentStatus`)
- `PENDING` — Booking created, awaiting payment.
- `BOOKED` — Payment completed, serial number issued.
- `ONGOING` — Doctor started consultation.
- `COMPLETED` — Consultation completed, prescription can be issued.
- `CANCELLED` — Cancelled by patient before consultation.

### Payment Status (`PaymentStatus`)
- `PENDING`
- `PAID`
- `FAILED`
- `REFUNDED`
- `EXPIRED`

### Refund Status (`RefundStatus`)
- `PENDING`
- `PROCESSING`
- `COMPLETED`
- `FAILED`

---

## 4. Verified API Endpoints

### 4.1 Authentication (`/auth`)

| Method | Endpoint | Access | Description & Request/Response |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Body: `{ name, email, password, contactNumber? }`<br>Sends OTP to email, creates user & patient record, sets `accessToken` & `refreshToken` cookies. |
| `POST` | `/auth/login` | Public | Body: `{ email, password }`<br>Sets `accessToken` & `refreshToken` cookies. Returns `{ accessToken, refreshToken, needPasswordChange }`. |
| `POST` | `/auth/google-login` | Public | Body: `{ credential }` (Google ID token). Patient-only login. |
| `POST` | `/auth/verify-email` | Public | Body: `{ email, otp }`. Marks email as verified. |
| `POST` | `/auth/resend-otp` | Public | Body: `{ email }`. Resends verification OTP. |
| `GET` | `/auth/me` | Authenticated | Headers: Cookie or Bearer token.<br>Returns authenticated user profile and role details. |
| `POST` | `/auth/refresh-token` | Public | Reads `refreshToken` cookie. Rotates access and refresh tokens. |
| `POST` | `/auth/forgot-password` | Public | Body: `{ email }`. Sends password reset OTP. |
| `PATCH` | `/auth/reset-password` | Public | Body: `{ email, otp, newPassword }`. Resets password. |
| `POST` | `/auth/logout` | Authenticated | Clears `accessToken` and `refreshToken` cookies. |
| `PATCH` | `/auth/change-password` | Authenticated | Body: `{ currentPassword, newPassword }`. Changes password. |
| `PATCH` | `/auth/set-password` | Patient | Body: `{ password }`. Sets initial password for Google-only users. |

### 4.2 User Profile (`/users`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/users/me` | Authenticated | Fetches own profile data. |
| `PATCH` | `/users/me` | Authenticated | Body: `{ name?, contactNumber?, address? }`. Updates profile. |
| `PATCH` | `/users/me/profile-image` | Authenticated | `multipart/form-data` with `profileImage`. |
| `GET` | `/users/:userId` | Admin, Super Admin | Fetches user details by user ID. |

### 4.3 Doctor Applications & Discovery (`/doctors`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/doctors/available-today` | Patient | Lists doctors with available published schedules today. |
| `POST` | `/doctors/apply` | Public | `multipart/form-data`: application fields + `resume` + `additionalFiles`. |
| `POST` | `/doctors/verify-email` | Public | Body: `{ email, otp }`. Verifies applicant email. |
| `POST` | `/doctors/resend-otp` | Public | Body: `{ email }`. Resends applicant OTP. |
| `GET` | `/doctors/application-status` | Applicant | Header: `email`. Checks approval status (`PENDING`, `APPROVED`, `REJECTED`). |

### 4.4 Doctor Schedule Management (`/schedules`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/schedules` | Doctor | Body: `{ date: "YYYY-MM-DD", startTime: "HH:mm", endTime: "HH:mm", meetLink: "url" }`. Automatically generates 20-min slots. Status starts as `DRAFT`. |
| `GET` | `/schedules/me` | Doctor | Query: `?status=&page=&limit=`. Lists doctor's own schedules. |
| `GET` | `/schedules/:scheduleId` | Doctor | Retrieves schedule details with all slots. |
| `PATCH` | `/schedules/:scheduleId` | Doctor | Updates draft schedule or non-date fields. |
| `PATCH` | `/schedules/:scheduleId/publish` | Doctor | Publishes schedule (makes visible to patients). |
| `PATCH` | `/schedules/:scheduleId/unpublish` | Doctor | Unpublishes schedule. |
| `DELETE` | `/schedules/:scheduleId` | Doctor | Deletes schedule (only if no booked appointments). |
| `GET` | `/schedules/today` | Patient | Lists today's available schedules strictly before start time. |
| `GET` | `/schedules/:scheduleId/slots` | Patient | Lists available 20-min slots for booking. |

### 4.5 Appointments (`/appointments`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/appointments` | Patient | Body: `{ scheduleId, slotId }`. Creates appointment in `PENDING` status. |
| `GET` | `/appointments/my-appointments` | Patient | Query: `?status=&date=&page=&limit=`. Lists patient's appointments. |
| `GET` | `/appointments/doctor/my-appointments` | Doctor | Query: `?status=&date=&page=&limit=`. Lists doctor's appointments. |
| `GET` | `/appointments/:appointmentId` | Patient, Doctor | Retrieves appointment details. |
| `PATCH` | `/appointments/:appointmentId/start` | Doctor | Changes status `BOOKED` $\rightarrow$ `ONGOING`. Sets `startedAt`. |
| `PATCH` | `/appointments/:appointmentId/complete` | Doctor | Changes status `ONGOING` $\rightarrow$ `COMPLETED`. Sets `completedAt`. |
| `PATCH` | `/appointments/:appointmentId/cancel` | Patient | Cancels appointment, frees slot, calculates 1-hour rule strictly on backend. If cancelled > 1h prior, initiates Stripe refund. |

### 4.6 Payments (`/payments`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/payments/checkout/:appointmentId` | Patient | Initiates Stripe Checkout session, returns `{ checkoutSessionId, paymentUrl }`. |
| `POST` | `/payments/stripe/webhook` | Stripe Server | Processes raw Stripe webhook events (`checkout.session.completed`, etc.). |

### 4.7 Refunds (`/refunds`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/refunds` | Admin, Super Admin | Internal/admin manual trigger for eligible refund. |
| `GET` | `/refunds/my-refunds` | Patient | Query: `?page=&limit=&status=`. Paginated refund history. |
| `GET` | `/refunds/:refundId` | Patient, Admin | Refund details. (Patient can only view owned refunds). |

### 4.8 Prescriptions (`/prescriptions`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/prescriptions` | Doctor | Body: `{ appointmentId, clinicalFindings, medicines: [{ medicineName, dosage, frequency, duration, instructions }], instructions? }`. |
| `GET` | `/prescriptions/my-prescriptions` | Patient | Query: `?page=&limit=`. Paginated prescriptions for patient. |
| `GET` | `/prescriptions/:prescriptionId` | Patient, Doctor | Retrieves prescription details. |
| `GET` | `/prescriptions/:prescriptionId/pdf` | Patient, Doctor | Streams binary PDF document (`application/pdf`). |

### 4.9 Admin & Super Admin (`/admin`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/admin/doctors` | Admin, Super Admin | Lists all doctors with verification status filters. |
| `GET` | `/admin/doctors/pending` | Admin, Super Admin | Lists pending applications. |
| `GET` | `/admin/doctors/:doctorId` | Admin, Super Admin | Detailed doctor profile & application review. |
| `PATCH` | `/admin/doctors/:doctorId/approve` | Admin, Super Admin | Approves doctor application. |
| `PATCH` | `/admin/doctors/:doctorId/reject` | Admin, Super Admin | Body: `{ reason }`. Rejects application. |
| `PATCH` | `/admin/doctors/:doctorId/block` | Admin, Super Admin | Blocks doctor account. |
| `PATCH` | `/admin/doctors/:doctorId/unblock` | Admin, Super Admin | Unblocks doctor account. |
| `GET` | `/admin/patients` | Admin, Super Admin | Lists patient accounts. |
| `GET` | `/admin/patients/:patientId` | Admin, Super Admin | Details of patient account. |
| `PATCH` | `/admin/patients/:patientId/block` | Admin, Super Admin | Blocks patient account. |
| `PATCH` | `/admin/patients/:patientId/unblock` | Admin, Super Admin | Unblocks patient account. |
| `POST` | `/admin/users/admins` | Admin, Super Admin | Creates new Admin account. |
| `POST` | `/admin/users/super-admins` | Super Admin | Creates new Super Admin account. |
| `GET` | `/admin/users/admins` | Admin, Super Admin | Lists Admin accounts. |
| `GET` | `/admin/users/super-admins` | Super Admin | Lists Super Admin accounts. |
| `PATCH` | `/admin/users/admins/:userId/block` | Super Admin | Blocks an Admin account. |
| `PATCH` | `/admin/users/admins/:userId/unblock` | Super Admin | Unblocks an Admin account. |
| `PATCH` | `/admin/users/super-admins/:userId/block` | Super Admin | Blocks a Super Admin account. |
| `PATCH` | `/admin/users/super-admins/:userId/unblock` | Super Admin | Unblocks a Super Admin account. |

