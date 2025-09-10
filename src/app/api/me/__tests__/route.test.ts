import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/server/services/auth.service', () => ({
  AuthService: {
    getCurrentUser: vi.fn(),
  },
}))

import { AuthService } from '@/server/services/auth.service'
import { GET } from '../route'

describe('GET /api/me', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('401 when not authenticated', async () => {
    vi.mocked((AuthService as any).getCurrentUser).mockResolvedValue(null)
    const res = await GET()
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.error.code).toBe('UNAUTHORIZED')
  })

  it('200 with user when authenticated', async () => {
    vi.mocked((AuthService as any).getCurrentUser).mockResolvedValue({ id: 'u1', email: 'a@b.com', fullName: 'A' })
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.user.id).toBe('u1')
  })
})

