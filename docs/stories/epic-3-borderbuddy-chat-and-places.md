Title: Epic 3 — BorderBuddy Chat & Places
Status: Approved
Owner: PO
Created: 2025-09-14

Summary
- Deliver BorderBuddy as an LLM-backed chat experience with a persisted context form and a simple places list per trip. No maps integration in MVP.

Stories
1) Story 3.1 — Enable BorderBuddy (Context + Chat + Places)
   - Enablement (idempotent), context form persistence, chat via OpenAI, and places list generation.

2) Story 3.2 — Chat UX Polish and Streaming
   - Typing indicator / partial streaming; retry handling; disclaimers.

3) Story 3.3 — Places UX Polish
   - Regenerate flow, “copy all” action, basic tags/filters.

Non-Goals (MVP)
- Google Maps integration, itinerary builder, vendor links, or booking flows.

Risks
- OpenAI latency/availability; mitigate with timeouts/retries and user feedback.

Acceptance
- FR3–FR6 satisfied; NFR1–NFR6 satisfied within MVP scope.

