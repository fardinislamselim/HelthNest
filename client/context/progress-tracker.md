# Progress Tracker --- HelthNest Frontend

> Status is updated as work is implemented and verified. Do not mark an item complete
> based only on generated code; run the relevant checks.

## Status legend

- [ ] Not started
- [~] In progress
- [x] Completed and verified
- [!] Blocked / needs a decision

## 0. Project foundation

- [x] Confirm repository and current Next.js version (Next.js 16.4.5, React 19.3.0, TypeScript 5.x, Tailwind CSS v4).
- [x] Configure TypeScript strict mode, Tailwind CSS, and shadcn/ui.
- [x] Configure environment variables and `.env.example`.
- [x] Configure Axios client and API base URL (`withCredentials: true`, interceptors, refresh queue).
- [x] Configure TanStack Query provider and query defaults.
- [x] Configure Zustand UI store (`useUiStore` for sidebar/mobile navigation).
- [x] Configure global fonts, metadata, and design tokens.
- [x] Add linting, formatting, and typecheck scripts (`pnpm run typecheck`, `pnpm run lint`, `pnpm run build`).
- [x] Add global error, not-found, and forbidden pages (`not-found.tsx`, `error.tsx`, `forbidden/page.tsx`).

## 1. Shared UI and public pages

- [x] Build responsive header and navigation (`PublicHeader` with desktop links & mobile drawer).
- [x] Build footer (`PublicFooter` with semantic sections and disclaimer).
- [x] Build dashboard sidebar and mobile navigation (`DashboardSidebar` with role-aware nav, collapse toggle).
- [x] Build reusable cards, badges, inputs, labels, and feedback primitives.
- [x] Build loading skeletons, empty states, error states, and toast feedback (`StatusBadge`, `EmptyState`, `ErrorState`, `LoadingSkeleton`, Sonner).
- [x] Build landing page (`src/app/(public)/page.tsx` with hero, 3-step consultation, trust metrics).
- [ ] Build public doctor listing and filters.
- [ ] Build public doctor profile.
- [x] Build About and Contact pages (`about/page.tsx`, `contact/page.tsx`).

## 2. Authentication

- [x] Confirm backend auth endpoints and cookie/CORS behavior (documented in `docs/api-contract.md`).
- [x] Implement patient registration (`src/app/(auth)/register/page.tsx` with React Hook Form, Zod, and API integration).
- [x] Implement doctor application/registration (`src/app/(public)/doctors/apply/page.tsx` with credentials and resume upload).
- [x] Implement email OTP verification and resend (`src/app/(auth)/verify-email/page.tsx` with 60s cooldown timer and multi-role support).
- [x] Implement email/password login (`src/app/(auth)/login/page.tsx` with role-aware redirects and error feedback).
- [x] Integrate patient Google login (`@react-oauth/google` integrated into `SocialAuthButtons`, `LoginForm`, `PatientRegisterForm`, and `Providers`).
- [x] Implement forgot-password OTP request (`src/app/(auth)/forgot-password/page.tsx` with `ForgotPasswordForm`, Zod validation, and backend API).
- [x] Implement reset password (`src/app/(auth)/reset-password/page.tsx` with `ResetPasswordForm`, 6-digit OTP, password confirmation validation, and cooldown resend).
- [ ] Implement change password.
- [ ] Implement set password for Google-only patients.
- [x] Implement refresh coordination and logout (Axios interceptor refresh queue + `/auth/logout` endpoint + cache clearing).
- [x] Implement session restoration and current-user query (`useAuth` hook powered by TanStack Query `/auth/me`).
- [x] Implement role-aware route navigation and forbidden states (`ProtectedRoute` guarding `/dashboard`, `/doctor`, `/admin`).
- [x] Test blocked, pending, rejected, and unauthenticated access (Checked with status banners and redirect boundaries).

## 3. Patient experience

- [x] Patient dashboard overview and statistics (`GET /dashboard/patient`).
- [x] View/edit patient profile (`GET /users/me`, `PATCH /users/me`).
- [x] Profile image upload (`PATCH /users/me/profile-image` via Cloudinary).
- [x] Appointment list and filters (`GET /appointments/my-appointments`).
- [x] Today's schedule discovery (`GET /schedules/today`).
- [x] Available 20-minute slot selection (`GET /schedules/:scheduleId/slots`).
- [x] Booking review and payment initiation (`POST /appointments`, `POST /payments/checkout/:appointmentId`).
- [x] Payment return and server confirmation (`/payment/success` and `/payment/cancel`).
- [x] Appointment details and cancellation (`GET /appointments/:appointmentId`, `PATCH /appointments/:appointmentId/cancel`).
- [x] Prescription list and PDF access (`GET /prescriptions/my-prescriptions`, `GET /prescriptions/:prescriptionId/pdf`).
- [x] Payment history (`GET /refunds/my-refunds` & appointment billing).
- [x] Personal analytics (Consultation ratios, spending, specialty distributions).

## 4. Doctor experience

- [ ] Doctor dashboard overview.
- [ ] Doctor profile and professional information.
- [ ] Create draft schedule with validation.
- [ ] Publish/unpublish schedule.
- [ ] Edit/delete schedule subject to backend rules.
- [ ] Schedule detail and slot overview.
- [ ] Doctor appointment list.
- [ ] Appointment details and meeting link.
- [ ] Start consultation.
- [ ] Complete consultation.
- [ ] Create prescription for completed appointment.
- [ ] Prescription PDF/email confirmation state.
- [ ] Doctor analytics.

## 5. Admin and Super Admin experience

- [ ] Admin dashboard overview.
- [ ] Pending doctor application list.
- [ ] Doctor application detail and review.
- [ ] Approve/reject doctor application.
- [ ] Block/unblock doctor.
- [ ] Patient list and detail.
- [ ] Block/unblock patient.
- [ ] Admin creation flow.
- [ ] Super Admin creation flow (Super Admin only).
- [ ] Admin/Super Admin block controls (Super Admin only).
- [ ] Appointment and payment overview.
- [ ] Platform analytics.
- [ ] Verify permission differences between Admin and Super Admin.

## 6. Payments, refunds, and documents

- [x] Confirm payment provider and backend contract (Stripe confirmed in backend).
- [x] Implement payment initiation and redirect/checkout.
- [x] Handle return/callback safely.
- [x] Fetch backend-confirmed payment/appointment state.
- [x] Display invoice PDF.
- [x] Display refund status and history.
- [x] Handle cancellation/refund eligibility messages.
- [x] Display and download prescription PDFs.

## 7. Quality and release

- [x] Responsive audit: mobile, tablet, desktop.
- [ ] Accessibility and keyboard-navigation audit.
- [ ] Unit tests for schemas and utilities.
- [ ] Component tests for critical forms and states.
- [ ] E2E registration and login tests.
- [ ] E2E booking/payment-return tests.
- [ ] E2E doctor schedule and appointment tests.
- [ ] E2E prescription access tests.
- [ ] Performance and image optimization audit.
- [ ] Production environment configuration.
- [ ] Vercel deployment and smoke test.
- [ ] Final security/privacy review.

## Decisions and blockers

| Date | Topic | Decision / resolution | Status |
| --- | --- | --- | --- |
| 2026-11-05 | Authentication transport | Backend uses HTTP-only cookies (`accessToken`, `refreshToken`) with CORS `credentials: true` and Bearer token header fallback. Axios configured with `withCredentials: true`. | Resolved |
| 2026-11-05 | Payment provider | Backend uses Stripe Checkout and Stripe Refunds. Documented in `docs/api-contract.md`. | Resolved |
| 2026-11-05 | NextAuth/Auth.js vs Backend Session | Directly integrate with the backend auth endpoints using Axios + HTTP-only cookies + TanStack Query to avoid dual auth synchronization issues. | Resolved |
| 2026-11-05 | Document / Prescription PDFs | Generated and streamed server-side by backend via `/prescriptions/:prescriptionId/pdf`. | Resolved |
| 2026-11-06 | Auth Redirect & Navbar Synchronization | Fixed backend development cookie options (`sameSite: "lax"`, `secure: false`), included full user and relation payload in login response, added TanStack Query synchronous cache seeding in `useAuth`, and integrated navbar skeleton loading to eliminate layout flash. | Resolved |
| 2026-11-07 | Patient Dashboard & Module Implementation | Completed full patient experience (Dashboard metrics, profile editing & Cloudinary image upload, today's schedule discovery, 20-min slot selection, Stripe checkout & payment return, appointment management & cancellation with refund rules, digital prescriptions & PDF download, billing/refund history, and personal analytics). | Resolved |
| 2026-11-07 | Responsive Design & Mobile Drawer Audit | Fully refactored dashboard navigation, sidebar, layout shells, cards, stats, tables, dialogs, and analytics for fluid responsiveness across all target viewports (320px–1440px). Implemented mobile drawer with backdrop, scroll-lock, auto-close, touch-sized buttons, horizontal scroll containers, and mobile cards for wide tables. Verified with 0 type errors, 0 lint warnings, and clean Next.js 16 production build. | Resolved |

---

## Current milestone

**Milestone:** 3. Patient Experience  
**Overall status:** Completed & Verified (Dashboard, Profile, Schedules, Booking, Payments, Appointments, Prescriptions, Analytics)  
**Next recommended task:** Task 4: Doctor Experience (Doctor dashboard overview, profile management, schedule creation with slot generation, publishing/unpublishing, consultation management, and digital prescription issuance).
