"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import MarkdownContent from '@/components/ui/markdown-content'

type ChatMessage = { id?: string; role: 'User' | 'Assistant'; content: string }

export default function ChatPane({ tripId }: { tripId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [assistantDraft, setAssistantDraft] = useState<string>('')
  const lastUserMessageRef = useRef<string | null>(null)
  const liveRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        let res = await fetch(`/api/trips/${encodeURIComponent(tripId)}/borderbuddy/chat/messages`)
        const data = await res.json()
        if (!isMounted) return
        if (data?.success && Array.isArray(data.data?.messages)) {
          setMessages(data.data.messages)
          return
        }
        // If not enabled, enable automatically then retry once
        if (!data?.success && res.status === 404) {
          await fetch(`/api/trips/${encodeURIComponent(tripId)}/borderbuddy`, { method: 'POST' })
          res = await fetch(`/api/trips/${encodeURIComponent(tripId)}/borderbuddy/chat/messages`)
          const again = await res.json().catch(() => null)
          if (again?.success && Array.isArray(again.data?.messages)) {
            setMessages(again.data.messages)
          }
        }
      } catch {}
    }
    load()
    return () => { isMounted = false }
  }, [tripId])

  const announce = (text: string) => {
    if (liveRef.current) {
      liveRef.current.textContent = text
    }
  }

  const handleSend = useCallback(async (content?: string, opts?: { isRetry?: boolean }) => {
    const bodyContent = (content ?? input).trim()
    if (!bodyContent || isStreaming) return
    setError(null)
    setAssistantDraft('')
    setIsStreaming(true)
    announce('Assistant is typing...')
    lastUserMessageRef.current = bodyContent
    if (!opts?.isRetry) {
      setMessages((prev) => [...prev, { role: 'User', content: bodyContent }])
    }

    try {
      let res = await fetch(`/api/trips/${encodeURIComponent(tripId)}/borderbuddy/chat/messages?stream=1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify({ content: bodyContent, kind: 'Chat' }),
      })

      const ctype = res.headers.get('content-type') || ''
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        if (res.status === 404) {
          // auto-enable then retry once non-stream
          await fetch(`/api/trips/${encodeURIComponent(tripId)}/borderbuddy`, { method: 'POST' })
          res = await fetch(`/api/trips/${encodeURIComponent(tripId)}/borderbuddy/chat/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: bodyContent, kind: 'Chat' }),
          })
          if (!res.ok) throw new Error('Failed to send message')
        } else {
          throw new Error(data?.error?.message || 'Failed to send message')
        }
      }

      if (ctype.includes('text/event-stream') && res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let full = ''
        // Stream loop
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split(/\r?\n/)
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue
            const dataStr = trimmed.slice(5).trim()
            if (!dataStr) continue
            try {
              const evt = JSON.parse(dataStr)
              if (evt.type === 'delta') {
                full += evt.data?.content ?? ''
                setAssistantDraft((prev) => prev + (evt.data?.content ?? ''))
              } else if (evt.type === 'complete') {
                full = evt.data?.content ?? full
              } else if (evt.type === 'error') {
                throw new Error(evt.data?.message || 'Stream error')
              }
            } catch {}
          }
        }
        if (full) {
          setMessages((prev) => [...prev, { role: 'Assistant', content: full }])
        }
      } else {
        // Fallback JSON
        const data = await res.json()
        const assistant = data?.data?.assistant
        if (assistant?.content) {
          setMessages((prev) => [...prev, { role: 'Assistant', content: assistant.content }])
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setIsStreaming(false)
      setAssistantDraft('')
      setInput('')
      announce('')
    }
  }, [tripId, input, isStreaming])

  const retry = useCallback(() => {
    if (lastUserMessageRef.current) {
      // Re-attempt using last user message without duplicating it in UI
      handleSend(lastUserMessageRef.current, { isRetry: true })
    }
  }, [handleSend])

  const disclaimerNote = useMemo(() => (
    <p className="text-xs text-muted-foreground mt-2">
      AI generated. Informational guidance only — verify with official sources.
    </p>
  ), [])

  return (
    <div className="card shadow-card p-4 md:p-6">
      <div aria-live="polite" aria-atomic="true" role="status" ref={liveRef} className="sr-only" />

      <div className="space-y-3 max-h-[50vh] overflow-auto border border-border/60 rounded p-3 bg-background/40">
        {messages.map((m, idx) => (
          <div key={idx} className={cn('text-sm', 'flex flex-col gap-1')}>
            <div>
              <span className={cn('inline-block px-1.5 py-0.5 rounded text-xs mr-2', m.role === 'Assistant' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
                {m.role}
              </span>
            </div>
            <div className={cn('rounded-md border p-3', m.role === 'Assistant' ? 'bg-background' : 'bg-accent/10 border-border/60')}>
              <MarkdownContent content={m.content} />
            </div>
          </div>
        ))}
        {isStreaming && (
          <div className="text-sm text-foreground flex flex-col gap-1">
            <div>
              <span className="inline-block px-1.5 py-0.5 rounded text-xs mr-2 bg-primary/10 text-primary">Assistant</span>
            </div>
            <div className="rounded-md border p-3">
              <MarkdownContent content={assistantDraft || '…'} />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center justify-between gap-3 border border-destructive/30 bg-destructive/10 text-destructive rounded p-2">
          <span className="text-sm">{error}</span>
          <Button size="sm" variant="secondary" onClick={retry}>Retry</Button>
        </div>
      )}

      <form className="mt-4" onSubmit={(e) => { e.preventDefault(); handleSend() }}>
        <label className="block text-xs text-muted-foreground mb-1">Message BorderBuddy</label>
        <div className="flex items-end gap-2 border border-border/60 rounded-md p-2 bg-background">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask BorderBuddy…"
            className="flex-1 h-12 resize-none rounded bg-transparent p-2 text-sm focus:outline-none"
            aria-label="Message BorderBuddy"
            disabled={isStreaming}
          />
          <Button type="submit" disabled={!input.trim() || isStreaming}>{isStreaming ? 'Sending…' : 'Send'}</Button>
        </div>
      </form>

      {disclaimerNote}
    </div>
  )
}
