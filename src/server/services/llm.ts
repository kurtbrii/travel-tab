import { Env } from '@/server/config/env'

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

export type LlmOptions = {
  timeoutMs?: number
  retries?: number
}

export async function askChat(messages: ChatMessage[], opts: LlmOptions = {}): Promise<string | null> {
  const apiKey = Env.openaiApiKey()
  if (!apiKey) return null

  const timeoutMs = opts.timeoutMs ?? Env.openaiTimeoutMs()
  const retries = opts.retries ?? 2
  const model = Env.openaiModel()

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  const body = JSON.stringify({ model, messages })

  let attempt = 0
  let lastErr: any

  while (attempt <= retries) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body,
        signal: controller.signal,
      })
      if (!res.ok) {
        // Retry on 429/5xx
        if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
          attempt++
          await backoff(attempt)
          continue
        }
        lastErr = new Error(`OpenAI error status ${res.status}`)
        break
      }
      const json: any = await res.json()
      const content: string | undefined = json?.choices?.[0]?.message?.content
      clearTimeout(timer)
      return content ?? null
    } catch (err: any) {
      // AbortError or network error; retry with backoff
      lastErr = err
      attempt++
      if (attempt > retries) break
      await backoff(attempt)
      continue
    }
  }

  clearTimeout(timer)
  return null
}

async function backoff(attempt: number) {
  const ms = Math.min(1000 * Math.pow(2, attempt), 4000)
  await new Promise((r) => setTimeout(r, ms))
}

export function buildSystemPrompt(input: { destination?: string | null; dates?: string | null }) {
  const lines = [
    'You are BorderBuddy, a concise, friendly travel assistant.',
    'Provide practical, safe suggestions tailored to the trip context.',
    'Avoid fabricating booking details. Do not claim real-time data.',
    'Format with short paragraphs or bullet points as appropriate.',
  ]
  if (input.destination) lines.push(`Destination: ${input.destination}`)
  if (input.dates) lines.push(`Dates: ${input.dates}`)
  return lines.join('\n')
}

