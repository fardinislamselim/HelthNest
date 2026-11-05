# Code Standards --- HelthNest Frontend

## 1. General principles

- Use TypeScript strict mode; avoid `any`. Prefer `unknown` and narrow
  it.
- Keep components focused and small; extract reusable logic when it
  improves clarity.
- Prefer explicit names over abbreviations.
- Avoid premature abstraction and unnecessary dependencies.
- Follow existing repository conventions when they do not conflict
  with these rules.

## 2. Naming

- Components and component files: PascalCase, e.g. `DoctorCard.tsx`.
- Hooks: `use` + camelCase, e.g. `useTodaySchedules.ts`.
- Utilities: camelCase, e.g. `formatCurrency.ts`.
- Constants: descriptive UPPER_SNAKE_CASE for true constants.
- Types/interfaces: PascalCase; use domain-specific names such as
  `DoctorProfile` and `Appointment`.
- Boolean variables should read naturally: `isLoading`,
  `hasAvailableSlots`, `canCancel`.
- Route parameters should use descriptive names such as
  `appointmentId`.

## 3. React and Next.js

- Use Server Components by default.
- Add `"use client"` only when using state, effects, browser APIs, or
  client-only libraries.
- Keep data fetching in the appropriate server/API or TanStack Query
  layer; do not fetch the same data redundantly.
- Do not place secrets in client components.
- Use Next.js `<Image>` for managed images and configure remote image
  domains explicitly.
- Use `next/link` for internal navigation.
- Avoid unnecessary effects; derive values during render or use event
  handlers where possible.
- Never mutate props or state directly.
- Use stable keys when rendering lists.

## 4. TypeScript

- Define request, response, and domain types explicitly.
- Type API responses; do not assume unvalidated JSON is correct.
- Use discriminated unions for multi-state workflows where useful.
- Avoid non-null assertions (`!`) unless the invariant is documented
  and guaranteed.
- Use `as const` for immutable literal maps where appropriate.
- Keep types close to the feature that owns them; move genuinely
  shared types to `src/types`.

## 5. API and TanStack Query

- All HTTP requests must go through the shared API client.
- Centralize endpoint paths and query key factories.
- Use query hooks for reads and mutation hooks for writes.
- Handle cancellation/abort signals where supported.
- Normalize API errors in one place and show safe, user-friendly
  messages.
- Never expose raw stack traces or internal server errors in the UI.
- Invalidate affected queries after mutations.
- Do not trust frontend-calculated prices, permissions, booking
  status, or refund decisions.

## 6. State management

- TanStack Query owns server state.
- Zustand owns global client UI state only (e.g. sidebar, theme,
  transient wizard state).
- React Hook Form owns form state.
- Avoid storing duplicate copies of the same user or API entity in
  multiple stores.
- Do not persist access or refresh tokens in
  localStorage/sessionStorage.
- Do not persist sensitive medical or personal data unless there is an
  explicit, reviewed requirement.

## 7. Forms and validation

- Use React Hook Form with Zod resolver.
- Keep schemas in the owning feature or `lib/validations` if shared.
- Show field-level errors and a form-level server error when
  appropriate.
- Disable submit while a request is pending and prevent accidental
  duplicate submissions.
- Preserve entered non-sensitive values after recoverable server
  errors.
- Never log passwords, OTPs, or sensitive form values.
- OTP inputs must support keyboard navigation, paste, screen readers,
  and mobile input.

## 8. UI and accessibility

- Use shadcn/ui primitives where appropriate; customize through
  variants and composition.
- Use semantic landmarks and headings in a logical order.
- Every input must have an accessible label.
- Buttons must have explicit types (`button`, `submit`, or `reset`).
- Icon-only controls need accessible names.
- Ensure keyboard navigation, focus visibility, and sufficient
  contrast.
- Do not communicate status by color alone.
- Respect reduced-motion preferences.
- Test at mobile, tablet, and desktop breakpoints.

## 9. Styling

- Use Tailwind utility classes consistently.
- Avoid inline styles except for genuinely dynamic values.
- Extract repeated class combinations into components or `cn()`
  helpers when beneficial.
- Keep spacing, typography, colors, borders, and radii consistent with
  `ui-context.md`.
- Avoid arbitrary values when an existing design token is suitable.

## 10. Error, loading, and empty states

Every data-driven page should handle: - Initial loading (skeleton or
progress indicator). - Empty result (helpful explanation and next
action). - Request failure (safe message and retry where appropriate). -
Permission denied (clear forbidden state). - Success feedback for
mutations. - Stale or unavailable data where relevant.

## 11. Security and privacy

- Backend authorization is the security boundary.
- Never render sensitive data the current user is not authorized to
  see.
- Do not put secrets in source code or `NEXT_PUBLIC_` variables.
- Avoid unsafe HTML injection. Sanitize any unavoidable rich content.
- Validate file type and size client-side for usability and on the
  backend for security.
- Use HTTPS in production.
- Do not log tokens, passwords, OTPs, payment details, or medical
  information.

## 12. Testing

- Unit-test utilities and validation schemas.
- Test important components and user interactions with React Testing
  Library.
- Test critical journeys with Playwright: registration/verification,
  login/logout, booking/payment return, doctor schedule publishing,
  appointment lifecycle, and prescription access.
- Mock API boundaries in component tests.
- Include permission and failure-path tests, not only happy paths.

## 13. Git conventions

Use Conventional Commits:

```text
feat(auth): add patient email registration
fix(schedule): prevent editing time after first booking
refactor(api): centralize appointment endpoints
test(booking): cover duplicate submission handling
docs(frontend): document authentication flow
chore(deps): update ui dependencies
```

Keep commits focused and avoid committing `.env`, credentials, build
output, or unrelated changes.
