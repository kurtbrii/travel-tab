import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/server/repositories/trips.repo', () => ({
  TripsRepo: {
    findById: vi.fn(),
  }
}))

vi.mock('@/server/repositories/borderbuddy.repo', () => ({
  BorderBuddyRepo: {
    findByTripId: vi.fn(),
    createForTrip: vi.fn(),
  }
}))

import { TripsRepo } from '@/server/repositories/trips.repo'
import { BorderBuddyRepo } from '@/server/repositories/borderbuddy.repo'
import { BorderBuddyService } from '@/server/services/borderbuddy.service'

describe('BorderBuddyService.enable', () => {
  const tripId = 't1'
  const ownerId = 'u1'

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns NOT_FOUND when trip is missing', async () => {
    ;(TripsRepo.findById as any).mockResolvedValue(null)
    const res = await BorderBuddyService.enable(tripId, ownerId)
    expect(res.ok).toBe(false)
    // @ts-expect-error
    expect(res.code).toBe('NOT_FOUND')
  })

  it('returns FORBIDDEN when user does not own the trip', async () => {
    ;(TripsRepo.findById as any).mockResolvedValue({ id: tripId, userId: 'other' })
    const res = await BorderBuddyService.enable(tripId, ownerId)
    expect(res.ok).toBe(false)
    // @ts-expect-error
    expect(res.code).toBe('FORBIDDEN')
  })

  it('creates when missing and returns created=true', async () => {
    ;(TripsRepo.findById as any).mockResolvedValue({ id: tripId, userId: ownerId })
    ;(BorderBuddyRepo.findByTripId as any).mockResolvedValue(null)
    ;(BorderBuddyRepo.createForTrip as any).mockResolvedValue({ id: 'bb1', tripId, enabledAt: new Date() })
    const res = await BorderBuddyService.enable(tripId, ownerId)
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.created).toBe(true)
      expect(res.borderBuddy.tripId).toBe(tripId)
    }
  })

  it('is idempotent and returns existing with created=false', async () => {
    ;(TripsRepo.findById as any).mockResolvedValue({ id: tripId, userId: ownerId })
    ;(BorderBuddyRepo.findByTripId as any).mockResolvedValue({ id: 'bb1', tripId, enabledAt: new Date() })
    const res = await BorderBuddyService.enable(tripId, ownerId)
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.created).toBe(false)
      expect(res.borderBuddy.tripId).toBe(tripId)
    }
  })
})

