Title: MVP Uses No External Government APIs (Local Rules Only)
Status: Accepted
Date: 2025-09-09

Context:
- PRD NFR6 states the MVP should avoid live government APIs; rely on local deterministic rules.

Decision:
- Implement guidance via `LocalRulesProvider` and deterministic templates; no external network calls.
- Define an interface for future providers to enable later swaps without service changes.

Alternatives:
- Integrate external APIs now: higher complexity and risk for MVP timelines.

Consequences:
- Faster MVP delivery; later integration path preserved via provider interface.

References:
- docs/architecture.md#external-api-integration

