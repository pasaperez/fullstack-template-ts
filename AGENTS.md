# AGENTS.md

Entry point for AI agents working in this repository. It is deliberately short: load only the document that matches the work you are about to do (table below) instead of reading everything.

## Purpose

Self-contained Next.js fullstack template with strict TypeScript, App Router, manual composition, explicit module boundaries, server-rendered page loading, server actions, and an in-memory `users` feature.

## Stack and commands

Next.js App Router · React · TypeScript (strict) · Bun · Node.js 20+ · Zod · React Hook Form · Radix Colors · Docker · Vitest · React Testing Library · ESLint · dependency-cruiser · eslint-plugin-boundaries · dprint.

- `bun install` · `bun run dev` · `bun run build` · `bun run start`
- `bun run lint` (ESLint + dependency-cruiser + `scripts/dead-code.mjs`) · `bun run test` · `bun run test:coverage`
- `bun run format` · `bun run format:write`
- Without Bun: the same scripts through `npm run <script>`.
- Container: `docker build -t fullstack-template-ts .` and `docker run --rm -p 3000:3000 fullstack-template-ts`.
- No environment variables are required; `.env.example` only documents that default.

After code changes run `bun run build` and `bun run lint`; when behaviour changes also `bun run test` (coverage is enforced at 100%).

## Rules that always apply

- **No dead code.** Delete what stops being used in the same change: functions, exports, files, props, CSS, tokens, env vars, dependencies, docs. No commented-out code, no TODOs, nothing kept "just in case" or only for tests. `bun run lint` fails on it. Details: [docs/conventions.md](docs/conventions.md#no-dead-code).
- Keep `src/` as `app`, `composition`, `modules`, `shared`; modules are layered `domain` / `application` / `infrastructure` / `presentation` / `config`, never import each other, and `shared` never imports `app`, `composition` or modules. Routes stay thin.
- Validate Server Action input with Zod at the edge; business rules live in use cases, not in routes or JSX.
- `useEffect` only for real browser synchronisation.
- Formatting is `dprint` (same config across this template family and the rest of the projects): single quotes, no trailing commas, 140 columns, one import per line, LF line endings. Never Prettier.
- Test-only helpers, resets and fixtures stay out of `src/**`.

## Load context on demand

| If you are touching…                                                                                | Read                                         |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Module layers, boundaries, runtime and composition, adding a feature, environment, Docker packaging | [docs/architecture.md](docs/architecture.md) |
| Server actions, data flow, UI, UX, accessibility, SEO                                               | [docs/data-and-ui.md](docs/data-and-ui.md)   |
| Tests, code conventions, formatting, the dead-code rule                                             | [docs/conventions.md](docs/conventions.md)   |
| What the template is for and how a human uses it                                                    | [README.md](README.md)                       |

## Documentation upkeep

- `README.md` is for human developers; `AGENTS.md` is the short agent entry point; `docs/*.md` hold the detail loaded on demand.
- When commands, route surface, runtime model, module boundaries, metadata, accessibility behaviour, environment variables or conventions change, update this file, `README.md` and the matching `docs/` file in the same change.
- Keep this file short: detail belongs in `docs/`, and a document nobody links from here is deleted.
