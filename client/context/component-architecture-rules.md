# Component Architecture & Separation Rules

You must follow a modular, component-based architecture throughout the HealthNest frontend project.

## 1. Component Separation

Never write the entire page UI inside a single `page.tsx` file.

Break down each page into small, reusable, and maintainable components.

For example, instead of implementing an entire dashboard inside:

`app/(patient)/dashboard/page.tsx`

Separate it into:

- DashboardHeader
- DashboardStats
- UpcomingAppointments
- RecentPrescriptions
- QuickActions

The page file should primarily compose these components.

## 2. Folder Structure

Follow this structure:

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (patient)/
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── (doctor)/
│   ├── (admin)/
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   ├── shared/
│   ├── layout/
│   └── common/
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── validations/
│   ├── doctors/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── appointments/
│   ├── schedules/
│   ├── payments/
│   └── prescriptions/
│
├── hooks/
├── lib/
├── providers/
├── stores/
├── types/
└── utils/
```

## 3. Component Responsibility

Each component must have one clear responsibility.

Examples:

- `DoctorCard.tsx` — Display one doctor's information.
- `DoctorList.tsx` — Render a list of doctors.
- `DoctorFilters.tsx` — Handle doctor filtering UI.
- `DoctorSearch.tsx` — Handle search input.
- `DoctorDetails.tsx` — Display doctor details.
- `DoctorProfileForm.tsx` — Handle doctor profile form.

Do not combine unrelated responsibilities into one component.

## 4. Page Component Rules

Keep `page.tsx` files clean and readable.

A page should:

1. Import required components.
2. Fetch or receive necessary data through the appropriate feature hooks.
3. Compose components.
4. Handle page-level loading, error, and empty states where appropriate.

Avoid placing large JSX blocks, API logic, validation schemas, or complex business logic directly inside page files.

## 5. Shared Components

If a component is used by multiple features, place it in an appropriate shared directory.

Examples:

`components/shared/`
- LoadingSpinner
- EmptyState
- ErrorMessage
- ConfirmDialog
- PageHeader
- SearchInput

`components/layout/`
- PatientSidebar
- DoctorSidebar
- AdminSidebar
- DashboardHeader
- MainNavbar
- Footer

Do not duplicate shared components across multiple features.

## 6. Feature-Specific Components

Components used only by one feature must remain inside that feature's `components/` directory.

For example:

```text
features/doctors/components/
├── DoctorCard.tsx
├── DoctorList.tsx
├── DoctorFilters.tsx
├── DoctorDetails.tsx
└── DoctorProfileForm.tsx
```

Do not move feature-specific components into the global shared directory without a genuine reuse requirement.

## 7. Component Size and Complexity

- Prefer small, focused components.
- Extract complex JSX into separate components.
- Extract repeated UI patterns into reusable components.
- Avoid deeply nested conditional rendering.
- Avoid unnecessary component abstraction.
- Do not create separate files for trivial one-line JSX elements unless reuse or readability justifies it.

Use custom hooks for reusable stateful logic and utility functions for pure helper logic.

## 8. Naming Conventions

- Use PascalCase for React component files and component names.
- Use camelCase for functions, variables, and hooks.
- Custom hooks must start with `use`.
- Use descriptive names based on component responsibilities.

Examples:

- `DoctorCard.tsx`
- `AppointmentTable.tsx`
- `useAppointments.ts`
- `appointment.service.ts`
- `appointment.validation.ts`

## 9. Styling Rules

- Use Tailwind CSS and existing shadcn/ui components.
- Keep styling close to the component it belongs to.
- Avoid duplicating long Tailwind class combinations.
- Extract repeated styles into reusable components or appropriate utilities.
- Maintain consistent spacing, typography, colors, and responsive behavior.

## 10. Before Completing Any Feature

Verify:

- Page components are not unnecessarily large.
- Reusable components are separated.
- Feature-specific components are inside their feature folders.
- Shared components are not duplicated.
- API calls are not scattered across UI components.
- Components have clear and focused responsibilities.
- TypeScript types are properly defined.
- Existing architecture and naming conventions are followed.

## Mandatory Rule

Before implementing any page or feature, first identify its UI sections and determine which should be separate components.

Implement the components in their appropriate folders, then compose them inside the page.

Do not sacrifice maintainability for fewer files, and do not create unnecessary abstractions just to increase the component count.