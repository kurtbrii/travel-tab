import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock('@/lib/trips', () => ({
  getTripsByUser: vi.fn(),
  createTrip: vi.fn(),
}))

import { getCurrentUser } from '@/lib/auth'
import { getTripsByUser, createTrip } from '@/lib/trips'
import { GET, POST } from '../route'

describe('/api/trips route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('GET 401 when unauthenticated', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue(null)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('GET returns trips for current user', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })
    vi.mocked(getTripsByUser as any).mockResolvedValue([
      { id: 't1', destinationCountry: 'US', purpose: 'Business', startDate: '2025-01-01', endDate: '2025-01-02', status: 'Planning', statusColor: '', modules: [], userId: 'u1' },
    ])
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(getTripsByUser).toHaveBeenCalledWith('u1')
  })

  it('POST 401 when unauthenticated', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue(null)
    const req = new Request('http://localhost/api/trips', { method: 'POST', body: JSON.stringify({}) })
    const res = await POST(req as any)
    expect(res.status).toBe(401)
  })

  it('POST 201 on success', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })
    vi.mocked(createTrip as any).mockResolvedValue({ id: 't1' })
    const req = new Request('http://localhost/api/trips', { method: 'POST', body: JSON.stringify({ destinationCountry: 'US', purpose: 'Business', startDate: '2025-01-01', endDate: '2025-01-02' }) })
    const res = await POST(req as any)
    expect(res.status).toBe(201)
  })
})

