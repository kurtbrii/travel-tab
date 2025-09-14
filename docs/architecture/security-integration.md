# Security Integration

- Authentication: Verify JWT on server in route handlers; never trust only the cookie in middleware.
- Authorization: Repos always filter by `userId`; services double-check ownership and throw `FORBIDDEN` if mismatched.
- Cookies: `httpOnly`, `sameSite:'lax'`, `secure: production`, `path:'/'`.
- JWT: HS256, 7d expiry; minimal claims; rotate secret per environment.
- Passwords: bcrypt with reasonable cost; never log sensitive data.
- Input Validation: Zod for all external inputs; reject early with helpful messages.
- Logging: Redact tokens/emails; structured error logs via `server/logging/logger.ts`.
- Secrets/Env: Validate `DATABASE_URL`, `JWT_SECRET` in `server/config/env.ts`; never commit `.env*`.
- Future hardening: rate limiting, CSRF token if cross-site forms, basic audit events.
