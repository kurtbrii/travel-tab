Title: BorderBuddy Schema, Services, and Endpoints (MVP - Chat & Places)
ID: TT-003
Status: Approved
Type: feat
Owner: PO
Created: 2025-09-09

Summary
- Introduce database schema, repositories, services, and API endpoints for BorderBuddy features: enablement, context form, chat (OpenAI-backed), and places list.

Context
- PRD FR3–FR7 and architecture specify an LLM chat experience with a persisted context form and a simple places list; no map integrations.

Requirements
- Prisma models: `BorderBuddy (unique tripId)`, `BorderBuddyContext (unique borderBuddyId)`, `PlacesRecommendation (unique borderBuddyId)`, `ChatMessage`; `Trip.purpose?`.
- Repositories under `src/server/repositories/*` using Prisma; services in `src/server/services/*` implementing context persistence, OpenAI calls, and parsing.
- Endpoints under `src/app/api/trips/[tripId]/borderbuddy/...`:
  - POST `borderbuddy` (idempotent enablement)
  - GET/PUT `context`
  - GET/POST `places`
  - GET/POST `chat/messages`

Acceptance Criteria
- Given a trip owned by the user, When POST `/borderbuddy` is called, Then it returns 201 on create or 200 with existing object.
- Given BorderBuddy is enabled, When PUT `/context` is called, Then values are saved and returned by subsequent GET.
- When POST `/chat/messages` is called with a user message, Then service persists it and returns an assistant reply via OpenAI with disclaimer.
- When POST `/places` is called, Then service calls OpenAI to produce a list of places (name + short description) and persists it.

Tasks / Subtasks
1) Add Prisma models and migrations (additive only). Update `prisma/schema.prisma` and regenerate client.
2) Create `src/server/{repositories,services,contracts}` folders; add DTOs with Zod in `contracts` for endpoints.
3) Implement services for enablement, context persistence, chat (OpenAI), and places generation.
4) Implement API route handlers with standard envelope (from TT-004) and auth guard.
5) Add minimal unit tests for services (OpenAI mocked) and parsing.

Dependencies
- TT-004 (API envelope helper) should land before or together; TT-001 (env validation) should be in place.

Risks
- Migration complexity; ensure backward-compatible, additive changes. OpenAI latency must be acceptable (≤6s) and errors handled gracefully.

Out of Scope
- Map integrations and retrieval‑augmented grounding.
