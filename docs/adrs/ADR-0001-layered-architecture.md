Title: Adopt Layered Architecture (Transport → Services → Repositories)
Status: Accepted
Date: 2025-09-09

Context:
- The codebase mixes HTTP concerns, business logic, and Prisma calls (e.g., logic in `src/lib/trips.ts` and route handlers).
- We need clearer separation of concerns to improve testability and maintainability.

Decision:
- Introduce layers:
  - Transport: `src/app/api/**` (route handlers only)
  - Services: `src/server/services/**` (business rules)
  - Repositories: `src/server/repositories/**` (Prisma data access only)
- Shared contracts in `src/server/contracts/**`; cross-cutting in `src/server/{errors,config,logging}`.

Alternatives:
- Keep as-is (flat lib + handlers): simpler now, but harder to scale/test.
- Microservices: premature for MVP; adds deployment complexity.

Consequences:
- Short-term refactor overhead; long-term gains in testing and change isolation.
- Enables future extraction if scale demands it.

References:
- docs/architecture.md#component-architecture

