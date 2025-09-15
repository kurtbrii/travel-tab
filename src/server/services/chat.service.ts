import { TripsRepo } from '@/server/repositories/trips.repo'
import { BorderBuddyRepo } from '@/server/repositories/borderbuddy.repo'
import { ChatRepo } from '@/server/repositories/chat.repo'
import { askChat, buildSystemPrompt } from '@/server/services/llm'

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
  }
}
