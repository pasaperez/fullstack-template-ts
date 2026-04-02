# Fullstack Template in TypeScript

<details open>
<summary>English</summary>

Production-oriented fullstack template built with Next.js App Router, strict TypeScript, Bun, and explicit module boundaries.
The current template ships one complete `users` flow running entirely inside the repository through server-rendered page loading, server actions, and an in-memory repository.

## What is included

- Next.js App Router as the integrated fullstack runtime
- Root route `/` redirecting to `/users`
- Feature module structure with `domain`, `application`, `infrastructure`, `presentation`, and `config`
- Domain-level ports so infrastructure stays replaceable
- Server composition split between `src/composition/server` and `src/composition/client`
- In-memory CRUD with an empty initial store and validated server actions
- Responsive app shell with sidebar navigation, theme selector, and shared UI primitives
- Route-level metadata, accessible status pages, skip link, and reduced-motion-friendly interactions
- Bun-first local workflow with npm fallback only when Bun is unavailable
- Radix Colors theme foundation
- React Hook Form and Zod for forms and validation
- ESLint, `eslint-plugin-boundaries`, dependency-cruiser, Vitest, React Testing Library, and dprint
- Type-checked production build plus architectural dependency enforcement
- Coverage thresholds fixed at `100%` on the included source files

## Stack

- Bun
- Node.js 20+
- Next.js App Router
- React 19
- Strict TypeScript
- Zod
- React Hook Form
- Radix Colors
- Vitest
- React Testing Library
- ESLint
- dependency-cruiser
- eslint-plugin-boundaries
- dprint

## Structure

```text
src/
  app/
    users/
    providers/
    theme/
    AppShell.tsx
  composition/
    client/
    server/
      users/
  modules/
    users/
      domain/
        errors/
        ports/
      application/
        use-cases/
      infrastructure/
        in-memory/
      presentation/
        components/
        forms/
        hooks/
        pages/
      config/
  shared/
    domain/
    ui/
tests/
  unit/
  integration/
  ui/
  setup/
```

## Layers

### App

This is the global Next.js runtime surface. It owns route files, metadata, loading/error/not-found boundaries, layout, providers, theme setup, and the app shell.
In the template:

- `src/app/page.tsx` redirects `/` to `/users`
- `src/app/users/page.tsx` builds the route from server-composed props
- `src/app/layout.tsx`, `AppShell.tsx`, `providers/`, and `theme/` own the global UI wiring

### Composition

This layer bridges Next.js runtime concerns with module code. Keep it thin and orchestration-only.
In the template:

- `src/composition/server/users/createUsersPageProps.ts` prepares initial server-rendered props
- `src/composition/server/users/usersActions.ts` exposes validated server actions
- `src/composition/client/navigation.ts` centralizes app navigation metadata

### Module Domain

This is where pure business types and rules live. It must not depend on Next.js, React, server actions, forms, or storage details.
In the example:

- `User` defines the entity and write contracts
- `UserNotFoundError` models an explicit domain failure
- `UserRepository` defines the persistence port consumed by the use cases

### Module Application

This layer coordinates use cases against domain contracts.
In the example:

- `ListUsers`
- `GetUserById`
- `CreateUser`
- `UpdateUser`
- `DeleteUser`

### Module Infrastructure

This layer implements concrete adapters and storage details.
In the template:

- `InMemoryUserRepository`
- empty `inMemoryUsersStore`

### Module Presentation

This layer contains UI-facing contracts, pages, components, hooks, and form schemas.
In the template:

- `UsersPage` is the page-level presentational entry point
- `UsersClient` drives the interactive users flow
- `UsersView` renders the visible surface
- `useUsersPage` coordinates local UI behavior
- `UserFormSchema` validates form input

### Module Config

This is the module-local composition root.
In the template:

- `createUsersModule.ts` wires a concrete `UserRepository` implementation to the use cases

### Shared

This area contains generic helpers and reusable UI primitives with no feature ownership.
In the template:

- `getErrorMessage` normalizes unknown errors
- `Button` and `TextField` are reusable UI building blocks

## How to run it

```bash
bun install
bun run dev
```

Bun is the primary package manager and local runtime for this repository.

Available scripts:

- `bun run dev`
- `bun run build`
- `bun run start`
- `bun run test`
- `bun run test:coverage`
- `bun run lint`
- `bun run format`
- `bun run format:write`

Fallback scripts when Bun is unavailable:

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run test`
- `npm run test:coverage`
- `npm run lint`
- `npm run format`
- `npm run format:write`

## Route surface

```text
/         -> redirects to /users
/users    -> users CRUD page
```

Initial page data is loaded on the server, and create/update/delete flows go through Next.js server actions inside the same repository.

## Environment

`.env.example` exists only to document that the default setup requires no environment variables.

## State and effects

- initial page reads happen through server composition helpers
- create, update, and delete flows go through validated server actions
- form state belongs to React Hook Form
- short-lived interactive UI state stays in client hooks and components
- `useEffect` is reserved for real browser synchronization such as listeners or imperative APIs, not routine data loading

## SEO, accessibility, and UI quality

- layout-level and route-level metadata are part of the repository contract
- every screen keeps a clear primary heading and descriptive copy
- semantic HTML comes first, with ARIA used to enhance structure rather than replace it
- desktop and mobile layouts are both considered part of the default contract
- the app shell includes a skip link, visible focus states, keyboard-usable navigation, and theme controls
- loading, empty, error, and destructive states are explicit in the users flow
- user-facing runtime errors stay generic instead of leaking low-level technical details into the visible UI
- theme and motion behavior respect reusable tokens and reduced-motion expectations
- shared and app-level styles should not accumulate orphan selectors

## Quality gates and enforcement

- `bun run format` uses `dprint`
- `bun run lint` runs ESLint plus `dependency-cruiser`
- `eslint-plugin-boundaries` and `dependency-cruiser` protect the documented layer rules
- `bun run build` runs `next build` and `tsc -p tsconfig.check.json --noEmit`
- architectural or command changes should update the enforcement config and documentation together

## Testing and coverage

The repository uses:

- `tests/unit` for domain, use cases, composition helpers, and repository behavior
- `tests/integration` for module and server-action flows
- `tests/ui` for component and hook behavior
- `tests/setup` for shared test setup

Coverage is treated as a contract.
`bun run test:coverage` enforces `100%` statements, branches, functions, and lines on the included source files.
Coverage exclusions should stay narrow and limited to pure type-only contracts when strictly necessary.
Test-only resets, fixtures, mocks, and similar helpers should live under `tests/**` or shared test setup, not under `src/**`.

## How to extend the template

1. Create a new module under `src/modules/<feature>`.
2. Put business types and rules in `domain`.
3. Add use cases in `application`.
4. Implement concrete adapters in `infrastructure`.
5. Wire the module in `config`.
6. Add pages, components, hooks, and form schemas in `presentation`.
7. Add server-side page-prop builders or server actions under `src/composition/server/<feature>` when needed.
8. Mount the route from `src/app`.

## What to replace in a real project

- `InMemoryUserRepository` with a database or external service adapter
- `inMemoryUsersStore` with real persistence
- the `UserRepository` port stable while swapping infrastructure behind it
- The `users` module with your real bounded contexts or product features
- The default metadata, copy, and navigation labels with your product language
- The initial server composition with the runtime boundaries your app actually needs

## Design decisions

- Next.js runtime concerns stay in `src/app`
- Module boundaries are explicit so feature growth stays readable
- Composition is manual to keep replacement points obvious
- Domain ports keep infrastructure replaceable without leaking concrete adapters into use cases
- Server actions validate input at the edge before calling use cases
- In-memory persistence keeps the template runnable with zero external services
- The route surface starts intentionally small so the example stays focused
- Runtime code should clean up listeners, subscriptions, timers, and similar resources, and should avoid unbounded process-global caches or stores unless that boundary is intentional

</details>

<details>
<summary>Español</summary>

Template fullstack orientado a producción con Next.js App Router, TypeScript estricto, Bun y límites modulares explícitos.
La versión actual trae un flujo completo de `users` que corre íntegramente dentro del repositorio mediante carga server-side, server actions y un repositorio in-memory.

## Qué incluye

- Next.js App Router como runtime fullstack integrado
- Ruta raíz `/` redirigiendo a `/users`
- Estructura modular por feature con `domain`, `application`, `infrastructure`, `presentation` y `config`
- Puertos a nivel dominio para que infraestructura siga siendo reemplazable
- Composición de servidor y cliente separada entre `src/composition/server` y `src/composition/client`
- CRUD in-memory con store inicial vacio y server actions validadas
- App shell responsive con navegación lateral, selector de tema y primitivas UI compartidas
- Metadata por layout y por ruta, páginas de estado accesibles, skip link e interacciones compatibles con reduced motion
- Flujo local Bun-first con fallback a npm solo cuando Bun no está disponible
- Base visual con Radix Colors
- React Hook Form y Zod para formularios y validación
- ESLint, `eslint-plugin-boundaries`, dependency-cruiser, Vitest, React Testing Library y dprint
- Build de producción con chequeo de tipos y enforcement arquitectónico de dependencias
- Thresholds de cobertura fijados en `100%` sobre los archivos fuente incluidos

## Stack

- Bun
- Node.js 20+
- Next.js App Router
- React 19
- TypeScript estricto
- Zod
- React Hook Form
- Radix Colors
- Vitest
- React Testing Library
- ESLint
- dependency-cruiser
- eslint-plugin-boundaries
- dprint

## Estructura

```text
src/
  app/
    users/
    providers/
    theme/
    AppShell.tsx
  composition/
    client/
    server/
      users/
  modules/
    users/
      domain/
        errors/
        ports/
      application/
        use-cases/
      infrastructure/
        in-memory/
      presentation/
        components/
        forms/
        hooks/
        pages/
      config/
  shared/
    domain/
    ui/
tests/
  unit/
  integration/
  ui/
  setup/
```

## Capas

### App

Es la superficie global del runtime de Next.js. Acá viven archivos de rutas, metadata, boundaries de loading/error/not-found, layout, providers, theming y el app shell.
En el template:

- `src/app/page.tsx` redirige `/` hacia `/users`
- `src/app/users/page.tsx` arma la ruta a partir de props compuestas en servidor
- `src/app/layout.tsx`, `AppShell.tsx`, `providers/` y `theme/` son dueños del wiring global de UI

### Composition

Esta capa conecta las preocupaciones del runtime de Next.js con el código modular. Debe mantenerse fina y orientada a orquestación.
En el template:

- `src/composition/server/users/createUsersPageProps.ts` prepara las props iniciales renderizadas en servidor
- `src/composition/server/users/usersActions.ts` expone server actions validadas
- `src/composition/client/navigation.ts` centraliza la metadata de navegación

### Module Domain

Acá viven los tipos y reglas de negocio puras. No debe depender de Next.js, React, server actions, formularios ni detalles de storage.
En el ejemplo:

- `User` define la entidad y los contratos de escritura
- `UserNotFoundError` modela una falla de dominio explícita
- `UserRepository` define el puerto de persistencia que consumen los casos de uso

### Module Application

Coordina casos de uso contra contratos del dominio.
En el ejemplo:

- `ListUsers`
- `GetUserById`
- `CreateUser`
- `UpdateUser`
- `DeleteUser`

### Module Infrastructure

Implementa adapters concretos y detalles de persistencia.
En el template:

- `InMemoryUserRepository`
- `inMemoryUsersStore` con datos iniciales

### Module Presentation

Contiene contratos orientados a UI, páginas, componentes, hooks y schemas de formularios.
En el template:

- `UsersPage` es la entrada presentacional a nivel página
- `UsersClient` resuelve el flujo interactivo de usuarios
- `UsersView` renderiza la superficie visible
- `useUsersPage` coordina el comportamiento local de UI
- `UserFormSchema` valida la entrada del formulario

### Module Config

Es la raíz de composición local del módulo.
En el template:

- `createUsersModule.ts` conecta una implementación concreta de `UserRepository` con los casos de uso

### Shared

Acá van helpers genéricos y primitivas UI reutilizables sin dueño de negocio.
En el template:

- `getErrorMessage` normaliza errores desconocidos
- `Button` y `TextField` son bloques UI reutilizables

## Cómo correrlo

```bash
bun install
bun run dev
```

Bun es el package manager y runtime local principal de este repositorio.

Scripts disponibles:

- `bun run dev`
- `bun run build`
- `bun run start`
- `bun run test`
- `bun run test:coverage`
- `bun run lint`
- `bun run format`
- `bun run format:write`

Scripts de fallback cuando Bun no está disponible:

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run test`
- `npm run test:coverage`
- `npm run lint`
- `npm run format`
- `npm run format:write`

## Superficie de rutas

```text
/         -> redirige a /users
/users    -> página CRUD de usuarios
```

La carga inicial de la página ocurre en servidor, y los flujos de crear/editar/eliminar pasan por server actions de Next.js dentro del mismo repositorio.

## Entorno

`.env.example` existe solo para documentar que la configuración por defecto no requiere variables de entorno.

## Estado y efectos

- las lecturas iniciales de página ocurren mediante helpers de composición server-side
- los flujos de crear, editar y eliminar pasan por server actions validadas
- el estado del formulario pertenece a React Hook Form
- el estado interactivo de corta duración queda en hooks y componentes cliente
- `useEffect` queda reservado para sincronización real con el navegador, como listeners o APIs imperativas, no para carga rutinaria de datos

## SEO, accesibilidad y calidad de UI

- la metadata a nivel layout y ruta forma parte del contrato del repositorio
- cada pantalla mantiene un heading principal claro y copy descriptivo
- primero va el HTML semántico, y ARIA se usa para reforzar estructura, no para reemplazarla
- desktop y mobile forman parte del contrato por defecto del template
- el app shell incluye skip link, focus visible, navegación usable por teclado y controles de tema accesibles
- los estados de loading, empty, error y acciones destructivas están explícitos en el flujo de usuarios
- los errores runtime visibles para el usuario se mantienen genéricos en vez de exponer detalles técnicos de bajo nivel
- el sistema de temas y movimiento respeta tokens reutilizables y reduced motion
- los estilos compartidos y de app no deben acumular selectores huérfanos

## Quality gates y enforcement

- `bun run format` usa `dprint`
- `bun run lint` ejecuta ESLint más `dependency-cruiser`
- `eslint-plugin-boundaries` y `dependency-cruiser` protegen las reglas de capas documentadas
- `bun run build` ejecuta `next build` y `tsc -p tsconfig.check.json --noEmit`
- si cambian reglas arquitectónicas o comandos, deben actualizarse juntos los configs de enforcement y la documentación

## Testing y cobertura

El repositorio usa:

- `tests/unit` para dominio, casos de uso, helpers de composición y comportamiento del repositorio
- `tests/integration` para flujos del módulo y server actions
- `tests/ui` para comportamiento de componentes y hooks
- `tests/setup` para setup compartido de pruebas

La cobertura está tratada como contrato.
`bun run test:coverage` exige `100%` de statements, branches, functions y lines sobre los archivos fuente incluidos.
Las exclusiones de cobertura deben ser mínimas y limitarse a contratos puramente tipados cuando sea estrictamente necesario.
Los resets, fixtures, mocks y helpers equivalentes exclusivos de testing deben vivir en `tests/**` o en el setup de pruebas, no en `src/**`.

## Cómo extender el template

1. Crear un nuevo módulo en `src/modules/<feature>`.
2. Poner tipos y reglas de negocio en `domain`.
3. Agregar casos de uso en `application`.
4. Implementar adapters concretos en `infrastructure`.
5. Conectar el módulo en `config`.
6. Agregar páginas, componentes, hooks y schemas de formularios en `presentation`.
7. Agregar builders de props server-side o server actions en `src/composition/server/<feature>` cuando haga falta.
8. Montar la ruta desde `src/app`.

## Qué reemplazar en un proyecto real

- `InMemoryUserRepository` por un adapter de base de datos o servicio externo
- `inMemoryUsersStore` por persistencia real
- mantener estable el puerto `UserRepository` mientras cambia la infraestructura detrás
- El módulo `users` por tus bounded contexts o features reales
- La metadata, el copy y las etiquetas de navegación por el lenguaje de tu producto
- La composición server-side inicial por los límites runtime que realmente necesite tu app

## Decisiones de diseño

- Las preocupaciones del runtime de Next.js quedan en `src/app`
- Los límites modulares son explícitos para que el crecimiento por feature siga siendo legible
- La composición es manual para que los puntos de reemplazo sean obvios
- Los puertos de dominio mantienen reemplazable la infraestructura sin filtrar adapters concretos hacia los casos de uso
- Las server actions validan la entrada en el borde antes de llamar casos de uso
- La persistencia in-memory permite correr el template sin servicios externos
- La superficie de rutas arranca deliberadamente chica para mantener el ejemplo enfocado
- El código de runtime debe limpiar listeners, suscripciones, timers y recursos equivalentes, y debe evitar caches o stores globales sin cota salvo que ese límite sea intencional

</details>
