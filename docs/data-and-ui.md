# Data flow, UI, UX, accessibility and SEO

Read this before changing server actions, page loading, components, styles or metadata.

## Server actions and data flow

- Validate server action input with Zod at the edge.
- Call use cases from server actions; do not place business rules directly inside action files.
- Initial reads should happen through server composition helpers, not through ad hoc logic scattered across route files.
- Form state belongs to React Hook Form.
- Short-lived UI state belongs to client components.
- Treat `useEffect` as an escape hatch for real browser synchronization such as event listeners or imperative APIs.
- Do not use `useEffect` for routine data loading or for values that can be derived during render.
- Do not introduce a global client store by default.
- Keep domain and application rules out of JSX files and Next.js route files.

## SEO, accessibility, and UX

- Keep meaningful layout-level and route-level metadata in `src/app`.
- Every route should preserve one clear primary heading and descriptive copy.
- Prefer semantic HTML first and use ARIA to enhance semantics, not to replace missing structure.
- Keep desktop and mobile behavior intentional from the start.
- Keep skip links, keyboard navigation, visible focus states, and reduced-motion-safe interactions intact.
- Always account for loading, empty, error, success, disabled, and destructive states where the flow needs them.
- Do not leak low-level technical error details directly into the visible UI unless there is a deliberate reason.
- Keep important route meaning in real text content and maintain descriptive link labels.
- Remove orphan CSS selectors when UI elements disappear.

## UI rules

- Keep the main feature route at `/users` unless the route surface intentionally changes.
- Keep theme tokens and selector logic under `src/app/theme`.
- Shared reusable primitives belong in `src/shared/ui`.
- Feature-specific UI belongs in `src/modules/<feature>/presentation`.
- Preserve accessible headings, labels, keyboard flows, visible focus states, and state feedback.
- Delete orphan styles when removing UI.
