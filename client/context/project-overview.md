# Project Overview --- HelthNest System

## 1. Product summary

HelthNest System is an online medical consultation platform
connecting patients with doctors. Patients discover doctors, book an
available slot on a published schedule, pay upfront, and join a video
consultation at the scheduled time. Doctors manage schedules and
appointments and issue digital prescriptions after completed
consultations. Admins and Super Admins manage doctor approval, accounts,
and platform operations.

This document summarizes the supplied product requirements and frontend
implementation plan. It does not replace the backend specification or
confirm that every feature is already implemented.

## 2. Roles

The platform has four roles: - **Patient:** self-registers with
email/password or Google; books consultations and views personal
appointments, payments, and prescriptions. - **Doctor:** applies to
join, verifies email, waits for approval, then manages schedules,
consultations, and prescriptions. - **Admin:** manages doctor
applications, doctors, patients, and creates Admin accounts. - **Super
Admin:** has Admin capabilities plus the ability to create Super Admins
and block/unblock Admins and Super Admins.

Google login is patient-only. Admin and Super Admin accounts are created
by an authorized existing administrator, not through public
registration.

## 3. Core product rules

### Registration and authentication

- Patient credential registration and doctor application require email
  OTP verification.
- Google patient registration does not require a separate email OTP.
- Doctors can log in only after approval.
- Admin and Super Admin accounts are created by an existing authorized
  account, receive generated credentials by email, and must change
  their password after first login.
- Password reset is a two-step OTP flow.
- A logged-in user can change a password using the current password.
- A Google-only patient can set a password.
- Successful login/registration issues access and refresh tokens as
  cookies according to the product requirements.

### Doctor approval

- Doctor applications are submitted publicly and verified by email.
- Verified applications wait for Admin/Super Admin review.
- Approval activates the doctor and triggers a welcome email.
- Rejected or unapproved applications cannot use doctor functionality.

### Schedules

- Each schedule belongs to one doctor and one calendar date.
- A doctor can have at most one schedule per date.
- Duration is 3--8 hours and must remain within one calendar day.
- Doctor supplies a video meeting link.
- New schedules are drafts and are hidden from patients until
  published.
- The schedule is divided into 20-minute slots.
- Once published, date is locked.
- Time range is editable only until the first booking.
- Other schedule fields, including status and meeting link, may be
  edited after bookings.

### Patient booking

- Patients see only today's schedules.
- A schedule is visible/bookable only before its start time.
- Fully booked schedules are hidden.
- Patient selects an open slot and pays upfront.
- After successful payment, the appointment is created with `BOOKED`
  status and receives a serial number based on booking order.
- An invoice PDF containing meeting link, date, time, and payment
  details is emailed to the patient.

### Appointment lifecycle

`BOOKED → ONGOING → COMPLETED`

- Payment success creates a booked appointment.
- Doctor manually starts the consultation.
- Doctor manually completes the consultation.

### Prescriptions

- A prescription can be created only after its appointment is
  `COMPLETED`.
- It contains key findings and prescribed medicines.
- On submission, a PDF is generated and emailed to the patient.

### Cancellation and refunds

- More than one hour before the schedule start: cancel and refund.
- From exactly one hour before schedule start, during the schedule, or
  after it ends: cancellation allowed without refund.
- Refund eligibility must be determined by the backend.

## 4. Frontend technology stack

- Next.js 16+ with App Router
- TypeScript
- Tailwind CSS and shadcn/ui
- Zustand
- TanStack Query (React Query)
- React Hook Form and Zod
- Axios
- NextAuth/Auth.js is listed in the frontend proposal; integration
  approach must be confirmed against the existing backend auth
  contract.
- Lucide React

## 5. Frontend route map

### Public

- `/` --- landing page
- `/doctors` --- doctor listing and filters
- `/doctors/[doctorId]` --- public doctor profile
- `/about` --- platform information
- `/contact` --- contact information

### Authentication

- `/login`
- `/register`
- `/verify-email`
- `/forgot-password`
- `/reset-password`

### Patient

- `/dashboard`
- `/dashboard/profile`
- `/dashboard/appointments`
- `/dashboard/appointments/book`
- `/dashboard/appointments/[appointmentId]`
- `/dashboard/prescriptions`
- `/dashboard/payments`
- `/dashboard/analytics`

### Doctor

- `/doctor`
- `/doctor/profile`
- `/doctor/schedules`
- `/doctor/schedules/create`
- `/doctor/schedules/[scheduleId]`
- `/doctor/appointments`
- `/doctor/appointments/[appointmentId]`
- `/doctor/prescriptions`
- `/doctor/analytics`

### Admin

- `/admin`
- `/admin/doctors`
- `/admin/doctors/[doctorId]`
- `/admin/patients`
- `/admin/patients/[patientId]`
- `/admin/appointments`
- `/admin/payments`
- `/admin/analytics`

The product requirements also reserve Super Admin-only
account-management actions. Add dedicated UI routes only after the
backend and product owner confirm the desired screens.

## 6. Primary user journeys

1.  Patient registers, verifies email, and signs in.
2.  Patient browses doctors and today's available schedules.
3.  Patient selects a 20-minute slot, pays, and receives a confirmed
    appointment and invoice.
4.  Patient joins the consultation using the schedule's meeting link.
5.  Doctor starts and completes the appointment.
6.  Doctor creates a prescription; patient receives and views the PDF.
7.  Patient cancels an appointment; backend determines whether a refund
    applies.
8.  Doctor applies, verifies email, and waits for admin approval.
9.  Admin reviews and approves/rejects the doctor application.
10. Authorized Admin/Super Admin creates staff accounts and manages
    permitted accounts.

## 7. Key frontend feature areas

- Public marketing and doctor discovery
- Authentication and session handling
- Patient dashboard and profile
- Doctor dashboard, profile, and schedule management
- Appointment booking and lifecycle
- Payment and refund views
- Prescription creation and viewing
- Admin doctor/patient management
- Role-based dashboard analytics
- Responsive layout, accessibility, and error handling

## 8. Non-functional requirements

- Mobile-first responsive design.
- Accessible, touch-friendly forms and navigation.
- Typed API integration and centralized error handling.
- Pagination and debounced search for large datasets.
- Next.js image optimization and lazy loading.
- Unit, component, integration, and end-to-end tests.
- Vercel deployment with environment-specific configuration.
- Protect private health information and authentication credentials.

## 9. Explicitly unresolved items

- The payment provider is not specified by the product requirements.
  The frontend plan mentions bKash in one place and Stripe in another;
  confirm before implementation.
- The backend cookie/CORS setup must be verified before selecting the
  frontend session implementation.
- Confirm whether NextAuth/Auth.js is required or whether the frontend
  should use the backend's existing authentication endpoints directly.
- Confirm profile image/document upload provider and API.
- Confirm whether analytics APIs, WebSockets, and PDF storage/download
  endpoints exist.
- Confirm exact backend route names, payloads, response envelopes, and
  enum values before integrating.
