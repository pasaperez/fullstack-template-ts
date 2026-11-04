# Architecture

Read this before changing module layers, boundaries, composition, routes, packaging or when adding a feature.

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

## Architectural enforcement

- `bun run format` uses `dprint`.
- `bun run lint` runs ESLint plus `dependency-cruiser`.
- `eslint-plugin-boundaries` and `dependency-cruiser` are part of the architectural contract for this repository.
- `bun run build` runs `next build` and `tsc -p tsconfig.check.json --noEmit`.
- If a boundary or dependency rule changes, update the enforcement config and this file in the same change.

## Adding a feature

1. Add a new module under `src/modules/<feature>`.
2. Put business types and rules in `domain`.
3. Add use cases in `application`.
4. Implement adapters in `infrastructure`.
5. Wire the module in `config`.
6. Add pages, components, hooks, and form schemas in `presentation`.
7. Add server page-prop builders or server actions under `src/composition/server/<feature>` when needed.
8. Mount the route from `src/app`.

## Environment

- The default setup requires no environment variables.
- If environment variables are added later, update `.env.example`, `README.md`, and any validation code in the same change.

## Container packaging

- Prefer multi-stage Docker images that use Bun for dependency installation and build steps.
- Use Next.js `standalone` output for production packaging so runtime images stay minimal.
- Default runtime container is Node.js 20 Alpine because the standalone server entrypoint is Node-based.
- Production containers should bind `HOSTNAME=0.0.0.0` and expose port `3000` unless the deployment platform injects them.
