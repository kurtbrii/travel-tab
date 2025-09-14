# US-002: View Trip Detail

Status: Done
Epic: Trip Management (Epic 2)

## Summary
Allow a signed-in user to view the details of a trip they own on a dedicated page with tabs, including a BorderBuddy tab. Returning to the Trips list preserves the user’s prior list state.

## Goals / Outcomes
- Provide a clear, read-only view of trip fields.
- Surface a BorderBuddy tab in the detail view for future workflows.
- Preserve sorting/filtering/pagination state when navigating back to the list.

## In Scope
- Read-only detail view at `/trips/[id]` for owned trips.
- Tabs: `Overview` (default) and `BorderBuddy` (placeholder content is acceptable in this story).
- Back navigation that preserves list state (URL query persistence).

## Out of Scope
- Editing trips. Deleting trips is covered in US-003.
- Creating or performing actions inside BorderBuddy; only a visible tab placeholder.

## Assumptions
- User authentication is available; `userId` is accessible server-side.
- List state is represented via URL query params (e.g., `?q=&sort=...&page=...`).

## UX / UI
- Route: `/trips/[id]`
- Layout:
  - Header with trip summary (destination, date range)
  - Tabs:
    - Overview: shows destination (country), purpose, start date, end date
    - BorderBuddy: tab present with placeholder message (e.g., "BorderBuddy features coming soon")
- Back button or breadcrumbs to return to `/trips` with prior query params.

## Data Display
- destinationCountry (map to ISO country name for display)
- purpose
- startDate / endDate (format as localized date; date-only)

## Security & Access
- Authorization: only the owner may view a trip; access to `/trips/[id]` must verify `trip.userId === currentUserId`.
- If unauthorized or not found: show 404.

## Navigation & State Preservation
- From `/trips` (which may include query params `q`, `sort`, `page`, `filter...`) to `/trips/[id]` should include a `returnTo` query param or rely on the browser history.
- On back/return, the list state (search, sort, filters, and page) must be preserved via the URL query params.

## Acceptance Criteria (Gherkin)
1) Detail view shows fields
   - Given I own a trip with destination, purpose, start/end dates
   - When I open `/trips/[id]`
   - Then I see those fields in a read-only Overview tab

2) BorderBuddy tab present
   - Given I am on `/trips/[id]`
   - When I view the tabbed interface
   - Then I see a tab labeled "BorderBuddy" and can switch to it; placeholder content is acceptable

3) Back preserves list state
   - Given I navigated to `/trips` with certain filters/sort/page and then opened a trip
   - When I navigate back using the Back button or a provided "Back to Trips" link
   - Then I return to `/trips` with the same filters/sort/page applied

4) Access control
   - Given a different user’s trip id
   - When I try to open `/trips/[id]`
   - Then I receive a 404 (not found) result

## Telemetry
- Track tab changes, detail page views, and 404s due to access control.

## Accessibility
- Tabs are keyboard operable with proper ARIA roles; visible focus states.
- Content under tabs is announced correctly when tabs change.

## Dependencies
- Auth/session to obtain `userId`.
- Trips list uses query params for state; detail page returns with those params intact.

## Risks
- Inconsistent state if list state is kept only in memory; using URL query persistence mitigates this.

## Definition of Done
- Meets acceptance criteria.
- Lints clean and builds.
- a11y checks pass for tabs and navigation.
- Integration test: back navigation preserves list state.

## QA Results
- Gate Decision: PASS
- Reviewer: Quinn (Test Architect)
- Reviewed: 2025-09-12T03:17:08Z

Quality summary:
- Scope is clear with concrete ACs for fields, tabs, back-state, and access control. Security requires strict owner check with 404 on unauthorized/not found. A11y expectations for tabs are explicit.

Requirements traceability (Given-When-Then):
- AC1 Detail fields: Verify destination (ISO → display name), purpose, startDate, endDate appear read-only in Overview.
- AC2 BorderBuddy tab: Tab labeled "BorderBuddy" toggles and renders placeholder; keyboard operable.
- AC3 Back preserves state: From `/trips?q&sort&page&filters` → detail → back returns with identical query params.
- AC4 Access control: Non-owner opening `/trips/[id]` yields 404 with no data leak.

Test design:
- Unit: date formatting (localized, date-only), ISO → country name mapping, tab ARIA state handling.
- Integration: server-side ownership check returning 404; detail page rendering fields; back link/history using preserved query.
- E2E: owner can view detail; non-owner gets 404; tab keyboard navigation; back returns to same list state.

NFR assessment:
- Accessibility: Ensure proper roles/attributes (tablist, tab, tabpanel), focus management, `aria-selected`, `aria-controls`, roving tabindex.
- Security: Enforce `trip.userId === currentUserId` on server; return 404; avoid open-redirect via `returnTo` (restrict to same-origin path or use history.back()).
- Performance: Page is simple; avoid caching personalized SSR; set `Cache-Control: private` or disable caching for user-scoped data.
- Observability: Track page views, tab changes, and 404s as specified.

Risks & mitigations:
- Open redirect via `returnTo` param — sanitize or prefer `history.back()` with safe fallback.
- Timezone/format inconsistencies — use explicit locale and date-only formatting.
- SSR caching of user-scoped content — ensure no shared cache of personalized responses.

Recommendations:
- Implement safe back behavior: if `returnTo` present, validate as same-origin path + expected base (`/trips`); else use `history.back()` with fallback link including prior query params.
- Use an accessible Tab component that satisfies ARIA Authoring Practices.
- Add integration tests for 404 on non-owner and stateful back navigation.

Decision rationale:
- Story is testable and unambiguous; identified risks have straightforward mitigations. Proceeding with PASS and monitoring the items above.
