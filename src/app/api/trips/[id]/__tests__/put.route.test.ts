import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock('@/lib/trips', () => ({
  getTripById: vi.fn(),
  updateTrip: vi.fn(),
}))

import { getCurrentUser } from '@/lib/auth'
import { getTripById, updateTrip } from '@/lib/trips'
import { PUT } from '../route'

describe('PUT /api/trips/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const body = (obj: any) => new Request('http://localhost/api/trips/t1', { method: 'PUT', body: JSON.stringify(obj) }) as any

  it('401 when unauthenticated', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue(null)
    const res = await PUT(body({}), { params: { id: 't1' } } as any)
    expect(res.status).toBe(401)
  })

  it('404 when trip not found', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })
    vi.mocked(getTripById as any).mockResolvedValue(null)
    const res = await PUT(body({}), { params: { id: 't1' } } as any)
    expect(res.status).toBe(404)
  })

  it('403 when not owner', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })
    vi.mocked(getTripById as any).mockResolvedValue({ id: 't1', userId: 'u2' })
    const res = await PUT(body({}), { params: { id: 't1' } } as any)
    expect(res.status).toBe(403)
  })

  it('400 when validation fails', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })
    vi.mocked(getTripById as any).mockResolvedValue({ id: 't1', userId: 'u1' })
    vi.mocked(updateTrip as any).mockRejectedValue(new Error('Invalid destination country code.'))
    const res = await PUT(body({ destinationCountry: 'XX', purpose: 'a', startDate: '2025-01-02', endDate: '2025-01-01' }), { params: { id: 't1' } } as any)
    expect(res.status).toBe(400)
  })

  it('200 on successful update', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })
    vi.mocked(getTripById as any).mockResolvedValue({ id: 't1', userId: 'u1' })
    const updated = { id: 't1', userId: 'u1', purpose: 'Work', destinationCountry: 'US', startDate: '2025-01-01', endDate: '2025-01-02', status: 'Planning', statusColor: '', modules: [], createdAt: new Date(), updatedAt: new Date() }
    vi.mocked(updateTrip as any).mockResolvedValue(updated)
    const res = await PUT(body({ destinationCountry: 'US', purpose: 'Work', startDate: '2025-01-01', endDate: '2025-01-02' }), { params: { id: 't1' } } as any)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toMatchObject({ id: 't1', destinationCountry: 'US', purpose: 'Work' })
  })
})

