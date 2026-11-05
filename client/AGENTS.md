# AGENT.md — HelthNest Frontend

> Start here before making any changes to the HelthNest / HealthNest frontend.

## 1. Mission

Build a secure, responsive healthcare consultation frontend for Patients, Doctors, Admins, and Super Admins. The existing HelthNest backend is the source of truth for authentication, authorization, account status, doctor approval, schedules, slots, appointments, payments, refunds, and prescriptions.

Do not invent backend functionality, API endpoints, request fields, response shapes, or permissions.

## 2. Read these documents first

Read the following project documents before coding:

1. `project-overview.md` — product scope, roles, workflows, and business rules.
2. `architecture.md` — application architecture, folders, data flow, and API boundaries.
3. `code-standards.md` — TypeScript, React, API, testing, and Git conventions.
4. `ui-context.md` — visual direction, layouts, reusable components, and accessibility.
5. `ai-workflow-rules.md` — required development workflow and completion criteria.
6. `progress-tracker.md` — current status, decisions, and blockers.
7. `api-docs.md` — API Docs.

These files are the working project guidance. If existing code conflicts with them, inspect the code and explain the conflict before making breaking changes. Do not overwrite existing work.

## 3. Planned technology stack

Use the existing repository setup where possible:

- Next.js 16+ App Router
- TypeScript with strict type checking
- Tailwind CSS and shadcn/ui
- TanStack Query for server state
- Zustand for client-only UI state
- React Hook Form and Zod for forms
- Axios for HTTP requests
- Lucide React for icons

Use Server Components by default. Add `"use client"` only when state, event handlers, effects, or browser-only libraries are required.

Do not add NextAuth/Auth.js automatically. First inspect the backend authentication contract and decide whether Auth.js is necessary. Avoid creating a second independent authentication system.

## 4. First actions when starting

### Step 1 — Inspect the frontend repository

- Inspect the current directory, source files, `package.json`, lockfile, `tsconfig.json`, and Next.js/Tailwind configuration.
- Identify the package manager from the lockfile and use it consistently.
- Check which planned dependencies are already installed.
- Identify existing components, layouts, routes, and conventions.
- Do not replace configuration or dependencies without a clear reason.
- Do not delete or overwrite user work.

### Step 2 — Inspect the backend contract

Before API integration, inspect backend routes, controllers/services, validation schemas, response formats, and relevant Prisma models.

Verify:

- API base URL, exact paths, HTTP methods, request bodies, query parameters, and response envelopes.
- Role names and enum values.
- Access/refresh token behavior.
- Cookie names, domain, path, `SameSite`, and `Secure` settings.
- CORS origin and credentials configuration.
- Google OAuth flow and callback contract.
- Doctor application and approval states.
- Schedule and available-slot response formats.
- Payment provider and payment confirmation flow.
- Prescription/invoice PDF delivery.
- File upload provider and file constraints.

Never guess missing details. Record unresolved decisions in `progress-tracker.md`.

### Step 3 — Establish the foundation

Implement and verify in this order:

1. Next.js App Router and TypeScript configuration.
2. Tailwind CSS and shadcn/ui setup.
3. Global fonts, theme tokens, and root layout.
4. Shared providers, including TanStack Query.
5. Central Axios client and normalized API error handling.
6. Shared UI components and responsive public layout.
7. Authentication/session integration after verifying the backend.
8. Role-aware dashboard layouts and navigation.

### Step 4 — Build a small vertical slice

Start with patient login:

1. Login page and form.
2. Zod validation.
3. Login API integration.
4. Current-user/session retrieval.
5. Protected patient dashboard.
6. Logout.
7. Loading, error, and unauthorized states.
8. Relevant tests and progress-tracker update.

After verifying this slice, continue with patient registration and OTP verification.

## 5. Roles and permissions

The product defines four roles:

- `PATIENT`
- `DOCTOR`
- `ADMIN`
- `SUPER_ADMIN`

Confirm exact enum casing in the backend.

Rules:

- Patients can register using email/password or Google.
- Google authentication is patient-only.
- Doctors apply, verify email, and require approval before using doctor features.
- Admin and Super Admin accounts cannot self-register.
- Admins can manage doctors and patients and create Admin accounts.
- Only Super Admins can create Super Admin accounts or block/unblock Admin and Super Admin accounts.

Frontend route guards improve user experience; backend authorization is the actual security boundary.

## 6. Authentication and security

The product requirements specify access and refresh tokens delivered as cookies.

- Prefer backend-managed HTTP-only cookies.
- Configure Axios `withCredentials: true` when cross-origin cookies are used.
- Verify CORS and cookie settings in local and production environments.
- Never read HTTP-only cookies from JavaScript.
- Never store access or refresh tokens in localStorage or sessionStorage.
- Never expose secrets or server-only environment variables to browser code.
- Coordinate refresh requests to avoid concurrent refresh races.
- If refresh fails, clear client session state and redirect to login.
- Logout must call the backend and clear client-side user state.
- Never log passwords, OTPs, tokens, payment secrets, or private medical data.

If the backend differs from the product requirements, document the difference before choosing another strategy. In-memory token state is not equivalent to HTTP-only cookies and is lost on reload.

## 7. API and state management

- All HTTP requests go through the centralized Axios client.
- Centralize endpoint paths and query-key factories.
- Use TanStack Query for API/server state.
- Use Zustand only for client UI state, such as sidebar visibility.
- Use React Hook Form for form state and Zod for client validation.
- Do not duplicate server data in Zustand.
- Map backend validation errors into form fields.
- Invalidate affected queries after successful mutations.
- Do not optimistically confirm payments, refunds, or bookings.
- Never trust client-submitted prices, roles, serial numbers, appointment status, or refund eligibility.

## 8. Healthcare business rules

### Schedules

- One schedule per doctor per calendar date.
- Duration must be between 3 and 8 hours.
- A schedule cannot cross midnight.
- New schedules start as drafts.
- Patients only see published schedules.
- Slots are 20 minutes each.
- Published schedule date cannot be changed.
- Time range can only change before the first booking.
- Patients see only today's schedules, before the schedule start time.
- Fully booked schedules are hidden from patient discovery.

### Appointments and payments

- Patients select an available slot and pay upfront.
- Create an appointment with `BOOKED` status only after backend-confirmed payment success.
- Assign the serial number after successful payment.
- Lifecycle: `BOOKED → ONGOING → COMPLETED`.
- Doctors start and complete consultations.
- Prevent duplicate UI submissions, but rely on backend transaction/locking logic to prevent double booking.

### Prescriptions

- A prescription can only be created for a `COMPLETED` appointment.
- Prescription submission generates a PDF and emails it to the patient according to backend behavior.

### Cancellation and refunds

- Cancellation more than one hour before schedule start is refundable.
- Cancellation exactly one hour before start, during the schedule, or after it ends is not refundable.
- The backend determines and enforces refund eligibility.

## 9. UI and accessibility

- Build mobile-first and verify mobile, tablet, and desktop layouts.
- Follow `ui-context.md` and use shared design tokens.
- Use semantic HTML and accessible labels.
- Ensure keyboard navigation and visible focus states.
- Give icon-only buttons accessible names.
- Do not communicate status through color alone.
- Respect reduced-motion preferences.
- Data-driven screens need loading, empty, error, and success states where applicable.
- Do not leave dead buttons, fake links, or apparently functional placeholders.
- Do not invent doctor ratings, testimonials, certifications, partner logos, or medical claims.

## 10. Payments, uploads, and optional features

The frontend plan mentions bKash in the booking flow and Stripe elsewhere. The product requirements do not select a provider.

- Confirm the payment provider and backend contract before implementation.
- Never treat a frontend redirect as proof of payment.
- Confirm the upload provider and backend constraints before implementing uploads.
- Confirm whether PDFs are generated/stored by the backend or uploaded by the frontend.
- WebSockets are optional; do not assume backend support.

## 11. Code quality and tests

Before marking work complete:

- Run lint.
- Run TypeScript type checking.
- Run relevant unit and component tests.
- Add tests for important workflows and permission boundaries.
- Manually verify responsive behavior for UI changes.
- Fix errors introduced by the implementation.
- Do not hide type errors with broad `any`, `@ts-ignore`, or unsafe casts.

Prioritize tests for registration/OTP, login/logout, role restrictions, schedule publishing, slot selection, booking/payment confirmation, cancellation/refund display, appointment lifecycle, and prescription access.

## 12. Git rules

Use focused Conventional Commits:

```text
feat(auth): implement patient login
feat(auth): add email otp verification
feat(doctor): build schedule management
feat(booking): integrate available slot selection
fix(session): handle refresh token failure
test(booking): cover duplicate submission behavior
docs(frontend): update implementation progress
```

Never commit `.env` files, secrets, credentials, build output, or unrelated changes. Do not reset, force-push, or discard user changes unless explicitly instructed.

## 13. Progress tracking

Update `progress-tracker.md` after every meaningful task.

- `[ ]` Not started
- `[~]` In progress
- `[x]` Completed and verified
- `[!]` Blocked / needs a decision

Only mark work complete after implementation and relevant checks. Record unresolved API contracts and product decisions instead of guessing.

## 14. Required task report

After each coding task, report:

1. **Implemented:** behavior and key files changed.
2. **API integration:** verified endpoints/contracts, or state clearly if mocked.
3. **Validation:** lint, typecheck, tests, and manual checks performed.
4. **Remaining:** known gaps, blockers, and next recommended task.

Be honest about checks not run. Generated files alone do not mean a feature is complete.

## 15. Agent start instruction

When first entering this project:

1. Read all six project documentation files.
2. Inspect the existing frontend repository without modifying it.
3. Inspect backend auth routes, DTOs/validation, cookie settings, CORS, and API response formats if backend source is available.
4. Summarize the current project state, existing setup, and conflicts or missing information.
5. Propose the smallest safe first implementation task.
6. Wait for approval before broad architectural changes or replacing existing setup.
