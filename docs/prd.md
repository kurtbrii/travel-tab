Title: TravelTab Product Requirements Document (PRD)

# Goals and Background Context

## Goals
- Help individual travelers plan a trip with conversational guidance and simple place suggestions for a single destination.
- Enable users to authenticate, create trips, and attach a BorderBuddy module.
- Provide a chat-based experience powered by an LLM (OpenAI) that answers questions using trip details and a pre-chat BorderBuddy context form.
- Generate a simple, text-only list of places to visit in the destination country (no maps integration in MVP).
- Deliver a focused, scoped MVP that can be deployed and validated quickly.

## Background Context
TravelTab with BorderBuddy targets individual travelers who want conversational help planning their trip. The MVP builds a narrow, high‑value slice: authenticate, create a trip, fill a short BorderBuddy context form, and chat with an LLM (OpenAI) to get guidance and a simple list of places to visit. The product emphasizes clarity and speed, avoiding complexity like maps or deep integrations for now.

## Change Log
| Date       | Version | Description                 | Author |
|------------|---------|-----------------------------|--------|
| 2025-09-09 | v0.1    | Initial PRD draft from brief | PM/AI  |

# Requirements

## Functional (FR)
1. FR1: Users can register and login.
2. FR2: Users can create a trip with destination country (ISO list), purpose, start date, end date; list, view, and delete their trips.
3. FR3: Users can enable exactly one BorderBuddy instance per trip; creation is idempotent.
4. FR4: Users can fill a BorderBuddy context form per trip (e.g., interests, preferred regions/cities, budget, travel style, constraints) to enrich LLM prompts; data persists and is editable.
5. FR5: BorderBuddy provides a chat interface per trip backed by OpenAI; messages persist with roles (user/assistant) and use trip + form context.
6. FR6: Users can generate and view a simple list of places to visit for the destination country; list items include name and short description (no maps integration).
7. FR7: Access control ensures users can access only their own trips and trip‑scoped data.

## Non-Functional (NFR)
1. NFR1: Enforce authentication, row-level access, and protect chat history; avoid logging sensitive content.
2. NFR2: Clearly present responses as informational guidance; add disclaimers.
3. NFR3: UX & Accessibility: Provide clear form validation, keyboard‑navigable lists, and visible focus states (aim WCAG AA).
4. NFR4: Performance: Median chat round‑trip ≤ 6s with OpenAI; stream if available.
5. NFR5: Dependencies: Use OpenAI via `OPENAI_API_KEY`; country list remains local (ISO set); no Google Maps in MVP.
6. NFR6: Privacy: Do not request or store high‑sensitivity IDs (e.g., passport numbers) in MVP; redact obvious sensitive inputs before sending to OpenAI.

# User Interface Design Goals

## Overall UX Vision
Keep users oriented within a single trip. Provide a clean, responsive BorderBuddy tab with a context form, chat, and a simple places list. Emphasize clarity and fast answers; avoid map visuals until later.

## Key Interaction Paradigms
- Trip-centric navigation: Users land on Trips, then dive into a Trip Detail with BorderBuddy.
- Conversational refinement: Chat responses are grounded in trip + context form.
- Simple suggestions: A places list presents concise ideas without maps or booking.

## Core Screens and Views
- Login / Register
- Trips List
- Create/Delete Trip
- Trip Detail: BorderBuddy tab with Context Form, Chat, and Places List
- Settings/Profile (optional later)

## Accessibility: WCAG AA
Adopt semantic HTML, focus-visible states, keyboard navigation, and ARIA patterns where appropriate.

## Branding
Lightweight, neutral design aligned with Tailwind defaults; emphasize readability and clear hierarchy.

## Target Device and Platforms: Web Responsive
Optimize for modern desktop and mobile browsers with responsive layouts.

# Technical Assumptions
- Frontend: Next.js (App Router) with TypeScript and Tailwind CSS.
- Authentication: Basic email/password or provider-based setup suitable for MVP demo; secure session handling.
- Data: Minimal persistence suitable for MVP; trip and borderbuddy data scoped per user. Country list is a local ISO set.
- AI/Logic: OpenAI Chat Completions or Responses API; prompts built from trip + BorderBuddy context form; no Google Maps.
- Performance: Stream responses when possible; fall back to batched answers.

# Data Model
- User: id, email, password/auth fields.
- Trip: id, userId (FK), destinationCountry, purpose, startDate, endDate, createdAt.
- BorderBuddy: id, tripId (unique FK), enabledAt.
- BorderBuddyContext: id, borderBuddyId (FK), fields JSON (interests, regions/cities, budget, travel style, constraints), updatedAt.
- PlacesRecommendation: id, borderBuddyId (FK), generatedAt, items JSON (name, description, optional tags/region).
- ChatMessage: id, borderBuddyId (FK), role (user|assistant), content, createdAt.

- Trips: POST /trips, GET /trips, GET /trips/:id, DELETE /trips/:id
- BorderBuddy: POST /trips/:id/borderbuddy (idempotent create)
- Context: GET/PUT /trips/:id/borderbuddy/context
- Places: GET/POST /trips/:id/borderbuddy/places (generate and fetch latest)
- Chat: GET/POST /trips/:id/borderbuddy/chat/messages
- Auth: POST /register, POST /login, GET /me

# Constraints & Principles
- Keep MVP deterministic and local; explicitly mark assumptions and disclaimers.
- Ensure vertical slices deliver end-to-end value per story.
- Keep security and privacy guardrails in place from the start.

# Risks & Mitigations
- LLM Quality Risk: Hallucinations or off‑target places → Clear disclaimers; keep prompts focused on destination country; avoid authoritative claims.
- Privacy Risk: Sensitive details in chat → Avoid requesting passport numbers; redact patterns; disclose privacy practices.
- Scope Creep: Map/integration requests → Explicitly out‑of‑scope for MVP; simple list only.

# Success Metrics
- Activation: ≥70% of newly registered users create at least one trip.
- BorderBuddy Adoption: ≥60% of trips created with BorderBuddy enabled.
- Chat Engagement: ≥60% of trips with ≥3 chat turns.
- Places Usage: ≥50% of trips generate one places list.
- Chat Responsiveness: Median round‑trip answer time ≤6s with OpenAI.

# Epics

## Epic 1: Foundation & Core Infrastructure
Establish app scaffolding, authentication, initial Trips surface, and a simple health check to prove deployability.

### Stories
1. As a user, I can register and login so I can access my trips.
   - Acceptance Criteria:
     1: Registration validates email and password rules; login establishes a secure session.
     2: Authenticated requests return user context from `/me`.
     3: Unauthenticated access to protected routes is redirected to login.

2. As a developer, I can verify the app health so I know deployments work.
   - Acceptance Criteria:
     1: A health route or page responds with 200 and basic env/version info.
     2: Lint/build runs clean locally (`npm run lint`, `npm run build`).

## Epic 2: Trip Management
Enable users to create, list, and view trips with required fields and validation.

### Stories
1. As a user, I can create a trip so I can plan for a destination and dates.
   - Acceptance Criteria:
     1: Form captures destination (ISO list), purpose, start/end dates (end ≥ start); shows validation errors inline.
     2: Saved trip appears in Trips list with key fields.
     3: Users see only their own trips.

2. As a user, I can view my trip detail so I can manage BorderBuddy for that trip.
   - Acceptance Criteria:
     1: Trip detail shows entered fields and a BorderBuddy tab.
     2: Navigation returns to Trips list without losing state.

## Epic 3: BorderBuddy Chat & Places
Provide an LLM‑powered chat with a pre‑chat context form and a simple places list for each trip.

### Stories
1. As a user, I can enable BorderBuddy for my trip and fill a context form so I get better, personalized answers.
   - Acceptance Criteria:
     1: Creating BorderBuddy is idempotent (one per trip).
     2: Context form captures interests, budget, travel style, preferred regions/cities, constraints (editable, persisted).
     3: Context is merged with trip details to build prompts.

2. As a user, I can chat with BorderBuddy and get helpful answers grounded in my trip and context form.
   - Acceptance Criteria:
     1: Chat messages persist with roles; history loads per trip.
     2: Responses are generated via OpenAI using `OPENAI_API_KEY`.
     3: Disclaimer appears with assistant messages.

3. As a user, I can generate a simple list of places to visit in my destination country.
   - Acceptance Criteria:
     1: List shows names and short descriptions (optional tags); no map integration.
     2: Generation uses trip dates and context form; stored per trip with timestamp.
     3: Users can regenerate to refresh the list.

## Epic 4: (Reserved)
Reserved for post-MVP enhancements (e.g., maps, richer itinerary tools).

# Checklist Results Report
TBD — Run PM checklist after initial PRD review and insert results here.

# Next Steps
## UX Expert Prompt
Design a responsive, accessible UI for TravelTab’s MVP: Login/Register, Trips List, Create/Edit Trip, and Trip Detail with a BorderBuddy tab that includes a short Context Form, Chat (LLM), and a simple Places List (text only, no maps). Prioritize clarity, validation, keyboard navigation, and visible focus states. Keep branding neutral and readable.
