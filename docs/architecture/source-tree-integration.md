# Source Tree Integration

Goal: Introduce a layered structure while minimizing disruption. Keep UI paths stable; move domain logic behind services/repositories.

## Proposed Structure
```
src/
  app/
    api/                     # route handlers (transport)
    ...                      # pages/layouts/components stay as-is
  server/
    services/
      trips.service.ts
      borderbuddy.service.ts
      context.service.ts
      places.service.ts
      chat.service.ts
    repositories/
      trips.repo.ts
      borderbuddy.repo.ts
      context.repo.ts
      places.repo.ts
      chat.repo.ts
    contracts/
      trips.dto.ts
      borderbuddy.dto.ts
      context.dto.ts
      places.dto.ts
      chat.dto.ts
      providers.ts            # optional, for future external APIs
    errors/
      index.ts
    config/
      env.ts
    logging/
      logger.ts
  lib/
    api.ts                   # response helpers
    status.ts                # status mapping (DB <-> UI)
    time.ts                  # date helpers for due dates
    utils.ts                 # UI-safe helpers only
```

## Migration Plan (Incremental)
1) Create folders under `src/server/*` and add `env.ts`, `logger.ts`, empty repo/service files.
2) Move Trip logic out of `src/lib/trips.ts`:
   - Data access → `repositories/trips.repo.ts` (Prisma only)
   - Mapping/validation/business logic → `services/trips.service.ts`
   - Update `src/app/api/trips/route.ts` to call `trips.service` and to use `lib/api.ts` response helpers.
3) Add `src/lib/status.ts` and replace mapping functions in code with imports from this module.
4) Add `src/lib/api.ts` and refactor existing auth/trips routes to consistent envelopes.
5) Remove `src/lib/prisma.ts` and standardize imports to `@/lib/db`.
6) Introduce BorderBuddy entities (repo/service) alongside new routes; keep Trip flows unchanged.
7) Add tests for status mapping, api helpers, and trips service.

## Naming and Conventions
- Files use kebab or dot suffixes (`*.service.ts`, `*.repo.ts`, `*.dto.ts`).
- Services never import `next/*`; route handlers never import Prisma directly.
- Shared types live in `src/server/contracts` or `src/types` depending on UI exposure.

## Risk Controls
- Each migration step preserves behavior; validate with manual smoke tests and, once added, unit tests.
- Keep PRs small: unify Prisma and status mapping before introducing new entities.
