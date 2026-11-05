# UI Context --- HelthNest System

## 1. Visual direction

Create a modern, trustworthy, calm healthcare product. The interface
should feel professional and reassuring rather than overly clinical or
decorative. Prioritize clarity, readable information, predictable
navigation, and accessible interactions.

No supplied brand guide, logo, approved color palette, typography
system, or reference screenshots were included in the frontend plan.
Treat the visual tokens below as a proposed starting point and keep them
easy to change after brand approval.

## 2. Proposed design principles

- **Trust:** clear identity, doctor credentials, appointment details,
  and payment status.
- **Clarity:** plain-language labels and concise explanations.
- **Calm:** restrained color use, generous whitespace, and low visual
  noise.
- **Consistency:** shared spacing, typography, controls, cards, and
  status indicators.
- **Accessibility:** adequate contrast, keyboard navigation, focus
  indicators, semantic structure, and screen-reader labels.
- **Responsive first:** essential actions remain usable on small
  screens.

## 3. Suggested visual tokens

These are provisional, not confirmed brand requirements: - Primary:
teal/emerald family for healthcare identity and primary actions. -
Neutrals: slate/gray scale for text, borders, surfaces, and
backgrounds. - Success: green. - Warning: amber. - Destructive/error:
red. - Information: blue. - Use semantic CSS variables so themes can be
updated centrally.

Example semantic tokens:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --card: 0 0% 100%;
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  --primary: 173 80% 30%;
  --primary-foreground: 0 0% 100%;
  --border: 214 32% 91%;
  --destructive: 0 72% 51%;
}
```

Adjust values to the approved brand palette and shadcn/ui theme setup.

## 4. Typography and spacing

- Use a highly readable sans-serif font.
- Establish a consistent type scale for page titles, section headings,
  body text, labels, and helper text.
- Use a consistent spacing scale; avoid one-off spacing values when
  tokens exist.
- Keep paragraphs and form instructions concise.
- Use tabular numerals for dates, times, serial numbers, and currency
  where useful.

## 5. Layout patterns

### Public website

- Header with brand, primary navigation, and login/register actions.
- Hero section explaining online consultation.
- Doctor discovery entry point.
- Feature and process sections.
- Trust/FAQ content only when supported by real product information.
- Footer with useful navigation and contact details.

### Authentication

- Focused single-column forms.
- Clear page title and brief instruction.
- Consistent field labels, validation messages, and password
  visibility controls.
- OTP screen with accessible segmented input, paste support, resend
  timer, and change-email path where supported.
- Avoid decorative elements that reduce form readability on mobile.

### Dashboards

- Desktop: sidebar plus main content area.
- Mobile: collapsible navigation/drawer and compact header.
- Page title and contextual primary action at the top.
- Summary cards for high-value metrics.
- Tables on desktop; responsive card/list presentation on narrow
  screens when appropriate.
- Filters and pagination should remain usable on mobile.

## 6. Feature-specific UI guidance

### Doctor discovery

- Show doctor name, approved profile image, specialization, relevant
  expertise, and consultation fee only when returned by the API.
- Filters should reflect available backend fields.
- Clearly distinguish unavailable or unapproved profiles; do not
  expose private application data.

### Schedule and slot selection

- Show date, time range, doctor, and availability clearly.
- Represent 20-minute slots with distinct
  available/unavailable/selected states.
- Do not allow selection of unavailable slots.
- Show that only today's schedules before their start time are
  bookable.
- Explain empty states when no schedule or slot is available.

### Appointment lifecycle

Use text labels with visual status indicators: - `BOOKED` - `ONGOING` -
`COMPLETED` - `CANCELLED` if supported by backend

Do not invent additional backend states. Make meeting link access
obvious only to authorized appointment participants.

### Payments and refunds

- Clearly distinguish pending, successful, failed, and refunded states
  only where supported by the backend.
- Show amount, currency, date, payment reference, and related
  appointment when available.
- Explain refund eligibility in plain language, but use the backend's
  result as authoritative.
- Never claim payment success based only on a browser redirect.

### Prescriptions

- Present findings and medicine details in a readable, print-friendly
  layout.
- Provide PDF preview/download only when the backend exposes a valid
  document.
- Keep patient medical information private and avoid unnecessary
  display in dashboard summaries.

### Admin management

- Use data tables with search, filters, pagination, and clear action
  confirmation.
- Show doctor verification state and account status.
- Destructive or access-changing actions require confirmation and
  clear success/failure feedback.
- Hide actions the current role is not permitted to perform.

## 7. Reusable components

Build or reuse: - `AppHeader`, `PublicHeader`, `DashboardSidebar`,
`MobileNav`, `AppFooter` - `PageHeader`, `SectionHeading`, `StatCard` -
`DataTable`, `Pagination`, `SearchInput`, `FilterBar` - `StatusBadge`,
`EmptyState`, `ErrorState`, `LoadingSkeleton` - `ConfirmDialog`,
`FormField`, `PasswordInput`, `OtpInput` - `DoctorCard`, `ScheduleCard`,
`TimeSlotButton` - `AppointmentCard`, `PaymentStatus`,
`PrescriptionViewer` - `FileUpload` only after upload constraints/API
are confirmed

## 8. Interaction and feedback

- Provide immediate pending feedback after user actions.
- Disable submit buttons during in-flight requests.
- Use toast notifications for concise mutation outcomes, with inline
  messages for important form errors.
- Confirm cancellation, account blocking, rejection, and other
  consequential actions.
- Preserve form input after recoverable errors.
- Avoid optimistic UI for payments, refunds, and bookings unless
  rollback is reliable.

## 9. Responsive behavior

- Mobile: one-column layouts, drawer navigation, full-width primary
  actions, touch-friendly controls.
- Tablet: compact sidebar or drawer and two-column cards where
  appropriate.
- Desktop: persistent dashboard sidebar, wider tables, and
  multi-column dashboard summaries.
- Prevent horizontal overflow; tables should have a deliberate
  responsive treatment.

## 10. Accessibility checklist

- Semantic landmarks and heading hierarchy.
- Visible keyboard focus.
- Labels and descriptions for all inputs.
- Accessible names for icon-only buttons.
- Dialog focus management and escape behavior.
- Status conveyed by text/icon as well as color.
- Adequate contrast and reduced-motion support.
- Charts have text summaries or accessible data alternatives.

## 11. Content tone

Use concise, respectful, reassuring language. Avoid promises about
medical outcomes. Prefer clear actions such as "Book appointment",
"Publish schedule", "Start consultation", and "Download prescription".
Explain errors in plain language without exposing internal server
details.

## 12. Assets and branding

Use approved HealthNest/HelthNest logos, doctor images, and
illustrations when supplied. Do not invent partner logos, medical
certifications, testimonials, doctor ratings, or claims. Use neutral
placeholders only during development and replace them before production.
