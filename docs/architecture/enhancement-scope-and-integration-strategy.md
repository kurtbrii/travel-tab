# Enhancement Scope and Integration Strategy

## Enhancement Overview
- Enhancement Type: Brownfield refactor + MVP features (BorderBuddy: context form, chat, places).
- Scope: Introduce clear layering (transport → services → repositories), domain contracts, and persistence for BorderBuddy context, chat, and places. Preserve existing endpoints while migrating logic behind services.
- Integration Impact: Medium–High (new layers and entities) but incremental and backwards‑compatible.

## Integration Approach
- Code Integration Strategy:
  - Layers: `app/api` (transport only), `server/services` (business rules), `server/repositories` (Prisma), `server/contracts` (DTO/Zod), cross‑cutting in `server/{errors,config,logging}`.
  - Migration: Move logic from `src/lib/trips.ts` into `services/trips.service.ts` and `repositories/trips.repo.ts`. Keep `src/lib` for UI‑safe helpers.
  - Prisma client: Standardize on `src/lib/db.ts`; remove `src/lib/prisma.ts`.
  - Error model: Use a small `{ ok, fail, toNextResponse }` helper to normalize envelopes.
- Database Integration:
  - Add entities for BorderBuddy, BorderBuddyContext, PlacesRecommendation, ChatMessage.
  - Backward compatible: Trip unchanged aside from optional `purpose`.
- API Integration:
  - Keep `/api/trips` behavior; add new endpoints for enablement, context, places, and chat.
  - Validate all inputs with Zod; scope queries by `userId`.
- UI Integration:
  - Trip Detail adds a BorderBuddy tab with Context, Chat, and Places panes.
  - Clear disclaimers on assistant messages and places list.

## Compatibility Requirements
- API: Existing clients remain compatible; new endpoints are additive.
- Database: Additive migrations only; safe defaults for new columns.
- UI/UX: Maintain Tailwind/shadcn patterns and accessibility.
- Performance: Chat/Places responses within ~6s median using OpenAI; no maps; country list local.
