Title: Authentication Posture (JWT Cookie; Verify on Server)
Status: Accepted
Date: 2025-09-09

Context:
- Middleware (Edge) cannot verify HMAC JWT with `jsonwebtoken`.
- Need reliable authZ for trip-scoped data.

Decision:
- Keep JWT in httpOnly cookie (`auth-token`).
- Verify JWT inside route handlers/services via `getCurrentUser()`.
- Middleware uses cookie presence only for UX redirects.

Alternatives:
- NextAuth: good DX, but changes scope; can be adopted later.
- Edge JWT verification with Web Crypto: possible but adds complexity now.

Consequences:
- Users may see protected UI briefly if they have a stale cookie, but API denies access.
- Clear, testable auth path on the server.

References:
- docs/architecture.md#security-integration

