# Coding Standards and Conventions

- TypeScript: strict mode; explicit return types for exported functions; avoid `any` (prefer `unknown` + narrowing).
- Boundaries: `app/api` (transport) → `server/services` (business rules) → `server/repositories` (Prisma). Do not cross boundaries.
- Validation: Zod schemas at HTTP boundary and in `contracts/*`; reuse across services where feasible.
- API Envelope: `{ success, data?, error? }` with standard error codes and appropriate HTTP statuses.
- Error Handling: Services return typed errors/Results; route handlers map to HTTP with `lib/api.ts`.
- Dates/Time: Use UTC for all server calculations and DB; helpers in `lib/time.ts`.
- Styling/UI: Tailwind utility classes grouped logically; shadcn/ui patterns; maintain a11y (focus-visible, roles, labels).
- Imports: Use `@/*` alias; avoid brittle deep relative imports.
- Naming: files `kebab-case`, types `PascalCase`, functions/variables `camelCase`; enums `PascalCase` with `PascalCase` members.
- Linting: ESLint errors at zero; only local disables with justification.
- Commits: Conventional Commits.
