import { TripsRepo } from '@/server/repositories/trips.repo'
import { BorderBuddyRepo } from '@/server/repositories/borderbuddy.repo'
import { ChatRepo } from '@/server/repositories/chat.repo'

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

    const userMsg = await ChatRepo.create(bb.id, { role: 'User', kind: input.kind, content: input.content })
    // Placeholder assistant reply with disclaimer; replace with LLM integration
    const disclaimer = 'Informational guidance only. Verify details with official or trusted sources.'
    const assistantContent = `${disclaimer}\n\nYou said: ${input.content}`
    const assistant = await ChatRepo.create(bb.id, { role: 'Assistant', kind: input.kind, content: assistantContent })

    return { ok: true as const, saved: userMsg, assistant }
  }
}

