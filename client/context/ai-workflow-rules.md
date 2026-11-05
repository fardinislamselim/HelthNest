# AI Workflow Rules --- HelthNest Frontend

## 1. Mission

Build the HelthNest System frontend described in
`project-overview.md`, following the architecture, code standards, UI
context, and progress tracker in this documentation set.

## 2. Source of truth

Before changing code: 1. Read `project-overview.md` for product scope
and business rules. 2. Read `architecture.md` for boundaries, routing,
data flow, and folder ownership. 3. Read `code-standards.md` for
implementation conventions. 4. Read `ui-context.md` before creating or
modifying UI. 5. Update `progress-tracker.md` after completing
meaningful work.

Do not invent backend capabilities, endpoint paths, response shapes,
payment behavior, or permissions. Inspect the actual backend
routes/types first. If a detail is unknown, mark it as an assumption and
ask for confirmation when it affects implementation.

## 3. Work sequence

For each task: 1. Identify the user story, role, route, API dependency,
and acceptance criteria. 2. Inspect relevant existing files before
editing. 3. Propose a small implementation plan when the task spans
multiple modules. 4. Implement the smallest complete vertical slice. 5.
Add loading, empty, error, success, and unauthorized states. 6. Run
available lint, typecheck, and tests. 7. Fix regressions introduced by
the change. 8. Update progress tracker and report changed files, checks,
and remaining blockers.

Do not rewrite unrelated files or replace established project
conventions without a clear reason.

## 4. Backend integration rules

- Treat the backend as the authority for authentication, roles,
  account status, doctor approval, schedule availability, booking,
  payments, and refunds.
- Keep API paths and payloads in a centralized API layer.
- Use TanStack Query for server state; do not duplicate server data in
  Zustand.
- Use the backend's actual authentication contract. The product
  requirements describe access and refresh tokens delivered as
  cookies. Prefer HTTP-only cookies with `credentials: "include"` and
  correct CORS configuration. Do not move tokens into localStorage or
  expose HTTP-only tokens to JavaScript.
- If the backend genuinely returns tokens in a response body instead,
  document the contract and obtain an explicit security decision
  before changing the storage strategy. In-memory token state is not
  persistent across reloads and must not be presented as equivalent to
  HTTP-only cookies.
- Never assume a payment is successful from a frontend redirect alone.
  Confirm status with the backend.
- Do not expose secrets, private keys, payment credentials, or
  server-only environment variables in client bundles.
- Do not log passwords, OTPs, access tokens, refresh tokens, payment
  secrets, or sensitive medical details.

## 5. Authorization and privacy

- Use role-aware navigation and route guards for user experience, but
  never treat frontend guards as security boundaries. Backend
  authorization remains mandatory.
- Support the four roles: `PATIENT`, `DOCTOR`, `ADMIN`, and
  `SUPER_ADMIN` (confirm exact enum casing against backend).
- A pending, rejected, or blocked doctor must not be treated as an
  active doctor.
- A blocked account must be handled according to backend response and
  must not continue into protected workflows.
- Patients may access only their own private records; doctors only the
  records permitted by the backend and their appointments; admins only
  actions permitted by their role.
- Do not put medical records or personally identifiable data into
  URLs, analytics events, or client-side logs.

## 6. UI implementation rules

- Use the shared design system and reusable components.
- Build responsive, accessible interfaces with keyboard support and
  visible focus states.
- Use semantic HTML and labels for form controls.
- Use React Hook Form and Zod for form state and validation.
- Keep forms resilient to server-side validation errors.
- Include skeleton/loading, empty, error, retry, and success states
  for data-driven screens.
- Avoid fake functionality, dead buttons, placeholder links, and
  hard-coded production data.
- Static mock data may be used only when explicitly building a
  prototype; label it clearly and isolate it from real API data.

## 7. Scope control

- Implement only the requested task and necessary supporting work.
- Do not silently add features such as chat, WebSockets, recurring
  schedules, or extra roles.
- WebSocket updates are optional and only implemented if the backend
  supports them.
- Payment provider is not fixed by the product requirements. Confirm
  the provider and its integration contract before implementation. The
  frontend plan mentions bKash and also contains a Stripe typo; do not
  assume either without confirmation.
- File upload provider and document workflow must match backend
  support.

## 8. Completion criteria

A task is complete only when: - Acceptance criteria are met. -
TypeScript has no new errors. - Lint and relevant tests pass, or any
failure is clearly reported. - UI works at mobile, tablet, and desktop
widths. - Loading, empty, error, success, and permission states are
handled where relevant. - API integration uses verified contracts. -
Progress tracker is updated.

## 9. Reporting format

At the end of each task report: - **Implemented:** user-visible behavior
and key files. - **API contract:** endpoints and assumptions used. -
**Validation:** lint, typecheck, tests, and manual checks. -
**Remaining:** known gaps, blockers, and next recommended task.
