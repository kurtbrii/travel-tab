# Epic 1: Foundation & Core Infrastructure
Establish app scaffolding, authentication, initial Trips surface, and a simple health check to prove deployability.

## Stories
1. As a user, I can register and login so I can access my trips.
   - Acceptance Criteria:
     1: Registration validates email and password rules; login establishes a secure session.
     2: Authenticated requests return user context from `/me`.
     3: Unauthenticated access to protected routes is redirected to login.

2. As a developer, I can verify the app health so I know deployments work.
   - Acceptance Criteria:
     1: A health route or page responds with 200 and basic env/version info.
     2: Lint/build runs clean locally (`npm run lint`, `npm run build`).
