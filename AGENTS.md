# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/app` (App Router pages, `layout.tsx`, `page.tsx`), shared utilities in `src/lib`.
- Assets: static files under `public/`.
- Config: `eslint.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `components.json` (shadcn/ui settings).
- Build output: `.next/` (ignored by Git).

## Build, Test, and Development Commands
- `npm run dev`: Start Next.js dev server with Turbopack at `http://localhost:3000`.
- `npm run build`: Production build with Turbopack.
- `npm start`: Serve the production build.
- `npm run lint`: Run ESLint using Next.js + TypeScript rules.

## Coding Style & Naming Conventions
- Language: TypeScript (strict). Prefer `.tsx` for React components, `.ts` for utilities.
- Indentation: 2 spaces; single quotes or project default via ESLint/Prettier if added.
- Imports: use path alias `@/*` (see `tsconfig.json`).
- Styling: Tailwind CSS via `src/app/globals.css`; keep utility classes readable and grouped logically.
- Components/utils: colocate UI under `src/app` or future `src/components`; helpers in `src/lib` (e.g., `src/lib/utils.ts`).

## Testing Guidelines
- Frameworks: Not configured yet. Recommended: Vitest + React Testing Library.
- Naming: `*.test.ts` or `*.test.tsx` near source or in `__tests__/`.
- Example run (after setup): `npm run test` and `npm run test:coverage`.

## Commit & Pull Request Guidelines
- Commits: Use clear, imperative messages. Prefer Conventional Commits (e.g., `feat: add itinerary card`, `fix: correct date parsing`).
- PRs: Include purpose, linked issues, and screenshots for UI changes. Note any migrations or env var changes.
- Checks: Ensure `npm run lint` passes and app builds locally (`npm run build`).

## Security & Configuration Tips
- Env vars: Use `.env.local` for secrets; never commit `.env*`.
- Node/Next: Use LTS Node compatible with Next 15; install deps with `npm ci` in CI.
- Accessibility: Run ESLint’s a11y rules and verify keyboard/focus for new components.

