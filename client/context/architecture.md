# Architecture --- HelthNest Frontend

## 1. Overview

The frontend is a role-based healthcare application built with Next.js
App Router, TypeScript, Tailwind CSS, shadcn/ui, Zustand, TanStack
Query, React Hook Form, and Zod.

The frontend is responsible for presentation, user interaction,
client-side validation, and API communication. The backend remains
authoritative for identity, authorization, scheduling, booking,
payments, refunds, and medical records.

## 2. Technology choices

- **Next.js 16+ App Router:** routing, layouts, server rendering where
  appropriate.
- **TypeScript:** strict typing across application code.
- **Tailwind CSS + shadcn/ui:** styling and accessible UI primitives.
- **TanStack Query:** API requests, caching, mutations, invalidation.
- **Zustand:** small client-only global state such as sidebar and
  transient UI state.
- **React Hook Form + Zod:** forms and client-side validation.
- **Axios:** centralized HTTP client and interceptors.
- **Lucide React:** icons.
- **NextAuth/Auth.js:** use only if its provider/session model is
  deliberately integrated with the existing backend. Do not introduce
  a second independent identity system or duplicate backend
  authentication.

## 3. Application boundaries

### UI layer

Pages, layouts, components, navigation, dialogs, tables, charts, and
form presentation. UI components should not directly construct arbitrary
API URLs.

### Feature layer

Feature-specific hooks, schemas, types, and components for
authentication, users, doctors, schedules, appointments, payments,
refunds, prescriptions, and dashboards.

### Data/API layer

Centralized Axios instance, endpoint definitions, request/response
types, and feature API functions. TanStack Query hooks call these
functions.

### State layer

- Server state: TanStack Query.
- Client UI state: Zustand.
- Form state: React Hook Form.
- URL state: filters, search, pagination, and shareable navigation
  state where appropriate.

## 4. Suggested folder structure

```text
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── doctors/
│   │   │   ├── page.tsx
│   │   │   └── [doctorId]/page.tsx
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── verify-email/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (patient)/
│   │   └── dashboard/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── profile/page.tsx
│   │       ├── appointments/
│   │       │   ├── page.tsx
│   │       │   ├── book/page.tsx
│   │       │   └── [appointmentId]/page.tsx
│   │       ├── prescriptions/page.tsx
│   │       ├── payments/page.tsx
│   │       └── analytics/page.tsx
│   ├── (doctor)/
│   │   └── doctor/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── profile/page.tsx
│   │       ├── schedules/
│   │       │   ├── page.tsx
│   │       │   ├── create/page.tsx
│   │       │   └── [scheduleId]/page.tsx
│   │       ├── appointments/
│   │       │   ├── page.tsx
│   │       │   └── [appointmentId]/page.tsx
│   │       ├── prescriptions/page.tsx
│   │       └── analytics/page.tsx
│   ├── (admin)/
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── doctors/page.tsx
│   │       ├── doctors/[doctorId]/page.tsx
│   │       ├── patients/page.tsx
│   │       ├── patients/[patientId]/page.tsx
│   │       ├── appointments/page.tsx
│   │       ├── payments/page.tsx
│   │       └── analytics/page.tsx
│   ├── forbidden/page.tsx
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── layout.tsx
│   └── providers.tsx
├── components/
│   ├── ui/
│   ├── forms/
│   ├── layout/
│   ├── data-display/
│   └── feedback/
├── features/
│   ├── auth/
│   ├── profile/
│   ├── doctors/
│   ├── schedules/
│   ├── appointments/
│   ├── payments/
│   ├── refunds/
│   ├── prescriptions/
│   └── dashboard/
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── endpoints.ts
│   │   └── errors.ts
│   ├── auth/
│   ├── query/
│   ├── utils.ts
│   └── validations/
├── stores/
├── types/
└── styles/
```

Route groups are organizational and do not add URL segments. Keep actual
URL paths aligned with the route names above.

## 5. API request lifecycle

1.  A page or feature component invokes a typed TanStack Query hook.
2.  The hook calls a feature API function.
3.  The API function uses the shared Axios client and endpoint
    constants.
4.  The backend validates identity, role, account status, and business
    rules.
5.  The API response is normalized only where necessary and returned to
    the query cache.
6.  Components render loading, error, empty, or success states.
7.  Mutations invalidate or update only affected query keys.

## 6. Authentication and session architecture

The HelthNest product specification says successful
login/registration issues access and refresh tokens as cookies. Use
secure HTTP-only cookies when supported by the backend: - Axios should
set `withCredentials: true`. - Backend CORS must allow the exact
frontend origin and credentials. - Cookie `SameSite`, `Secure`, domain,
and path settings must work for the deployment topology. - JavaScript
must not read HTTP-only tokens. - Refresh should be coordinated to avoid
multiple simultaneous refresh requests. - On refresh failure, clear
client session state and redirect to login. - Logout must call the
backend and clear client-side user state.

A browser memory store can hold non-secret user/session presentation
data, not HTTP-only token values. If the backend contract differs,
resolve it explicitly before coding.

Use middleware only for checks that can be safely performed from
available server-readable session information. Client-side route guards
improve navigation UX but do not replace backend authorization.

## 7. Query and mutation conventions

- Use stable query keys grouped by feature.
- Include relevant filters, pagination, and IDs in query keys.
- Set stale times intentionally; do not cache sensitive data longer
  than needed.
- Invalidate appointment, schedule, payment, or prescription queries
  after successful mutations.
- Avoid optimistic updates for payment, refund, booking, or other
  high-impact operations unless rollback behavior is fully
  implemented.

## 8. Booking and payment flow

1.  Patient browses today's visible schedules.
2.  Patient loads open 20-minute slots.
3.  Patient selects a slot and reviews booking details.
4.  Frontend initiates payment using the verified backend contract.
5.  Payment provider flow runs.
6.  Backend verifies payment independently.
7.  Appointment is created only after confirmed payment and assigned a
    serial number.
8.  Frontend fetches the confirmed appointment and displays the
    invoice/confirmation.

Prevent duplicate submissions in the UI, but rely on backend
transactional locking/idempotency to prevent double booking and
duplicate payment processing.

## 9. Forms and validation

- Zod schemas mirror backend constraints but do not replace backend
  validation.
- Share schemas between client/server only if the project structure
  and runtime support it.
- Map backend field errors into React Hook Form.
- Do not trust client-submitted role, price, appointment status,
  serial number, refund eligibility, or payment status.

## 10. Environment variables

Use a public API base URL such as:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

Only variables prefixed with `NEXT_PUBLIC_` are exposed to browser code.
Keep all secrets server-side. Do not commit real `.env` files; provide
`.env.example`.

## 11. Unresolved integration decisions

Confirm these against the backend before implementation: - Exact API
route paths, payloads, response envelopes, and enum casing. - Whether
authentication cookies work across the frontend/backend origins. -
Google OAuth flow ownership and callback contract. - Payment provider:
the frontend brief mentions bKash, while another line says Stripe.
Product requirements do not select a provider. - Profile/document image
upload provider and accepted file constraints. - Whether analytics
endpoints exist or need aggregation endpoints. - Whether real-time
updates are supported; WebSocket is optional, not assumed. - Whether
prescription PDFs are generated/stored by backend or uploaded by
frontend.
