# API Design and Integration

## API Integration Strategy
- Authentication: JWT in httpOnly cookie `auth-token`. Each route handler reads `getCurrentUser()` and returns 401 if absent.
- Authorization: For trip‑scoped endpoints, verify the trip belongs to the authenticated user; repositories always filter by `userId`.
- Validation: All inputs validated via Zod DTOs in `src/server/contracts/*`. Reject with 400 and `{ success:false, error:{ code:"VALIDATION_ERROR", message } }`.
- Response Envelope: Standardize on `{ success, data?, error? }` and set appropriate HTTP statuses (200/201/204/400/401/403/404/409/500).
- Idempotency: `POST /borderbuddy` creates if missing; if already exists, return 200 with existing resource.
- Versioning: MVP unversioned paths; include `X-API-Version: 0` response header. Future: promote to `/api/v1/*` if needed.
- CSRF: Same‑site `lax` cookie; assume same‑origin fetch from the app. For cross‑site forms, add CSRF token later if required.

### LLM Integration
- Provider: OpenAI via `OPENAI_API_KEY`.
- Prompt Context: Merge Trip fields (destinationCountry, dates, purpose) + persisted BorderBuddy Context Form (interests, regions/cities, budget, travel style, constraints).
- Safety: Redact obvious sensitive tokens before sending; prepend a system prompt that avoids authoritative legal/visa advice and sets expectations.

## Endpoints

## New Endpoints

1) Trips
- GET `/api/trips` — List authenticated user trips
  - Response 200:
    ```json
    { "success": true, "data": { "trips": [ {"id":"...","title":"...","destination":"US","startDate":"YYYY-MM-DD","endDate":"YYYY-MM-DD","status":"Planning"} ] } }
    ```
- POST `/api/trips` — Create a trip
  - Request:
    ```json
    { "title":"...", "destination":"US", "purpose":"Tourism", "startDate":"YYYY-MM-DD", "endDate":"YYYY-MM-DD" }
    ```
  - Responses: 201 on success; 400 validation; 401 unauthorized

- PUT `/api/trips/{tripId}` — Update a trip (owner only)
  - Request:
    ```json
    { "destinationCountry":"US", "purpose":"Business", "startDate":"YYYY-MM-DD", "endDate":"YYYY-MM-DD", "status":"Planning", "statusColor":"...", "modules":["..."] }
    ```
  - Behavior: Full update of editable fields; server validates inputs and enforces ownership.
  - Responses: 200 on success; 400 validation; 401 unauthorized; 403 forbidden (not owner); 404 not found

- DELETE `/api/trips/{tripId}` — Delete a trip the user owns
- Behavior: Requires ownership; deletes trip and all trip-scoped data (BorderBuddy, context, places, chat) via cascading or transactional deletes.
  - Responses: 204 on success; 401 unauthorized; 403 forbidden (not owner); 404 not found

2) BorderBuddy Enablement
- POST `/api/trips/{tripId}/borderbuddy` — Create/enable BorderBuddy (idempotent)
  - Response 201 (created) or 200 (existing):
    ```json
    { "success": true, "data": { "borderBuddy": { "id":"...","tripId":"...","enabledAt":"..." } } }
    ```
  - Errors: 401/403 if not owner; 404 if trip not found; 409 on unique violation (should be caught and mapped to 200 with existing)

  - DTOs
    - Path Params: `tripId: string`
    - Responses: 201 | 200 → `{ success: true, data: { borderBuddy: { id: string, tripId: string, enabledAt: string } } }`

3) BorderBuddy Context
- GET `/api/trips/{tripId}/borderbuddy/context` — Get current context form values
  - Response 200:
    ```json
    { "success": true, "data": { "context": { "interests": ["food","history"], "regions": ["Kyoto","Osaka"], "budget": "mid", "style": "slow", "constraints": ["no hiking"] } } }
    ```
- PUT `/api/trips/{tripId}/borderbuddy/context` — Create/update context form
  - Request:
    ```json
    { "interests": ["food"], "regions": ["Tokyo"], "budget": "mid", "style": "balanced", "constraints": [] }
    ```
  - Response 200 with saved context

4) Places
- GET `/api/trips/{tripId}/borderbuddy/places` — Get latest generated places list
  - Response 200:
    ```json
    { "success": true, "data": { "places": { "generatedAt": "...", "items": [ { "name": "Fushimi Inari Shrine", "description": "Iconic torii gates hike in Kyoto", "tags": ["history","scenic"] } ] } } }
    ```
- POST `/api/trips/{tripId}/borderbuddy/places` — Generate (or regenerate) places list via OpenAI using trip + context
  - Request (optional): `{ "seed"?: string }
  - Response 201 with new list

5) Chat
- GET `/api/trips/{tripId}/borderbuddy/chat/messages?cursor=...&limit=50` — List messages (most recent first or paginated)
  - Response 200:
    ```json
    { "success": true, "data": { "messages": [ {"id":"...","role":"User","kind":"Chat","content":"...","createdAt":"..."} ] } }
    ```
- POST `/api/trips/{tripId}/borderbuddy/chat/messages` — Append a user message and stream or batch an assistant reply via OpenAI
  - Request:
    ```json
    { "content":"What visa do I need?", "kind":"Chat" }
    ```
  - Response 201:
    ```json
    { "success": true, "data": { "saved": {"id":"...","role":"User","content":"..."}, "assistant": {"id":"...","role":"Assistant","content":"..."} } }
    ```

  - Behavior
    - Reply: Service calls OpenAI with a system prompt and merged context; supports streaming when available.
    - Pagination: `limit` 1–100 (default 50); `cursor` opaque (e.g., createdAt+id).
    - Disclaimer: Include informational disclaimer in assistant messages.

## Disclaimers
- Standard copy (embed with assistant replies and places lists):
  - "Informational guidance only. Verify details with official or trusted sources."

## Concurrency & Idempotency
- Enablement: On unique violation, return existing resource with 200.
- Places Generation: Upsert latest list per BorderBuddy; POST creates/replaces the stored list.

## Error Model
- Codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `SERVER_ERROR`.
- Include `meta.timestamp` and optional `requestId` header echo for traceability.

## Rationale
- Endpoints align with PRD stories (FR2–FR7) and NFRs. Idempotent enablement, persisted context, OpenAI-backed chat, and a simple places list meet the MVP scope without maps.
