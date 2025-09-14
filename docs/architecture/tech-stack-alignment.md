# Tech Stack Alignment

## Existing Technology Stack
- Runtime: Node.js LTS (prefer 20.x)
- Framework: Next.js 15 (App Router)
- Language: TypeScript ^5 (strict)
- Styling/UI: Tailwind CSS v4, shadcn/ui
- ORM/DB: Prisma ^6 with PostgreSQL
- Auth: jsonwebtoken + bcryptjs; httpOnly cookie sessions
- Validation: Zod
- Linting: ESLint ^9 with Next config
- Build: Turbopack

## New Technology Additions
- Testing: vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom
  - Purpose: Baseline unit/component tests and CI coverage
  - Integration: `vitest.config.ts`; scripts `test`, `test:watch`, `test:coverage`
- Env Validation: Zod‑based `server/config/env.ts`
  - Purpose: Fail fast on `DATABASE_URL`, `JWT_SECRET`
- Logging (lightweight): `server/logging/logger.ts` or consola
  - Purpose: Consistent, redactable logs for API/services

Rationale: Keep current stack to minimize churn; add only what materially improves reliability and testability.
