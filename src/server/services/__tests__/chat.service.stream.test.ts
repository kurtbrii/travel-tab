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

vi.mock('@/server/services/llm', async () => {
  const actual = await vi.importActual<any>('@/server/services/llm')
  return {
    ...actual,
    askChatStream: vi.fn(),
    buildSystemPrompt: vi.fn(() => 'You are BorderBuddy.'),
  }
})

import { TripsRepo } from '@/server/repositories/trips.repo'
import { BorderBuddyRepo } from '@/server/repositories/borderbuddy.repo'
import { ChatRepo } from '@/server/repositories/chat.repo'
import { askChatStream } from '@/server/services/llm'
import { ChatService } from '@/server/services/chat.service'

describe('ChatService.postStream', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(TripsRepo.findById).mockResolvedValue({ id: 't1', userId: 'u1' } as any)
    vi.mocked(BorderBuddyRepo.findByTripId).mockResolvedValue({ id: 'bb1', tripId: 't1' } as any)
    vi.mocked(ChatRepo.listMessages).mockResolvedValue([] as any)
    vi.mocked(ChatRepo.create).mockImplementation(async (_bbId: string, data: any) => ({ id: Math.random().toString(), borderBuddyId: 'bb1', createdAt: new Date(), ...data }))
  })

  it('streams deltas and persists final message with disclaimer', async () => {
    async function* gen() {
      yield 'Hello'
      yield ' world'
      return 'Hello world'
    }
    vi.mocked(askChatStream as any).mockImplementation(gen)

    const events: any[] = []
    const res = await ChatService.postStream('t1', 'u1', { content: 'Hi', kind: 'Chat' }, (e) => events.push(e))
    expect(res.ok).toBe(true)
    // Events include start, deltas, and complete
    expect(events.some(e => e.type === 'start')).toBe(true)
    expect(events.filter(e => e.type === 'delta').length).toBeGreaterThan(0)
    const complete = events.find(e => e.type === 'complete')
    expect(complete?.data?.content).toMatch(/Informational guidance only/i)
    expect(complete?.data?.content).toMatch(/Hello world/)
    expect(ChatRepo.create).toHaveBeenCalledTimes(2)
  })

  it('emits error on provider failure', async () => {
    async function* gen() { throw new Error('boom') }
    vi.mocked(askChatStream as any).mockImplementation(gen)
    const events: any[] = []
    const res = await ChatService.postStream('t1', 'u1', { content: 'Hi', kind: 'Chat' }, (e) => events.push(e))
    expect(res.ok).toBe(false)
    const errEvt = events.find(e => e.type === 'error')
    expect(errEvt).toBeTruthy()
  })
})

