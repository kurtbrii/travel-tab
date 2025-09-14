import { TripsRepo } from '@/server/repositories/trips.repo'
import { BorderBuddyRepo } from '@/server/repositories/borderbuddy.repo'
import { ContextRepo } from '@/server/repositories/context.repo'

export const ContextService = {
  async get(tripId: string, userId: string) {
    const trip = await TripsRepo.findById(tripId)
    if (!trip) return { ok: false as const, code: 'NOT_FOUND' as const }
    if (trip.userId !== userId) return { ok: false as const, code: 'FORBIDDEN' as const }
    const bb = await BorderBuddyRepo.findByTripId(tripId)
    if (!bb) return { ok: false as const, code: 'NOT_FOUND' as const, message: 'BorderBuddy not enabled' }
    const ctx = await ContextRepo.getByBorderBuddyId(bb.id)
    return { ok: true as const, context: ctx ?? { interests: [], regions: [], budget: null, style: null, constraints: [] } }
  },

  async save(tripId: string, userId: string, input: { interests: string[]; regions: string[]; budget?: string | null; style?: string | null; constraints: string[] }) {
    const trip = await TripsRepo.findById(tripId)
    if (!trip) return { ok: false as const, code: 'NOT_FOUND' as const }
    if (trip.userId !== userId) return { ok: false as const, code: 'FORBIDDEN' as const }
    const bb = await BorderBuddyRepo.findByTripId(tripId)
    if (!bb) return { ok: false as const, code: 'NOT_FOUND' as const, message: 'BorderBuddy not enabled' }
    const saved = await ContextRepo.upsert(bb.id, {
      interests: input.interests ?? [],
      regions: input.regions ?? [],
      budget: input.budget ?? null,
      style: input.style ?? null,
      constraints: input.constraints ?? [],
    })
    return { ok: true as const, context: saved }
  }
}

