Title: Secure Secrets Handling and Env Validation
ID: TT-001
Status: Draft
Type: fix
Owner: PO
Created: 2025-09-09

Summary
- Remove any committed secrets, add safe env workflows, and validate required environment variables at runtime to prevent misconfiguration.

Context
- .env was previously committed and has been removed by the team. We must prevent recurrence and add startup-time validation for `DATABASE_URL` and `JWT_SECRET` per architecture doc.

Requirements
- Add `src/server/config/env.ts` that reads and validates required env vars (using Zod or equivalent) and exports a typed config.
- Replace direct `process.env.JWT_SECRET`/`DATABASE_URL` usages in server code with imports from `env.ts`.
- Provide `.env.example` with placeholders for all required vars.
- Update README with clear setup steps for env variables.

Acceptance Criteria
- Given the app boots without `DATABASE_URL`, When server code requiring DB runs, Then a clear developer-facing error explains what is missing and how to fix it.
- Given `JWT_SECRET` is missing, When auth routes are invoked, Then an error is thrown/logged via `env.ts` with a 500 response using the standard envelope.
- Given `.env.example` exists, When a new dev sets up the project, Then copying to `.env` and filling values is sufficient to run the app.
- `.gitignore` continues to ignore `.env*` files; no secrets in repo history moving forward.

Tasks / Subtasks
1) Create `src/server/config/env.ts` with Zod schema and typed export.
2) Update `src/app/api/auth/*` and `src/lib/auth.ts` to import from `env.ts` instead of `process.env` directly.
3) Add `.env.example` with keys: `DATABASE_URL`, `JWT_SECRET` (and any others required by future stories).
4) Update README “Getting Started” with env setup steps.
5) Optional: add preflight check in `next.config.ts` or a small bootstrap that logs missing env in dev.

Dependencies
- None (can be done immediately). Aligns with docs/architecture.md Security Integration.

Risks
- Minimal. Ensure not to log secret values; only declare the missing key names.

Out of Scope
- Rotating production secrets (handled operationally outside repo).

