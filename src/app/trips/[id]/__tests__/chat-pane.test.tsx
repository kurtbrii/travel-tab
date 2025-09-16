import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import ChatPane from '../chat-pane'

function makeStream(events: any[]) {
  const encoder = new TextEncoder()
  return new ReadableStream<Uint8Array>({
    start(controller) {
      events.forEach((e, i) => {
        setTimeout(() => controller.enqueue(encoder.encode(`data: ${JSON.stringify(e)}\n\n`)), i * 5)
      })
      setTimeout(() => controller.close(), events.length * 5 + 5)
    }
  })
}

describe('ChatPane', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows typing indicator during stream and renders completion', async () => {
    const fetchMock = vi.spyOn(global, 'fetch' as any)
    // Mock BorderBuddy status check
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: { enabled: true } }), { headers: { 'Content-Type': 'application/json' } }))
    // Mock context (required to show chat interface)
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({
      success: true,
      data: {
        context: {
          interests: ['museums', 'food'],
          regions: ['Tokyo'],
          budget: '$1,000 - $2,500',
          style: 'Cultural',
          constraints: []
        }
      }
    }), { headers: { 'Content-Type': 'application/json' } }))
    // Mock messages
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: { messages: [] } }), { headers: { 'Content-Type': 'application/json' } }))

    // Use fake timers to control loading state
    vi.useFakeTimers()
    // POST returns SSE stream
    const stream = makeStream([
      { type: 'start', data: { tempId: 'tmp1' } },
      { type: 'delta', data: { content: 'Hello' } },
      { type: 'delta', data: { content: ' world' } },
      { type: 'complete', data: { id: 'a1', content: 'Informational guidance only. Verify details with official or trusted sources.\n\nHello world' } },
    ])
    fetchMock.mockResolvedValueOnce(new Response(stream as any, { headers: { 'Content-Type': 'text/event-stream' } }) as any)

    render(<ChatPane tripId="t1" />)

    // Fast forward past loading state
    act(() => {
      vi.advanceTimersByTime(100)
    })

    const textarea = await screen.findByLabelText(/message borderbuddy/i)
    fireEvent.change(textarea, { target: { value: 'Hi' } })
    fireEvent.submit(textarea.closest('form')!)

    // During stream, indicator should appear
    await screen.findByText(/assistant/i)

    // After completion, full assistant message should be rendered
    await waitFor(() => expect(screen.getByText(/Hello world/)).toBeInTheDocument())

    // Restore real timers
    vi.useRealTimers()
  }, 10000)

  it('shows retry on error and re-attempts without duplicating', async () => {
    const fetchMock = vi.spyOn(global, 'fetch' as any)
    // Mock BorderBuddy status check
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: { enabled: true } }), { headers: { 'Content-Type': 'application/json' } }))
    // Mock context (required to show chat interface)
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({
      success: true,
      data: {
        context: {
          interests: ['hiking'],
          regions: [],
          budget: null,
          style: 'Adventure',
          constraints: []
        }
      }
    }), { headers: { 'Content-Type': 'application/json' } }))
    // GET messages
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: { messages: [] } }), { headers: { 'Content-Type': 'application/json' } }))

    // Use fake timers to control loading state
    vi.useFakeTimers()
    // First POST fails
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ success: false, error: { code: 'SERVER_ERROR', message: 'fail' } }), { status: 500, headers: { 'Content-Type': 'application/json' } }))
    // Second POST succeeds JSON fallback
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: { saved: { id: 'u1' }, assistant: { id: 'a1', content: 'Informational guidance only. Verify details with official or trusted sources.\n\nHello again' } } }), { headers: { 'Content-Type': 'application/json' } }))

    render(<ChatPane tripId="t1" />)

    // Fast forward past loading state
    act(() => {
      vi.advanceTimersByTime(100)
    })

    const textarea = await screen.findByLabelText(/message borderbuddy/i)
    fireEvent.change(textarea, { target: { value: 'Hi again' } })
    fireEvent.submit(textarea.closest('form')!)

    // Error appears
    await screen.findByText(/fail/i)
    // Click retry
    fireEvent.click(screen.getByRole('button', { name: /retry/i }))

    await waitFor(() => expect(screen.getByText(/Hello again/)).toBeInTheDocument())
    // Ensure only one user message shown
    const userBadges = screen.getAllByText('User')
    expect(userBadges.length).toBe(1)

    // Restore real timers
    vi.useRealTimers()
  }, 10000)
})

