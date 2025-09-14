# Testing Strategy

- Tooling: Vitest + React Testing Library; Node environment for services/repos; jsdom for components.
- Coverage: Aim ≥80% for services and core libs; focus UI tests on critical flows.
- Types of tests:
  - Unit: `status.ts`, `api.ts`; services with repo and OpenAI client mocks.
  - Integration: repositories against a test DB (or Prisma sqlite) and route handlers invoked as pure functions.
  - UI: Trips list, create trip form validation, BorderBuddy context form and chat interactions.
- Layout: co-locate `*.test.ts(x)` with source; `tests/setup.ts` initializes RTL, jest-dom.
- Scripts: `test`, `test:watch`, `test:coverage`.

Initial tests to add
- Status mapping round-trip and unknown/default handling.
- API helper maps typed errors to HTTP 4xx/5xx and envelope.
- Trips service validates dates, calls repo, and maps status correctly.
- Chat service builds system/user messages correctly and handles OpenAI responses and errors.
- Places service prompts OpenAI and parses list structure (name + description) robustly.
