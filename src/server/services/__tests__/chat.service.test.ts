import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/server/repositories/trips.repo', () => ({
  TripsRepo: { findById: vi.fn() },
}))

vi.mock('@/server/repositories/borderbuddy.repo', () => ({
  BorderBuddyRepo: { findByTripId: vi.fn() },
}))

vi.mock('@/server/repositories/chat.repo', () => ({
  ChatRepo: {
    listMessages: vi.fn(),
    create: vi.fn(),
  },
}))

vi.mock('@/server/services/llm', () => ({
  askChat: vi.fn(),
  buildSystemPrompt: vi.fn(() => 'You are BorderBuddy.'),
}))

import { TripsRepo } from '@/server/repositories/trips.repo'
import { BorderBuddyRepo } from '@/server/repositories/borderbuddy.repo'
import { ChatRepo } from '@/server/repositories/chat.repo'
import { askChat } from '@/server/services/llm'
import { ChatService } from '@/server/services/chat.service'

describe('ChatService.post', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(TripsRepo.findById).mockResolvedValue({ id: 't1', userId: 'u1' } as any)
    vi.mocked(BorderBuddyRepo.findByTripId).mockResolvedValue({ id: 'bb1', tripId: 't1' } as any)
    vi.mocked(ChatRepo.listMessages).mockResolvedValue([] as any)
    vi.mocked(ChatRepo.create).mockImplementation(async (_bbId: string, data: any) => ({ id: Math.random().toString(), borderBuddyId: 'bb1', createdAt: new Date(), ...data }))
  })

  it('saves user message and assistant reply from LLM with disclaimer and system prompt', async () => {
    vi.mocked(askChat).mockResolvedValue('Here are some travel ideas for you.')

    const res = await ChatService.post('t1', 'u1', { content: 'What should I do in Paris?', kind: 'Chat' })
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.assistant.content).toMatch(/Informational guidance only/i)
      expect(res.assistant.content).toMatch(/Here are some travel ideas/)
      expect(ChatRepo.create).toHaveBeenCalledTimes(2)
    }

    // assert askChat was called with a system prompt first
    expect(askChat).toHaveBeenCalled()
    const firstCallArgs = vi.mocked(askChat).mock.calls[0]?.[0] as any[]
    expect(firstCallArgs?.[0]?.role).toBe('system')
    expect(typeof firstCallArgs?.[0]?.content).toBe('string')
    expect(firstCallArgs?.[0]?.content.length).toBeGreaterThan(0)
  })

  it('falls back when LLM unavailable and still includes disclaimer', async () => {
    vi.mocked(askChat).mockResolvedValue(null)

    const res = await ChatService.post('t1', 'u1', { content: 'Suggest activities', kind: 'Chat' })
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.assistant.content).toMatch(/Informational guidance only/i)
      expect(res.assistant.content).toMatch(/Suggest activities/)
    }
  })
})
