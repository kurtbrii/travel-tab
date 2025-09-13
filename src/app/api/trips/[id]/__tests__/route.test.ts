import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock('@/lib/trips', () => ({
  getTripById: vi.fn(),
  deleteTripById: vi.fn(),
}))

import { getCurrentUser } from '@/lib/auth'
import { getTripById, deleteTripById } from '@/lib/trips'
import { DELETE } from '../route'

describe('DELETE /api/trips/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('401 when unauthenticated', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue(null)
    const res = await DELETE(new Request('http://localhost/api/trips/t1') as any, { params: { id: 't1' } } as any)
    expect(res.status).toBe(401)
  })

  it('404 when trip not found', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })
    vi.mocked(getTripById as any).mockResolvedValue(null)
    const res = await DELETE(new Request('http://localhost/api/trips/missing') as any, { params: { id: 'missing' } } as any)
    expect(res.status).toBe(404)
  })

  it('403 when not owner', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })
    vi.mocked(getTripById as any).mockResolvedValue({ id: 't1', userId: 'u2' })
    const res = await DELETE(new Request('http://localhost/api/trips/t1') as any, { params: { id: 't1' } } as any)
    expect(res.status).toBe(403)
  })

  it('204 on successful delete', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })
    vi.mocked(getTripById as any).mockResolvedValue({ id: 't1', userId: 'u1' })
    vi.mocked(deleteTripById as any).mockResolvedValue(undefined)
    const res = await DELETE(new Request('http://localhost/api/trips/t1') as any, { params: { id: 't1' } } as any)
    expect(res.status).toBe(204)
    expect(deleteTripById).toHaveBeenCalledWith('t1')
  })
})

