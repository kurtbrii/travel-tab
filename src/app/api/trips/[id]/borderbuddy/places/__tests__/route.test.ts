import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock('@/server/services/places.service', () => ({
  PlacesService: {
    get: vi.fn(),
    generate: vi.fn(),
  },
}))

import { getCurrentUser } from '@/lib/auth'
import { PlacesService } from '@/server/services/places.service'
import { GET, POST } from '../route'
import { resetAll } from '@/server/middleware/rate-limit'

describe('/api/trips/[id]/borderbuddy/places route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetAll()
  })

  it('GET returns places for authorized user', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })
    vi.mocked(PlacesService.get).mockResolvedValue({ ok: true, places: { generatedAt: null, items: [] } } as any)

    const res = await GET(new Request('http://localhost'), { params: Promise.resolve({ id: 't1' }) } as any)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.places).toBeDefined()
  })

  it('POST generates places and returns 201', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })
    vi.mocked(PlacesService.generate).mockResolvedValue({ ok: true, places: { generatedAt: new Date(), items: [{ name: 'Central Park', description: 'Iconic' }] } } as any)

    const req = new Request('http://localhost', { method: 'POST', body: JSON.stringify({}) })
    const res = await POST(req as any, { params: Promise.resolve({ id: 't1' }) } as any)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.places.items.length).toBeGreaterThan(0)
  })

  it('returns 401 when unauthenticated', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue(null)
    const res = await GET(new Request('http://localhost'), { params: Promise.resolve({ id: 't1' }) } as any)
    expect(res.status).toBe(401)
  })

  it('POST is rate limited with 429 after threshold', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })
    vi.mocked(PlacesService.generate).mockResolvedValue({ ok: true, places: { generatedAt: new Date(), items: [] } } as any)

    const doPost = () => POST(new Request('http://localhost', { method: 'POST', body: JSON.stringify({}) }) as any, { params: Promise.resolve({ id: 't1' }) } as any)

    const r1 = await doPost(); expect(r1.status).toBe(201)
    const r2 = await doPost(); expect(r2.status).toBe(201)
    const r3 = await doPost(); expect(r3.status).toBe(201)
    const r4 = await doPost(); expect(r4.status).toBe(429)
  })
})
