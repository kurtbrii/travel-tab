# US-003: Delete Trip

Status: Done
Epic: Trip Management (Epic 2)

## Summary
Allow a signed-in user to delete a trip they own. Deletion removes the trip and all trip-scoped data (BorderBuddy, context, places, chat). Only the owner can delete.

## Goals / Outcomes
- Provide a clear, confirmable action to delete a trip.
- Enforce ownership checks; prevent unauthorized deletes.
- Ensure dependent data is removed atomically to avoid orphan records.

## In Scope
- Delete affordance from the Trips List item menu and Trip Detail page.
- Confirmation dialog with explicit consequences and a descriptive action label (e.g., "Delete trip and related data").
- API endpoint to perform deletion with ownership verification.

## Out of Scope
- Soft delete/undo. This story is hard delete only.
- Archival or export.

## Assumptions
- Auth/session provides `userId` server-side.
- Trip-scoped relations are removed via DB cascading foreign keys or a service-layer transaction.

## UX / UI
- Locations: overflow menu on trip card in list; destructive button on Trip Detail.
- Confirmation: modal with trip summary and a required explicit confirmation action (secondary cancel, primary destructive confirm).
- Feedback: success toast and removal from list; navigating to a deleted trip yields 404.

## Security & Access
- Only owners can delete.
- 404 if trip not found; 403 if not owner.

## Acceptance Criteria (Gherkin)
1) Owner can delete from list
   - Given I own a trip visible in the Trips List
   - When I open its menu and confirm Delete
   - Then the trip is removed and no longer appears in the list

2) Owner can delete from detail
   - Given I own a trip and am on `/trips/[id]`
   - When I confirm Delete
   - Then I am returned to the Trips List and the trip no longer appears

3) Access control
   - Given a trip not owned by me
   - When I call the delete API
   - Then I receive 403 Forbidden

4) Dependent data removed
   - Given a trip with BorderBuddy enabled, context, places, and chat
   - When I delete the trip
   - Then all related records are removed and subsequent GETs return 404

## Telemetry
- Track delete confirmations, cancellations, and outcomes.

## Accessibility
- Modal is focus-trapped; destructive action clearly labeled; screen readers announce consequences.

## Dependencies
- Auth/session to obtain `userId`.
- API endpoint `DELETE /api/trips/{tripId}`.

## Risks
- Accidental deletion → mitigated by explicit confirm dialog and clear copy.

## Definition of Done
- Meets acceptance criteria.
- Lints clean and builds.
- Integration tests cover ownership and cascading delete behavior.

## QA Results
- Gate Decision: PASS
- Reviewer: Quinn (Test Architect)
- Reviewed: 2025-09-13T12:43:44Z

Quality summary:
- Scope is clear and testable: hard delete with owner-only access, confirmation UX, and explicit removal of all trip-scoped data. Primary risks are atomicity of deletes, unauthorized access leakage, and double-submit/race behaviors; each has straightforward mitigations.

Requirements traceability (Given-When-Then):
- AC1 Owner delete from list: Trigger delete via list item menu; upon success, trip disappears from list and a success toast appears; telemetry logs confirmation and outcome.
- AC2 Owner delete from detail: Confirm delete on `/trips/[id]`; user is returned to `/trips` and the trip is absent on refresh; toast shown.
- AC3 Access control: For a non-owner, `DELETE /api/trips/{id}` returns 403 Forbidden as specified; no data leakage (response body generic). Optionally consider 404 to avoid existence disclosure.
- AC4 Dependent data removed: BorderBuddy data, context, places, and chat are removed within the same transaction; subsequent GETs for the trip or related resources return 404.

Test design:
- Unit: service-layer `deleteTrip(userId, tripId)` verifies ownership and performs cascading removal; returns success indicator; rejects on non-owner.
- Integration: `DELETE /api/trips/{id}` happy path (owned trip) and 403 for non-owner; verify 404 after deletion; DB assertions that related tables are empty for the trip.
- E2E: Delete from list and detail flows; confirm modal a11y (focus trap, descriptive labels); double-click/rapid submits are idempotent; navigation returns to updated list.

NFR assessment:
- Security: Server-side ownership check; return 403 for non-owner (or 404 if team prefers non-disclosure); avoid exposing trip existence in error copy; CSRF protections per framework.
- Reliability: Wrap deletes in a DB transaction; prefer FK `ON DELETE CASCADE` or explicit ordered deletes inside `prisma.$transaction` to avoid partial removal.
- Performance: Cascading deletes are bounded by trip scope; ensure indexes on foreign keys; avoid N+1 delete calls when FK cascade is available.
- Observability: Track confirmations, cancellations, success/failure; include reason codes for failure (not-found, not-owner, constraint error).
- Accessibility: Modal uses proper roles/aria with clear destructive labeling; ensure keyboard-only flow and screen reader announcement of consequences.

Risks & mitigations:
- Partial deletion due to mid-flight failure — use a single transaction and/or FK cascade; rollback on error.
- Double-submit/races — disable confirm button during request; server enforces idempotency (second call returns 404 once deleted).
- Existence disclosure via 403 — consider 404 for unauthorized to reduce enumeration risk; log true reason server-side.
- Stale UI/cache — invalidate/revalidate list data after deletion; ensure navigation state is consistent.

Recommendations:
- Implement deletion via `prisma.$transaction` or FK `onDelete: Cascade` to guarantee atomicity across related tables.
- Return 204 No Content on success; ensure handlers are idempotent.
- Add integration tests for ownership (403) vs not-found (404), and for verification that all related records are removed.
- Emit telemetry for confirm/cancel/success/failure to support monitoring.

Decision rationale:
- Story is unambiguous and testable. With transactional/cascading deletion and access checks in place, risk is acceptable; proceed with PASS and monitor items above.
