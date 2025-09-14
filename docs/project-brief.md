# TravelTab – MVP Project Brief

## Objective
Deliver a focused MVP of TravelTab with BorderBuddy to help individual travelers plan trips via an LLM chat experience. The MVP enables users to authenticate, create trips, attach the BorderBuddy module, fill a short context form, and receive conversational guidance plus a simple list of places to visit — staying strictly within the defined scope (no maps yet).

## In Scope (MVP)
- Authentication: Register and Login.
- Trip Management: Create a trip with destination country, travel purpose, start/end dates; list and view own trips.
- BorderBuddy Module (per trip):
  - Context Form: Interests, preferred regions/cities, budget, travel style, constraints.
  - Chat: Conversational interface powered by OpenAI; uses trip + form context.
  - Places List: Simple, text-only recommendations (name + short description). No maps.

## Out of Scope (MVP)
- Payments/subscriptions, shared trips/teams, itinerary planning, notifications, calendar sync, admin console, multi‑country trips, vendor integrations, production AI retrieval/grounding, document uploads (stretch).

## Target User & Value
- Primary user: Individual traveler planning an international trip.
- Value: Reduce uncertainty and risk at the border by presenting clear requirements, deadlines, and organized documents for a specific trip.

## Success Metrics (MVP Signals)
- Activation: ≥70% of newly registered users create at least one trip.
- BorderBuddy Adoption: ≥60% of trips created with BorderBuddy enabled.
- Chat Responsiveness: Median round‑trip answer time ≤6s with OpenAI.

## Key User Flows
1) Register → Login → Land on Trips.
2) Create Trip → (checkbox) “Add BorderBuddy” → Save.
3) Trip Detail → BorderBuddy tab: Context form (editable), Chat panel (compose + history), Places list (generated).

## Requirements Summary
- Trip fields: destination country (ISO list), purpose (short text/select), start date, end date (end ≥ start).
- BorderBuddy creation: exactly one instance per trip; idempotent create.
- Context form: persisted per trip; editable and used to prime prompts.
- Chat: per‑trip message history with roles (user/assistant) using OpenAI; disclaimer on assistant messages.
- Places: generated per trip using trip + form context; simple list only (no maps).
- Access control: users access only their own trips and trip‑scoped data.

## Non‑Functional Considerations
- Security & Privacy: Auth required; per‑user row‑level checks; protect chat history; avoid logging sensitive content.
- Accuracy: Present as guidance with clear disclaimer; encourage verification with official sources.
- Reliability: Chat is resilient to retries; places list regeneration is idempotent at the UI level.
- UX & A11y: Clear form validation, keyboard‑navigable lists, visible focus states.

## Assumptions & Constraints
- Nationality captured in user profile during/after registration.
- Country list sourced locally (ISO set) for MVP; OpenAI used for chat/places via API key.

## Risks & Mitigations
- Legal/Policy Risk: Misinterpretation of requirements → Prominent disclaimers; link to official sources; scope to generic guidance.
- Privacy Risk: Sensitive details in chat → Avoid requesting passport numbers or full IDs; redact or warn; provide a privacy notice.
- Ambiguity in Requirements: Edge cases (dual nationality, visas on arrival) → Encourage clarifying questions; capture purpose/dates; reflect edge‑case notes in chat guidance.

## Milestones & Timeline (Proposed)
- Week 1: Data model + Trip CRUD + Auth wiring; “Add BorderBuddy” on create.
- Week 2: BorderBuddy context form + Chat UX/logic (compose, history, streaming/batched) + access control hardening.
- Week 3: Places list generation + UX polish, QA, and MVP hardening.

## Stakeholders
- Product: Founder/PM (decision‑maker).
- Engineering: Full‑stack developer(s).
- QA/Review: PM/Founder.

## Open Questions
- Do we collect nationality at registration or as part of first trip/BorderBuddy setup?
- Should we include document uploads as a stretch goal in this MVP cycle or defer entirely?
- Any priority destinations/purposes to tune initial rules/templates?

## Stretch Goals (If Time Permits)
- Secure Document Storage: Upload PDFs/JPG/PNG tied to a trip’s BorderBuddy, with private storage, listing, and delete capabilities.

## Data Model Notes (MVP)
- BorderBuddy: id, tripId (unique FK), briefJson, generatedAt.
- ChecklistItem: id, borderBuddyId (FK), title, dueDate, status (todo|in_progress|done), notes, createdAt.
- ChatMessage: id, borderBuddyId (FK), role (user|assistant), content, createdAt.
