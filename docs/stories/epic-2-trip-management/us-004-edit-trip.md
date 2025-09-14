# US-004: Edit Trip

Status: Ready for Review
Epic: Trip Management (Epic 2)

## Summary
Allow a signed-in user to edit an existing trip they own by updating destination country, purpose, and date range with the same validation rules as creation. Changes persist and reflect across Trip Detail and Trips List.

## Goals / Outcomes
- Provide an edit flow to correct or update trip details.
- Enforce ownership and validation consistently with create.
- Reflect updates immediately in the UI with a success indicator.

## In Scope
- Editing fields: destinationCountry (ISO alpha-2), purpose, startDate, endDate, and status if present.
- Inline client validation mirrored by server validation.
- Persist updates via API (`PUT /api/trips/{tripId}`) with ownership checks.

## Out of Scope
- Changing trip ownership or IDs.
- Additional fields beyond those listed (e.g., city, notes, attachments).
- Bulk edit of multiple trips.

## Assumptions
- User authentication/session is available; current user id retrievable server-side.
- Trip Detail view exists (US-002); edit entry point is from Trip Detail, with optional quick action from list later.
- Dates are date-only strings (YYYY-MM-DD) and compared as dates; end ≥ start.

## Data Model
Same as US-001. No schema changes required.

## UX / UI
- Primary entry: Trip Detail page shows an Edit button opening an edit form (dialog or dedicated route).
- Form pre-populates existing values; on Save, show success toast/inline message; remain on Trip Detail.
- Optional: quick edit action from Trips List may open the same form modal.

## Validation Rules
- Required: destinationCountry, purpose, startDate, endDate
- Length: purpose 3–100 chars
- Date: endDate ≥ startDate
- Values: destinationCountry must be a valid ISO alpha-2 code

## Security & Access
- Only the owner can edit. Enforce via `userId` ownership check; return 403 if not owner, 404 if trip not found.

## Navigation & Behavior
- On Save: persist via `PUT /api/trips/{tripId}`; remain on detail and show success; list reflects changes on next render.
- On Cancel: close form and retain previous values.

## Acceptance Criteria (Gherkin)
1) Inline validation on edit
   - Given I am on Trip Detail for a trip I own and click Edit
   - When I set End Date before Start Date or clear required fields
   - Then I see inline errors and cannot save until valid

2) Update persists and reflects
   - Given I change destination, purpose, or dates to valid values on the edit form
   - When I click Save
   - Then I remain on Trip Detail, see a success indicator, and the updated values are shown; the Trips List reflects the changes

3) Authorization enforcement
   - Given I attempt to edit a trip I do not own
   - When I submit the edit form
   - Then the server responds 403 Forbidden and the UI shows an error; no changes are saved

4) Not found handling
   - Given a deleted or non-existent trip id
   - When I visit its edit route or submit edits
   - Then I receive a 404 Not Found and an appropriate message is shown

## Telemetry
- Track edit form open, save success/failure, and validation error occurrences.

## Accessibility
- Labels associated to inputs; error messages linked and announced via ARIA.
- Keyboard accessible; focus managed within dialog; return focus to triggering control on close.

## Dependencies
- Auth/session; existing Trip Detail (US-002) entry point.

## Risks
- Timezone/date-only consistency; ensure server and client validations match.

## Definition of Done
- Meets acceptance criteria.
- Lints clean and builds.
- Unit tests for validation; integration tests for successful edit and authorization enforcement.

## QA Results

Gate Decision: PASS (QA Gate 2.004)

Summary:
- Implementation satisfies the four Acceptance Criteria with ownership checks, validation parity, and UI behavior (remain on detail, show success, list reflects post-refresh).
- Tests cover server validation and authorization paths; client-side validation mirrors server via shared schema.

Evidence:
- Reviewed files: `src/app/api/trips/[id]/route.ts`, `src/lib/trips.ts`, `src/components/edit-trip-button.tsx`, page wiring under `src/app/trips/[id]/page.tsx`.
- Tests: `src/app/api/trips/[id]/__tests__/put.route.test.ts` (401/403/404/400/200) and `src/lib/__tests__/validation.trip.test.ts` (schema + date/ISO rules).
- Trace to ACs: [1,2,3,4] covered by implementation and tests; UI shows success indicator and prevents save on invalid input.

Concerns (non‑blocking):
- Telemetry: Story lists analytics for open/save/error/validation; not referenced in Dev notes—ensure events are emitted and minimally unit-tested.
- A11y: Dev notes indicate labels/focus/aria-live done; add RTL + axe assertion for dialog focus return and error announcement.
- ISO alpha‑2 validation source: confirm canonical list and case normalization; ensure error message is accessible and localized-ready.
- 404 UX: Add an assertion that the user-visible message renders on not-found in edit/detail.

Recommendations:
- Add analytics hooks with test stubs; add one integration test for 403 UI error and 404 message.
- Include an accessibility test covering focus management and aria-live notifications.

Decision:
- PASS with minor follow-ups; acceptable to proceed.

## Dev Agent Record
- Agent Model Used: OpenAI Codex CLI (dev)
- Debug Log References:
  - Implemented `PUT /api/trips/[id]` with ownership checks and validation parity with create.
  - Added `updateTrip` in `src/lib/trips.ts` with zod validation, ISO date checks, and legacy field mapping.
  - Added Edit UI on Trip Detail via `EditTripButton` with modal form reusing `AddTripForm`, inline validation, and success toast; calls `router.refresh()` on save.
  - Ensured accessibility: labels, focus trap in modal, aria-live toast.
  - Wrote tests: route PUT handler (401/403/404/400/200) and trip validation schema unit tests.
  - Ran all tests — passing locally in CI-like run.
- Completion Notes List:
  - Ownership enforced server-side; responds 403/404 appropriately.
  - Validation mirrored client-side using `tripSchema`; server returns 400 on invalid input.
  - UI remains on detail page and shows success indicator after save.
  - Trips List and Detail reflect updates upon refresh.
- File List:
  - src/lib/trips.ts (update: add `updateTrip`)
  - src/app/api/trips/[id]/route.ts (update: add `PUT` handler)
  - src/components/edit-trip-button.tsx (new)
  - src/app/trips/[id]/page.tsx (update: add Edit button, import React)
  - src/app/api/trips/[id]/__tests__/put.route.test.ts (new)
  - src/lib/__tests__/validation.trip.test.ts (new)
  - src/components/back-link.tsx (update: import React)
  - src/components/delete-trip-button.tsx (update: import React)
  - src/components/delete-trip/delete-trip-modal.tsx (update: import React)
  
Change Log
| Date       | Version | Description                                   | Author |
|------------|---------|-----------------------------------------------|--------|
| 2025-09-13 | 0.1     | Implement edit trip API, UI, and tests        | Dev    |
