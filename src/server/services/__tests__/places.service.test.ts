import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/server/repositories/trips.repo', () => ({
  TripsRepo: { findById: vi.fn() },
}))

vi.mock('@/server/repositories/borderbuddy.repo', () => ({
  BorderBuddyRepo: { findByTripId: vi.fn() },
}))

vi.mock('@/server/repositories/places.repo', () => ({
  PlacesRepo: { getLatest: vi.fn(), upsert: vi.fn() },
}))

import { TripsRepo } from '@/server/repositories/trips.repo'
import { BorderBuddyRepo } from '@/server/repositories/borderbuddy.repo'
import { PlacesRepo } from '@/server/repositories/places.repo'
import { PlacesService } from '@/server/services/places.service'

describe('PlacesService.generate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(TripsRepo.findById).mockResolvedValue({ id: 't1', userId: 'u1' } as any)
    vi.mocked(BorderBuddyRepo.findByTripId).mockResolvedValue({ id: 'bb1', tripId: 't1' } as any)
    vi.mocked(PlacesRepo.upsert).mockImplementation(async (_bb: string, items: any) => ({ borderBuddyId: 'bb1', items, generatedAt: new Date() } as any))
  })

  it('persists deterministic placeholder items and returns them', async () => {
    const res = await PlacesService.generate('t1', 'u1')
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(Array.isArray(res.places.items)).toBe(true)
      expect(res.places.items.length).toBeGreaterThan(0)
      expect(PlacesRepo.upsert).toHaveBeenCalled()
    }
  })
})

