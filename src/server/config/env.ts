export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.trim().length === 0) {
    throw new Error("JWT_SECRET is not set. Define it in your environment.")
  }
  return secret
}

export const Env = {
  jwtSecret: (): string => getJwtSecret(),
}

