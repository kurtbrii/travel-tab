export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.trim().length === 0) {
    throw new Error("JWT_SECRET is not set. Define it in your environment.")
  }
  return secret
}

export const Env = {
  jwtSecret: (): string => getJwtSecret(),
  // Optional: OpenAI API key. When missing, LLM features gracefully fallback.
  openaiApiKey: (): string | null => {
    const key = process.env.OPENAI_API_KEY
    return key && key.trim().length > 0 ? key : null
  },
  // Model hint for chat; safe default if unset.
  openaiModel: (): string => process.env.OPENAI_MODEL || 'gpt-4o-mini',
  // Network timeout for LLM calls in ms
  openaiTimeoutMs: (): number => {
    const v = Number(process.env.OPENAI_TIMEOUT_MS || 12000)
    return Number.isFinite(v) && v > 0 ? v : 12000
  },
}
