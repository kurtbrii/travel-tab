Title: Versioned Brief and Checklist (Deterministic, History-Preserving)
Status: Superseded
Date: 2025-09-09

Context:
- Product pivoted BorderBuddy from compliance brief/checklist to LLM chat with a simple places list and a persisted context form.

Decision:
- Supersede versioned brief/checklist approach. Focus on chat (OpenAI) and places list; persist context form per trip. No maps integration in MVP.

Implementation Details:
- Add `BorderBuddyContext` and `PlacesRecommendation` tables. Chat messages persist with roles. Use OpenAI with a scoped system prompt and disclaimers.

Alternatives:
- Keep brief/checklist with local rules: rejected due to product shift toward planning chat and places suggestions.

Consequences:
- Simpler user experience aligned with planning; fewer tables than brief/checklist; adds external dependency (OpenAI).

References:
- docs/architecture/data-models-and-schema-changes.md
- docs/architecture/api-design-and-integration.md
