# HelthNest API Documentation

## Base URL

```text
/api/v1
```

Unless stated otherwise, JSON endpoints use:

```http
Content-Type: application/json
Authorization: Bearer <access-token>
```

Authenticated requests may also use the `accessToken` cookie. Responses follow this format:

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

## Roles

- `PATIENT`
- `DOCTOR`
- `ADMIN`
- `SUPER_ADMIN`

## Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a patient |
| POST | `/auth/login` | Public | Log in with credentials |
| POST | `/auth/google-login` | Public | Log in with Google |
| POST | `/auth/verify-email` | Public | Verify an email OTP |
| POST | `/auth/resend-otp` | Public | Resend an email OTP |
| GET | `/auth/me` | Authenticated | Retrieve the current account |
| POST | `/auth/refresh-token` | Public | Refresh an access token |
| POST | `/auth/forgot-password` | Public | Request a password reset |
| PATCH | `/auth/reset-password` | Public | Reset a password |
| POST | `/auth/logout` | Authenticated | Log out |
| PATCH | `/auth/change-password` | Authenticated | Change the current password |
| PATCH | `/auth/set-password` | Patient | Set a password for the current patient |

## User profiles

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users/me` | Authenticated | Retrieve the current profile |
| PATCH | `/users/me` | Authenticated | Update the current profile |
| PATCH | `/users/me/profile-image` | Authenticated | Upload a profile image as multipart form data |
| PATCH | `/users/profile-image` | Authenticated | Legacy profile-image alias |
| GET | `/users/:userId` | Admin, Super Admin | Retrieve a user by ID |

The singular `/user` path is a backward-compatible alias for `/users`.

## Administrator management

These endpoints are mounted under `/admin`.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/admin/users/admins` | Admin, Super Admin | Create an administrator |
| POST | `/admin/users/super-admins` | Super Admin | Create a super administrator |
| GET | `/admin/users/admins` | Admin, Super Admin | List administrators |
| GET | `/admin/users/super-admins` | Super Admin | List super administrators |
| GET | `/admin/users/:userId` | Admin, Super Admin | Retrieve an account |
| PATCH | `/admin/users/admins/:userId/block` | Super Admin | Block an administrator |
| PATCH | `/admin/users/admins/:userId/unblock` | Super Admin | Unblock an administrator |
| PATCH | `/admin/users/super-admins/:userId/block` | Super Admin | Block a super administrator |
| PATCH | `/admin/users/super-admins/:userId/unblock` | Super Admin | Unblock a super administrator |
| GET | `/admin/doctors` | Admin, Super Admin | List doctors |
| GET | `/admin/doctors/pending` | Admin, Super Admin | List pending doctor applications |
| GET | `/admin/doctors/:doctorId` | Admin, Super Admin | Retrieve doctor details |
| PATCH | `/admin/doctors/:doctorId/approve` | Admin, Super Admin | Approve a doctor application |
| PATCH | `/admin/doctors/:doctorId/reject` | Admin, Super Admin | Reject a doctor application |
| PATCH | `/admin/doctors/:doctorId/block` | Admin, Super Admin | Block a doctor |
| PATCH | `/admin/doctors/:doctorId/unblock` | Admin, Super Admin | Unblock a doctor |
| GET | `/admin/patients` | Admin, Super Admin | List patients |
| GET | `/admin/patients/:patientId` | Admin, Super Admin | Retrieve patient details |
| PATCH | `/admin/patients/:patientId/block` | Admin, Super Admin | Block a patient |
| PATCH | `/admin/patients/:patientId/unblock` | Admin, Super Admin | Unblock a patient |

## Doctor applications

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/doctors/available-today` | Patient | List doctors with available schedules today |
| POST | `/doctors/apply` | Public | Submit a doctor application |
| POST | `/doctors/verify-email` | Public | Verify a doctor application email |
| POST | `/doctors/apply/email-verify` | Public | Legacy email-verification alias |
| POST | `/doctors/resend-otp` | Public | Resend a doctor application OTP |
| GET | `/doctors/application-status` | Doctor applicant | Retrieve application status |

Doctor applications use `multipart/form-data` and support `resume` plus `additionalFiles`.

The singular `/doctor` path is a backward-compatible alias for `/doctors`.

## Schedules

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/schedules/today` | Patient | List available schedules for today |
| GET | `/schedules/:scheduleId/slots` | Patient | List available slots |
| POST | `/schedules` | Doctor | Create a consultation schedule |
| GET | `/schedules/me` | Doctor | List the authenticated doctor's schedules |
| GET | `/schedules/:scheduleId` | Doctor | Retrieve schedule details |
| PATCH | `/schedules/:scheduleId` | Doctor | Update a schedule |
| PATCH | `/schedules/:scheduleId/publish` | Doctor | Publish a schedule |
| PATCH | `/schedules/:scheduleId/unpublish` | Doctor | Unpublish a schedule |
| DELETE | `/schedules/:scheduleId` | Doctor | Delete an eligible schedule |

The singular `/schedule` path is a backward-compatible alias for `/schedules`.

## Appointments

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/appointments` | Patient | Create an appointment and checkout session |
| GET | `/appointments/my-appointments` | Patient | List the current patient's appointments |
| GET | `/appointments/doctor/my-appointments` | Doctor | List the current doctor's appointments |
| GET | `/appointments/:appointmentId` | Patient, Doctor | Retrieve an owned appointment |
| PATCH | `/appointments/:appointmentId/start` | Doctor | Start a consultation |
| PATCH | `/appointments/:appointmentId/complete` | Doctor | Complete a consultation |
| PATCH | `/appointments/:appointmentId/cancel` | Patient | Cancel an appointment |

## Payments

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/payments/checkout/:appointmentId` | Patient | Create a Stripe checkout session |
| POST | `/payments/stripe/webhook` | Stripe server | Process Stripe payment events |

The webhook is mounted at `/api/v1/payments/stripe/webhook` and requires the Stripe signature header. It uses the raw request body.

## Prescriptions

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/prescriptions` | Doctor | Create a prescription for a completed appointment |
| GET | `/prescriptions/my-prescriptions` | Patient | List the current patient's prescriptions |
| GET | `/prescriptions/:prescriptionId/pdf` | Patient, Doctor | Download a prescription PDF |
| GET | `/prescriptions/:prescriptionId` | Patient, Doctor | Retrieve prescription details |

The singular `/prescription` path is a backward-compatible alias for `/prescriptions`.

## Refunds

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/refunds` | Admin, Super Admin | Process a refund |
| GET | `/refunds/my-refunds` | Patient | List the current patient's refunds |
| GET | `/refunds/:refundId` | Patient, Admin, Super Admin | Retrieve refund details |

The singular `/refund` path is a backward-compatible alias for `/refunds`.

## Dashboards

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/dashboard/admin` | Admin, Super Admin | Platform operations statistics |
| GET | `/dashboard/doctor` | Doctor | Authenticated doctor's statistics |
| GET | `/dashboard/patient` | Patient | Authenticated patient's statistics |
| GET | `/dashboard/super-admin` | Super Admin | Platform-wide statistics |

Personal dashboard ownership is derived from the authenticated user. `doctorId` and `patientId` are not accepted as ownership inputs.

Dashboard date calculations use the configured timezone, defaulting to `Asia/Dhaka`. Recent activity lists are limited to five records.

## Operational endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Service welcome and health response |
| GET | `/api/docs/openapi.yaml` | Public | Download the OpenAPI specification |
| GET | `/api/docs` | Public | OpenAPI Swagger UI |

The service root is `/`. The API root is `/api/v1`.

## Common HTTP responses

### `401 Unauthorized`

The access token is missing, invalid, expired, or the account cannot be found.

### `403 Forbidden`

The authenticated account does not have the role required by the endpoint, or the account is blocked.

### `404 Not Found`

The requested resource does not exist or is not owned by the authenticated user.

### `422 Unprocessable Entity`

The request body, query, or route parameters failed validation.

### `500 Internal Server Error`

An unexpected server or database error occurred.

## Pagination and filtering

List endpoints that support pagination accept query parameters such as:

```text
?page=1&limit=10
```

Appointments additionally support status and date filters where enabled. Always check the endpoint response's `meta` property for pagination details.
