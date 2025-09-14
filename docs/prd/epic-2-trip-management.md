# Epic 2: Trip Management
Enable users to create, list, view, and delete trips with required fields and validation.

## Stories
1. As a user, I can create a trip so I can plan for a destination and dates.
   - Acceptance Criteria:
     1: Form captures destination (ISO list), purpose, start/end dates (end ≥ start); shows validation errors inline.
     2: Saved trip appears in Trips list with key fields.
     3: Users see only their own trips.

2. As a user, I can view my trip detail so I can manage BorderBuddy for that trip.
   - Acceptance Criteria:
     1: Trip detail shows entered fields and a BorderBuddy tab.
     2: Navigation returns to Trips list without losing state.

3. As a user, I can delete a trip I own so I can remove plans I no longer need.
   - Acceptance Criteria:
     1: Delete is available from Trip Detail and/or the Trips List via a confirm dialog.
     2: Only the trip owner can delete; unauthorized attempts are blocked.
    3: Deleting a trip removes its trip-scoped data (BorderBuddy, context, places, chat).
     4: After delete, the trip disappears from the list and direct access returns 404.

4. As a user, I can edit a trip I own so I can correct or update details.
   - Acceptance Criteria:
     1: Edit is available from Trip Detail (primary); optional quick action from Trips List.
     2: Validation matches create: destination must be ISO alpha-2; purpose 3–100 chars; end date ≥ start date.
     3: Only the trip owner can edit; unauthorized attempts are blocked with 403; non-existent trips return 404.
     4: On save, updated fields persist and reflect in Trip Detail and the Trips List with a success indicator; navigation state is preserved.
