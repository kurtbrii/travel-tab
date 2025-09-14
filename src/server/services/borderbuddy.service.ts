import { TripsRepo } from '@/server/repositories/trips.repo'
import { BorderBuddyRepo } from '@/server/repositories/borderbuddy.repo'

export const BorderBuddyService = {
  async enable(tripId: string, userId: string) {
    // Verify trip ownership
    const trip = await TripsRepo.findById(tripId)
    if (!trip) return { ok: false as const, code: 'NOT_FOUND' as const }
    if (trip.userId !== userId) return { ok: false as const, code: 'FORBIDDEN' as const }

    // Idempotent creation
    const existing = await BorderBuddyRepo.findByTripId(tripId)
    if (existing) return { ok: true as const, created: false as const, borderBuddy: existing }

    try {
      const created = await BorderBuddyRepo.createForTrip(tripId)
      return { ok: true as const, created: true as const, borderBuddy: created }
    } catch (err: any) {
      // If unique violation raced, return existing
      const again = await BorderBuddyRepo.findByTripId(tripId)
      if (again) return { ok: true as const, created: false as const, borderBuddy: again }
      return { ok: false as const, code: 'SERVER_ERROR' as const, error: err }
    }
  }
}

