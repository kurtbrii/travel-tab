import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock('@/server/services/chat.service', () => ({
  ChatService: {
    list: vi.fn(),
    post: vi.fn(),
  },
}))

import { getCurrentUser } from '@/lib/auth'
import { ChatService } from '@/server/services/chat.service'
import { GET, POST } from '../../messages/route'
import { resetAll } from '@/server/middleware/rate-limit'

describe('/api/trips/[id]/borderbuddy/chat/messages route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetAll()
  })

  it('GET returns messages for authorized user', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })
    vi.mocked(ChatService.list).mockResolvedValue({ ok: true, messages: [{ id: 'm1', role: 'User', content: 'hi' }] } as any)

    const res = await GET(new Request('http://localhost'), { params: Promise.resolve({ id: 't1' }) } as any)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data.messages)).toBe(true)
  })

  it('POST creates user/assistant messages and returns 201', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })
    vi.mocked(ChatService.post).mockResolvedValue({ ok: true, saved: { id: 'mu' }, assistant: { id: 'ma', content: 'Informational guidance only\n\nHello!' } } as any)

    const req = new Request('http://localhost', { method: 'POST', body: JSON.stringify({ content: 'Hello', kind: 'Chat' }) })
    const res = await POST(req as any, { params: Promise.resolve({ id: 't1' }) } as any)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.assistant.content).toMatch(/Informational guidance only/i)
  })

  it('returns 401 when unauthenticated', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue(null)
    const res = await GET(new Request('http://localhost'), { params: Promise.resolve({ id: 't1' }) } as any)
    expect(res.status).toBe(401)
  })

  it('POST is rate limited with 429 after threshold', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })
    vi.mocked(ChatService.post).mockResolvedValue({ ok: true, saved: { id: 'mu' }, assistant: { id: 'ma', content: 'Informational guidance only\n\nHello!' } } as any)

    const doPost = () => POST(new Request('http://localhost', { method: 'POST', body: JSON.stringify({ content: 'Hi', kind: 'Chat' }) }) as any, { params: Promise.resolve({ id: 't1' }) } as any)

    // Limit is 5 per minute; the 6th should be 429
    const r1 = await doPost(); expect(r1.status).toBe(201)
    const r2 = await doPost(); expect(r2.status).toBe(201)
    const r3 = await doPost(); expect(r3.status).toBe(201)
    const r4 = await doPost(); expect(r4.status).toBe(201)
    const r5 = await doPost(); expect(r5.status).toBe(201)
    const r6 = await doPost(); expect(r6.status).toBe(429)
  })
})
