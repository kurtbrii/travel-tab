# External API Integration

MVP integrates with OpenAI for BorderBuddy chat and the places list via `OPENAI_API_KEY`.

- Current External Integrations: OpenAI (Chat Completions/Responses). No Google Maps or government APIs in MVP.
- Country Data: Use a local ISO country list (already present under `src/constants/data.ts`).
- Prompting:
  - System prompt sets scope: friendly planning assistant, not legal/visa authority; include disclaimer.
  - Context merges trip details (destination, dates, purpose) + BorderBuddy context form (interests, regions/cities, budget, style, constraints).
  - For Places, ask for 5–10 items with name + 1–2 sentence description; avoid addresses/links/maps.
- Safety, Reliability, and Cost:
  - Timeouts and retries with backoff; cap tokens; redact obvious sensitive inputs.
  - Log request IDs and token usage; never log raw user content in production.
  - Handle API errors gracefully; show retry affordance.

Future‑proofing:
- Wrap OpenAI calls behind `src/server/services/{chat,places}.service.ts` and `contracts/providers.ts` to allow swapping providers later.
