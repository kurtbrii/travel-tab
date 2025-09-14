# Sprint Change Proposal: Add Edit Trip Capability

Date: 2025-09-12
Requested by: Product Owner
Mode: YOLO (batched analysis and edits)

## Analysis Summary

Change Trigger: Enable users to edit existing trips. Current scope includes create, view, and delete but omits edit.

Impact Assessment:
- PRD: FR2 mentions create, list, view, delete; lacks edit. Needs inclusion to align feature set.
- Epic 2 (Trip Management): Stories cover create, view detail, and delete. Add a new story for edit with clear ACs.
- Architecture/API: Trips endpoints define GET/POST/DELETE. Add an update endpoint (`PUT /api/trips/{tripId}`) with validation and ownership enforcement.
- UI/UX: Trips Grid and Add Trip modal exist; Edit will anchor from Trip Detail (US-002). Optional quick action from list later.

Recommended Path Forward:
- Add Edit Trip as a first-class capability across PRD, stories, and API design. Keep data model unchanged; reuse validation and patterns from Create.

## Proposed Edits (Exact Changes)

1) PRD Functional Requirements
- File: `docs/prd/functional-fr.md`
- Change: Update FR2 to read: “Users can create and edit a trip …; list, view, and delete their trips.”

2) PRD Epic 2: Trip Management
- File: `docs/prd/epic-2-trip-management.md`
- Change: Add Story 4 — “As a user, I can edit a trip I own …” with acceptance criteria covering validation parity, ownership checks (403), not-found (404), and UI reflection with success indicator.

3) Architecture / API Design
- File: `docs/architecture/api-design-and-integration.md`
- Change: Add `PUT /api/trips/{tripId}` endpoint: validates input, enforces ownership, returns 200 on success; 400/401/403/404 on errors.

4) New User Story
- File: `docs/stories/epic-2-trip-management/us-004-edit-trip.md`
- Content: Full story “US-004: Edit Trip” with goals, scope, assumptions, UX, validation rules, acceptance criteria, accessibility, risks, DoD, and test guidance.

## Notes & Considerations
- Validation: Mirror create rules (Zod schema). Ensure server checks end ≥ start and ISO alpha-2.
- Ownership: Enforce at repository/service layer; return 403 for non-owner edits.
- UX Entry: Primary from Trip Detail. Quick edit from list is optional stretch.
- Backward Compatibility: No schema changes required; fields already exist.

## Next Steps
- PO sign-off on this proposal.
- Dev to implement `PUT /api/trips/{tripId}` and UI edit flow per US-004.
- QA to design tests for edit success, validation errors, 403 forbidden, and 404 not found.

