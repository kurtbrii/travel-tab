Title: Repository Hygiene — Remove Stray Source and Add Guards
ID: TT-005
Status: Draft
Type: chore
Owner: PO
Created: 2025-09-09

Summary
- Remove accidental source path and add lightweight guardrails to avoid similar issues.

Context
- Stray file detected: `src/components/Users/brii/Desktop/code/travel-tab/src/components/icons/index.tsx` (likely an editor artifact). This can confuse tooling.

Requirements
- Delete the stray file and verify no imports reference it.
- Optionally add an ESLint rule or simple script that flags suspicious deep absolute-like paths in `src/components/Users/*`.

Acceptance Criteria
- The stray path is removed from the repo.
- `npm run build` and `npm run lint` succeed after removal.

Tasks / Subtasks
1) Remove the file at the accidental path.
2) Grep the codebase to confirm no consumers.
3) Optional: add a CI check/script to fail if `src/components/Users/*` appears again.

Dependencies
- None.

Risks
- None (pure cleanup).

Out of Scope
- Broader repo restructure.

