# Remediation Tasks (Developer‑Actionable)
These items address specific risks found in the current codebase. Implement incrementally; each task is safe and self‑contained.

1) Unify Prisma Client
- Keep `src/lib/db.ts` as the single Prisma client factory. Deprecate and remove `src/lib/prisma.ts`.
- Update imports to `import { prisma } from '@/lib/db'` everywhere.
- Rationale: Avoid multiple client instances and import confusion that can cause connection churn.

2) Consolidate Status Mapping
- Create `src/lib/status.ts` exporting `toDisplayStatus(db: TripStatus) => UIStatus` and `fromDisplayStatus(ui: UIStatus) => TripStatus`.
- Replace ad‑hoc mappings in `src/lib/trips.ts` (and elsewhere) with these functions.
- Rationale: Prevent drift between DB enum (`Planning | Ready_to_Go | In_Progress | Completed`) and UI labels.

3) Standardize API Responses
- Add `src/lib/api.ts` with helpers: `ok<T>(data: T)`, `fail(code: string, message: string, details?: unknown)` and a `toNextResponse(result)` wrapper for route handlers.
- Refactor existing routes under `src/app/api/**` to return a consistent envelope: `{ success, data?, error? }` with proper HTTP status.
- Rationale: Consistent error handling simplifies clients and testing.

4) Auth Guard Posture
- Keep middleware cookie‑presence redirect (Edge cannot verify HMAC JWT safely with `jsonwebtoken`).
- Enforce real auth in all API route handlers using `getCurrentUser()` as the source of truth.
- Optional: Add a server‑side guard in protected layouts/pages to fetch the current user and redirect if absent.
- Rationale: Balanced UX without fragile Edge verification.

5) Remove Stray Source File
- Delete accidental path: `src/components/Users/brii/Desktop/code/travel-tab/src/components/icons/index.tsx`.
- Rationale: Prevent tooling confusion and noisy imports.

6) Validate Required Environment
- Document and validate `DATABASE_URL` and `JWT_SECRET` at startup via a tiny `src/server/config/env.ts` that throws descriptive errors in development and logs clearly in production.
- Rationale: Fail fast with actionable messages for common misconfigurations.

7) Testing Baseline
- Add Vitest + React Testing Library and scripts: `test`, `test:watch`, `test:coverage`.
- High‑value tests to add first:
  - Status mapping util (`src/lib/status.ts`).
  - API response helper (`src/lib/api.ts`).
  - Trips repository/service happy paths and validation failures.
- Rationale: Establish a minimal quality gate before deeper refactors.

8) Folder Structure For Separation of Concerns
- Introduce internal layers without changing deployment model:
  - `src/server/repositories/*` – Prisma calls only.
  - `src/server/services/*` – business logic, orchestration, validation.
  - `src/server/contracts/*` – DTOs and Zod schemas shared at boundaries.
  - `src/server/errors/*`, `src/server/config/*`, `src/server/logging/*` – cross‑cutting concerns.
- Move logic from `src/lib/trips.ts` into `repositories/trips.repo.ts` and `services/trips.service.ts` (keep `src/lib` for UI‑only helpers).
- Rationale: Clear testable seams and future‑proofing for scale.

9) Logging And Observability (Lightweight)
- Add a tiny logger (`src/server/logging/logger.ts`) with levelled logs and safe redaction of sensitive fields.
- Use in API handlers and services for error reporting and key events.

10) Documentation And ADRs
- After each substantive decision (e.g., JWT posture, response envelope), add a short ADR in `docs/adrs/ADR-XXXX-title.md`.
- Keep this architecture document as the living source; link ADRs where relevant.

Implementation Notes
- Make these changes in small PRs (tasks 1–5 first), running `npm run lint` after each.
- Avoid functional changes while moving code; refactor behavior‑preserving and rely on tests.
