# Next Steps

## Story Manager Handoff
- Reference: `docs/architecture.md`.
- Key requirements: layered structure, unified Prisma client, standardized response envelope, OpenAI-backed chat and places, persisted context form.
- Constraints: No maps; protect user data; sustain a11y.
- Stories (sequence):
  1) Unify Prisma; add `lib/status.ts` and `lib/api.ts`; refactor `/api/trips`.
  2) Introduce `server/repositories` and `server/services` for Trips; move logic from `lib/trips.ts`.
  3) Add BorderBuddy schema + migrations; implement enablement endpoint.
  4) Implement context form endpoints (GET/PUT), chat (GET/POST with OpenAI), and places (GET/POST) endpoints.

## Developer Handoff
- Create `src/server/{repositories,services,contracts,config,errors,logging}` stubs.
- Implement `lib/status.ts` and `lib/api.ts`; refactor trips route.
- Remove `src/lib/prisma.ts`; standardize imports to `@/lib/db`.
- Add unit tests for helpers and trips service skeleton.
- Prepare Prisma migrations for BorderBuddy, BorderBuddyContext, PlacesRecommendation, ChatMessage, and Trip additions.
