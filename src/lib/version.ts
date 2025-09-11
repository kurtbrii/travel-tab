// Resolve an app version string in a way that works across
// local dev, builds, and serverless environments.
// Priority:
// 1) Explicit env var `NEXT_PUBLIC_APP_VERSION`
// 2) Vercel/CI commit sha env vars (shortened)
// 3) package.json version (best-effort)
// 4) Fallback 'dev'

function fromEnv(): string | undefined {
  const explicit = process.env.NEXT_PUBLIC_APP_VERSION?.trim()
  if (explicit) return explicit

  const sha =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    process.env.COMMIT_SHA
  if (sha) return sha.slice(0, 7)
}

// Synchronous export: keep it simple and robust across environments.
// Prefer env-provided value; otherwise use a safe default.
export const appVersion: string = fromEnv() ?? 'dev'
