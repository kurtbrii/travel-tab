import { TripsRepo } from '@/server/repositories/trips.repo'
import { BorderBuddyRepo } from '@/server/repositories/borderbuddy.repo'
import { ChatRepo } from '@/server/repositories/chat.repo'
import { askChat, askChatStream, buildSystemPrompt } from '@/server/services/llm'
import type { ChatStreamEvent } from '@/server/contracts/chat.dto'

export const ChatService = {
  async list(tripId: string, userId: string, limit = 50) {
    const trip = await TripsRepo.findById(tripId)
    if (!trip) return { ok: false as const, code: 'NOT_FOUND' as const }
    if (trip.userId !== userId) return { ok: false as const, code: 'FORBIDDEN' as const }
    const bb = await BorderBuddyRepo.findByTripId(tripId)
    if (!bb) return { ok: false as const, code: 'NOT_FOUND' as const, message: 'BorderBuddy not enabled' }
    const messages = await ChatRepo.listMessages(bb.id, limit)
    return { ok: true as const, messages }
  },

  async post(tripId: string, userId: string, input: { content: string; kind: string }) {
    const trip = await TripsRepo.findById(tripId)
    if (!trip) return { ok: false as const, code: 'NOT_FOUND' as const }
    if (trip.userId !== userId) return { ok: false as const, code: 'FORBIDDEN' as const }
    const bb = await BorderBuddyRepo.findByTripId(tripId)
    if (!bb) return { ok: false as const, code: 'NOT_FOUND' as const, message: 'BorderBuddy not enabled' }

    // Persist user message first
    const userMsg = await ChatRepo.create(bb.id, { role: 'User', kind: input.kind, content: input.content })

    // Build bounded history (include last messages and current user message)
    const recent = await ChatRepo.listMessages(bb.id, 12)
    const history = recent
      .slice() // copy
      .reverse() // oldest first
      .map((m) => ({
        role: m.role === 'Assistant' ? 'assistant' as const : 'user' as const,
        content: m.content,
      }))

    const system = buildSystemPrompt({})
    const messages = [{ role: 'system' as const, content: system }, ...history]

    const disclaimer = 'Informational guidance only. Verify details with official or trusted sources.'

    // Ask LLM with timeout + retries; gracefully fallback on failure
    const llmContent = await askChat(messages, { retries: 2 })
    const finalContent = llmContent
      ? `${disclaimer}\n\n${llmContent}`
      : `${disclaimer}\n\nI can offer general ideas to help your planning. Here are some suggestions based on your message: "${input.content}".`

    const assistant = await ChatRepo.create(bb.id, { role: 'Assistant', kind: input.kind, content: finalContent })

    return { ok: true as const, saved: userMsg, assistant }
  },

  // Streaming version: emits events and persists final assistant message when complete
  async postStream(
    tripId: string,
    userId: string,
    input: { content: string; kind: string },
    onEvent: (evt: ChatStreamEvent) => void
  ) {
    const trip = await TripsRepo.findById(tripId)
    if (!trip) return { ok: false as const, code: 'NOT_FOUND' as const }
    if (trip.userId !== userId) return { ok: false as const, code: 'FORBIDDEN' as const }
    const bb = await BorderBuddyRepo.findByTripId(tripId)
    if (!bb) return { ok: false as const, code: 'NOT_FOUND' as const, message: 'BorderBuddy not enabled' }

    const userMsg = await ChatRepo.create(bb.id, { role: 'User', kind: input.kind, content: input.content })

    // Build history
    const recent = await ChatRepo.listMessages(bb.id, 12)
    const history = recent
      .slice()
      .reverse()
      .map((m) => ({
        role: m.role === 'Assistant' ? 'assistant' as const : 'user' as const,
        content: m.content,
      }))
    const system = buildSystemPrompt({})
    const messages = [{ role: 'system' as const, content: system }, ...history]

    const disclaimer = 'Informational guidance only. Verify details with official or trusted sources.'

    onEvent({ type: 'start', data: { tempId: userMsg.id } })

    let accumulated = ''
    try {
      for await (const delta of askChatStream(messages, { retries: 2 })) {
        if (!delta) break
        accumulated += delta
        onEvent({ type: 'delta', data: { content: delta } })
      }
    } catch (err: any) {
      onEvent({ type: 'error', data: { code: 'PROVIDER_ERROR', message: String(err?.message || err || 'error') } })
      return { ok: false as const, code: 'SERVER_ERROR' as const }
    }

    const base = accumulated?.trim() || ''
    const hasDisclaimer = base.toLowerCase().startsWith(disclaimer.toLowerCase())
    const finalContent = hasDisclaimer ? base : `${disclaimer}\n\n${base || `I can offer general ideas to help your planning. Here are some suggestions based on your message: "${input.content}".`}`
    const assistant = await ChatRepo.create(bb.id, { role: 'Assistant', kind: input.kind, content: finalContent })
    onEvent({ type: 'complete', data: { id: assistant.id, content: finalContent } })

    return { ok: true as const, saved: userMsg, assistant }
  }
}
