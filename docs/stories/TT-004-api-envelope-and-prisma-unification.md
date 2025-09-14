Title: Standardize API Envelope and Unify Prisma Client
ID: TT-004
Status: Draft
Type: refactor
Owner: PO
Created: 2025-09-09

Summary
- Introduce a consistent API response envelope and centralize Prisma client usage to avoid duplication and inconsistent responses.

Context
- ADR-0002 defines an API envelope. `src/lib/db.ts` and `src/lib/prisma.ts` both exist leading to confusion; responses across routes are ad-hoc.

Requirements
- Add `src/lib/api.ts` with helpers: `ok<T>(data: T)`, `fail(code: string, message: string, details?: unknown)`, and `toNextResponse(result, init?)`.
- Refactor existing API routes under `src/app/api/*` to use the envelope and `toNextResponse`.
- Remove `src/lib/prisma.ts`; standardize imports to `import { prisma } from '@/lib/db'`.

Acceptance Criteria
- All API routes return `{ success, data?, error? }` with proper HTTP statuses.
- No imports of `@/lib/prisma` remain; `@/lib/db` is the single Prisma source.
- Login and trips endpoints continue to function with the new envelope.

Tasks / Subtasks
1) Implement `lib/api.ts` helpers with type safety.
2) Update `src/app/api/auth/*` and `src/app/api/trips/route.ts` to use the envelope.
3) Remove `src/lib/prisma.ts` and fix imports.
4) Add unit tests for `lib/api.ts` (see TT-002).

Dependencies
- Works well alongside TT-001. Precedes TT-003 to ensure new endpoints follow the standard.

Risks
- Behavior drift if status codes change; preserve current semantics while wrapping responses.

Out of Scope
- Creating new endpoints beyond existing ones (handled in TT-003).

