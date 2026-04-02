# AGENTS.md

Short operational guide for AI agents working in this repository.

## Purpose

Self-contained Next.js fullstack template with strict TypeScript, App Router, manual composition, explicit module boundaries, server-rendered page loading, server actions, and an in-memory `users` feature.

## Stack and commands

- Next.js App Router
- React
- TypeScript (strict)
- Bun
- Node.js 20+
- Zod
- React Hook Form
- Radix Colors
- Vitest
- React Testing Library
- ESLint
- dependency-cruiser
- eslint-plugin-boundaries
- dprint

Preferred commands:

- `bun install`
- `bun run dev`
- `bun run build`
- `bun run start`
- `bun run lint`
- `bun run test`
- `bun run test:coverage`
- `bun run format`
- `bun run format:write`

Fallback commands when Bun is unavailable:

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run test`
- `npm run test:coverage`
- `npm run format`
- `npm run format:write`

Default setup:

- No environment variables are required.
- `.env.example` only documents that default state.
- Bun is the primary package manager and local runtime for this repository. Keep npm commands as fallback only.

## Top-level structure

Keep this top-level structure inside `src/`:

- `app`
- `composition`
- `modules`
- `shared`

## Architecture rules

Feature modules live in `src/modules/<feature>` and use:

- `domain`
- `application`
- `infrastructure`
- `presentation`
- `config`

General intent of each area:

- `app`: Next.js runtime surface only. Routes, metadata, layout, loading/error/not-found files, providers, theme, and app shell.
- `composition`: thin bridge between runtime concerns and modules. Server page-prop builders, server actions, navigation metadata, and orchestration.
- `domain`: pure business types and rules. No Next.js, React, browser APIs, form libraries, or storage details.
- `application`: use cases and orchestration. Depends on domain contracts, not on presentation code or concrete adapters.
- `infrastructure`: concrete adapters such as repositories, storage, mappers, and external integrations.
- `presentation`: UI-facing contracts, pages, components, hooks, and form schemas.
- `config`: module-local composition root. Wire use cases from concrete dependencies here.
- `shared`: generic helpers and reusable primitives with no feature ownership.

Hard dependency rules:

- `domain` must not depend on `app`, `composition`, `presentation`, or `infrastructure`.
- Define feature ports in `domain` when application code needs replaceable dependencies.
- `application` must not depend on `presentation` or concrete infrastructure implementations.
- `presentation` may depend on `application`, `domain`, and shared UI-safe helpers, but must not own persistence details.
- `shared` must not depend on `app`, `composition`, or feature modules.
- Avoid direct imports across different modules.
- Keep `app` routes thin and consume composition or module presentation entry points.
- Do not place database or storage details directly in `app` or `presentation`.

This repository already uses linting and dependency rules to protect boundaries.
If architecture rules change, update the enforcement config and this file together.

## Runtime and composition

- `src/app/page.tsx` redirects `/` to `/users`.
- `src/app/users/page.tsx` should stay a thin route entry that consumes server-composed props.
- `src/app/layout.tsx` and `src/app/AppShell.tsx` own the global shell.
- `src/composition/server/users/createUsersPageProps.ts` prepares initial server-rendered props.
- `src/composition/server/users/usersActions.ts` exposes validated server actions.
- `src/modules/users/config/createUsersModule.ts` wires the repository to the use cases.

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

## Architectural enforcement

- `bun run format` uses `dprint`.
- `bun run lint` runs ESLint plus `dependency-cruiser`.
- `eslint-plugin-boundaries` and `dependency-cruiser` are part of the architectural contract for this repository.
- `bun run build` runs `next build` and `tsc -p tsconfig.check.json --noEmit`.
- If a boundary or dependency rule changes, update the enforcement config and this file in the same change.

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

## Adding a feature

1. Add a new module under `src/modules/<feature>`.
2. Put business types and rules in `domain`.
3. Add use cases in `application`.
4. Implement adapters in `infrastructure`.
5. Wire the module in `config`.
6. Add pages, components, hooks, and form schemas in `presentation`.
7. Add server page-prop builders or server actions under `src/composition/server/<feature>` when needed.
8. Mount the route from `src/app`.

## Testing and validation

Recommended split:

- `tests/unit`
- `tests/integration`
- `tests/ui`
- `tests/setup`

After code changes, run at least:

- `bun run build`
- `bun run lint`

If behavior changes, also run:

- `bun run test`

If coverage is affected, keep:

- `bun run test:coverage`

Coverage is enforced at `100%` for the included source files.
Coverage exclusions must stay narrow and only target pure type-only contracts when that is the intentional repository policy.
- Keep test-only resets, fixtures, mocks, and similar helpers out of `src/**`. Put that support in `tests/**` or test setup unless it is a real runtime dependency boundary.

## Code conventions

- In `src/**`, keep explicit types where they improve clarity and preserve strict typing.
- Prefer small, readable files with obvious ownership.
- One import per line.
- Avoid unnecessary multiline imports.
- Add comments only when they provide context the code does not already communicate.
- Do not invent abstractions unless they isolate real volatility or remove real duplication.
- Formatting is handled by `dprint`, not Prettier.
- Keep `dprint` conventions aligned with the repository config: single-line imports when possible, single quotes, no trailing commas, and 140-column formatting.
- Avoid memory leaks and process leaks. Clean up listeners, subscriptions, timers, observers, sockets, workers, and similar resources, and do not introduce unbounded process-global stores or caches unless they are deliberate runtime boundaries.

## Environment

- The default setup requires no environment variables.
- If environment variables are added later, update `.env.example`, `README.md`, and any validation code in the same change.

## Documentation upkeep

- `README.md` is for human developers.
- `AGENTS.md` is for AI operational context.
- Whenever commands, route surface, runtime model, module boundaries, metadata, accessibility behavior, environment variables, or coding conventions change, update both files in the same change.
- Keep this file repository-specific, practical, and strict enough to guide code generation well.
