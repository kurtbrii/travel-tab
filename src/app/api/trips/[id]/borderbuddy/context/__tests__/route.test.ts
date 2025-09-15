import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock('@/server/services/context.service', () => ({
  ContextService: {
    get: vi.fn(),
    save: vi.fn(),
  },
}))

import { getCurrentUser } from '@/lib/auth'
import { ContextService } from '@/server/services/context.service'
import { GET, PUT } from '../route'

describe('/api/trips/[id]/borderbuddy/context route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('GET returns context for authorized user', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })
    vi.mocked(ContextService.get).mockResolvedValue({ ok: true, context: { interests: [], regions: [], budget: null, style: null, constraints: [] } } as any)

    const res = await GET(new Request('http://localhost'), { params: Promise.resolve({ id: 't1' }) } as any)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.context).toBeDefined()
  })

  it('PUT saves context and returns 200', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })
    vi.mocked(ContextService.save).mockResolvedValue({ ok: true, context: { interests: ['food'], regions: ['paris'], budget: 'mid', style: null, constraints: [] } } as any)

    const req = new Request('http://localhost', { method: 'PUT', body: JSON.stringify({ interests: ['food'], regions: ['paris'], budget: 'mid', constraints: [] }) })
    const res = await PUT(req as any, { params: Promise.resolve({ id: 't1' }) } as any)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.context.interests).toContain('food')
  })

  it('returns 401 when unauthenticated', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue(null)
    const res = await GET(new Request('http://localhost'), { params: Promise.resolve({ id: 't1' }) } as any)
    expect(res.status).toBe(401)
  })
})

