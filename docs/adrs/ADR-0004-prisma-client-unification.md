Title: Unify Prisma Client Usage
Status: Accepted
Date: 2025-09-09

Context:
- Both `src/lib/db.ts` and `src/lib/prisma.ts` create clients; duplication risks multiple instances and confusion.

Decision:
- Keep `src/lib/db.ts` as the single Prisma client source (`export const prisma`).
- Remove `src/lib/prisma.ts`; update imports to `@/lib/db`.

Alternatives:
- Keep both: no benefit; higher risk.

Consequences:
- Simple refactor; clearer ownership of DB connection lifecycle.

References:
- docs/architecture.md#remediation-tasks-developer-actionable

