import { TripsRepo } from '@/server/repositories/trips.repo'
import { BorderBuddyRepo } from '@/server/repositories/borderbuddy.repo'
import { PlacesRepo } from '@/server/repositories/places.repo'

type PlaceItem = { name: string; description: string; tags?: string[] }

export const PlacesService = {
  async get(tripId: string, userId: string) {
    const trip = await TripsRepo.findById(tripId)
    if (!trip) return { ok: false as const, code: 'NOT_FOUND' as const }
    if (trip.userId !== userId) return { ok: false as const, code: 'FORBIDDEN' as const }
    const bb = await BorderBuddyRepo.findByTripId(tripId)
    if (!bb) return { ok: false as const, code: 'NOT_FOUND' as const, message: 'BorderBuddy not enabled' }
    const latest = await PlacesRepo.getLatest(bb.id)
    return { ok: true as const, places: latest ? { generatedAt: latest.generatedAt, items: latest.items as PlaceItem[] } : { generatedAt: null, items: [] } }
  },

  async generate(tripId: string, userId: string, seed?: string) {
    const trip = await TripsRepo.findById(tripId)
    if (!trip) return { ok: false as const, code: 'NOT_FOUND' as const }
    if (trip.userId !== userId) return { ok: false as const, code: 'FORBIDDEN' as const }
    const bb = await BorderBuddyRepo.findByTripId(tripId)
    if (!bb) return { ok: false as const, code: 'NOT_FOUND' as const, message: 'BorderBuddy not enabled' }

    // Placeholder generation logic; replace with LLM-backed generation
    const items: PlaceItem[] = [
      { name: 'Central Park', description: 'Iconic urban park for walks and picnics', tags: ['scenic','relax'] },
      { name: 'City Museum', description: 'Exhibits on local history and culture', tags: ['history','indoor'] },
    ]
    const saved = await PlacesRepo.upsert(bb.id, items as any)
    return { ok: true as const, places: { generatedAt: saved.generatedAt, items } }
  }
}

