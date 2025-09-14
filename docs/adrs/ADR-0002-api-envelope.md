Title: Standard API Response Envelope
Status: Accepted
Date: 2025-09-09

Context:
- API routes return ad-hoc JSON shapes, complicating clients and tests.

Decision:
- Standardize on `{ success, data?, error? }` with HTTP statuses.
- Provide helpers in `src/lib/api.ts` (e.g., `ok`, `fail`, `toNextResponse`).

Alternatives:
- Per-route bespoke shapes: flexible but inconsistent.
- Throw-only pattern: harder to keep consistent error codes/messages.

Consequences:
- Minor refactor to handlers; simpler client code and tests.

References:
- docs/architecture.md#api-design-and-integration

