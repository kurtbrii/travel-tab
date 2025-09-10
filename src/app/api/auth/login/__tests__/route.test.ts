import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/server/services/auth.service', () => ({
  AuthService: {
    login: vi.fn(),
  },
}))

import { AuthService } from '@/server/services/auth.service'
import { POST } from '../route'

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 for invalid input', async () => {
    const req = new Request('http://localhost/api/auth/login', { method: 'POST', body: JSON.stringify({}) })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.error.code).toBe('VALIDATION_ERROR')
  })

  it('returns 401 for invalid credentials', async () => {
    vi.mocked((AuthService as any).login).mockResolvedValue({ ok: false, code: 'INVALID_CREDENTIALS' })
    const req = new Request('http://localhost/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'a@b.com', password: 'x' }) })
    const res = await POST(req)
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error.code).toBe('INVALID_CREDENTIALS')
  })

  it('sets cookie and returns 200 on success', async () => {
    vi.mocked((AuthService as any).login).mockResolvedValue({ ok: true, token: 'token:abc', user: { id: 'u1', email: 'a@b.com', fullName: 'A', createdAt: new Date().toISOString() } })
    const req = new Request('http://localhost/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'a@b.com', password: 'Secret123!' }) })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const setCookie = res.headers.get('set-cookie')
    expect(setCookie).toMatch(/auth-token=/)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.user.id).toBe('u1')
  })
})

