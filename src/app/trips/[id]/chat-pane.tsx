"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import MarkdownContent from '@/components/ui/markdown-content'
import ContextForm from './context-form'

type ChatMessage = { id?: string; role: 'User' | 'Assistant'; content: string }
type BorderBuddyContext = {
  interests: string[]
  regions: string[]
  budget?: string | null
  style?: string | null
  constraints: string[]
}

export default function ChatPane({ tripId }: { tripId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [assistantDraft, setAssistantDraft] = useState<string>('')
  const [context, setContext] = useState<BorderBuddyContext | null>(null)
  const [isLoadingContext, setIsLoadingContext] = useState(false)
  const [borderBuddyEnabled, setBorderBuddyEnabled] = useState<boolean | null>(null) // null = loading, true/false = loaded
  const [currentContextForEdit, setCurrentContextForEdit] = useState<BorderBuddyContext | null>(null)
  const lastUserMessageRef = useRef<string | null>(null)
  const liveRef = useRef<HTMLDivElement>(null)

  // Check BorderBuddy status and load data on component mount
  useEffect(() => {
    let isMounted = true
    const loadBorderBuddyData = async () => {
      try {
        setIsLoadingContext(true)
        setError(null)

        // Check BorderBuddy status
        const res = await fetch(`/api/trips/${encodeURIComponent(tripId)}/borderbuddy`)
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error?.message || 'Failed to check BorderBuddy status')
        }
        const data = await res.json()
        if (!isMounted) return

        const isEnabled = data?.success && data.data?.enabled
        setBorderBuddyEnabled(isEnabled)

        // If BorderBuddy is enabled, load context and messages
        if (isEnabled) {
          // Load context
          const ctxRes = await fetch(`/api/trips/${encodeURIComponent(tripId)}/borderbuddy/context`)
          if (!ctxRes.ok) {
            const errorData = await ctxRes.json()
            throw new Error(errorData.error?.message || 'Failed to load context')
          }
          const ctxData = await ctxRes.json()
          if (!isMounted) return

          if (ctxData?.success) {
            setContext(ctxData.data.context || null)
          }

          // Load messages
          const msgRes = await fetch(`/api/trips/${encodeURIComponent(tripId)}/borderbuddy/chat/messages`)
          if (!msgRes.ok) {
            const errorData = await msgRes.json()
            throw new Error(errorData.error?.message || 'Failed to load messages')
          }
          const msgData = await msgRes.json()
          if (!isMounted) return

          if (msgData?.success && Array.isArray(msgData.data?.messages)) {
            setMessages(msgData.data.messages)
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Error loading BorderBuddy data:', err)
          setError(err.message || 'Failed to load BorderBuddy data')
          setBorderBuddyEnabled(false)
        }
      } finally {
        if (isMounted) {
          setIsLoadingContext(false)
        }
      }
    }
    loadBorderBuddyData()
    return () => { isMounted = false }
  }, [tripId])

  
  const handleContextSubmit = async (newContext: BorderBuddyContext) => {
    try {
      setIsLoadingContext(true)
      setError(null)

      // First enable BorderBuddy (if not already enabled)
      if (borderBuddyEnabled !== true) {
        const bbRes = await fetch(`/api/trips/${encodeURIComponent(tripId)}/borderbuddy`, { method: 'POST' })
        if (!bbRes.ok) {
          const errorData = await bbRes.json()
          throw new Error(errorData.error?.message || 'Failed to enable BorderBuddy')
        }
        await bbRes.json().catch(() => null) // We don't care about the response, just that it's enabled
        setBorderBuddyEnabled(true)
      }

      // Then save context
      const res = await fetch(`/api/trips/${encodeURIComponent(tripId)}/borderbuddy/context`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContext),
      })
      const data = await res.json()
      if (data?.success) {
        setContext(newContext)
        setCurrentContextForEdit(null) // Clear editing state
        // Don't clear messages or borderBuddyEnabled - preserve the conversation
      } else {
        throw new Error(data?.error?.message || 'Failed to save context')
      }
    } catch (err: any) {
      console.error('Error saving context:', err)
      throw err
    } finally {
      setIsLoadingContext(false)
    }
  }

  const handleEditContext = () => {
    // Store current context in state temporarily for editing
    setCurrentContextForEdit(context)
    // Don't set context to null - keep the BorderBuddy enabled and messages
  }

  const handleCancelEdit = () => {
    // Just clear the editing state and restore the original context
    setCurrentContextForEdit(null)
  }

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

  const ContextSummary = useMemo(() => {
    if (!context) return null

    const hasPreferences =
      context.interests.length > 0 ||
      context.regions.length > 0 ||
      context.budget ||
      context.style ||
      context.constraints.length > 0

    if (!hasPreferences) return null

    return (
      <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border/60">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-foreground">Your Travel Preferences</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleEditContext}
            className="text-xs h-6 px-2"
          >
            Edit
          </Button>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          {context.interests.length > 0 && (
            <div>
              <span className="font-medium">Interests:</span> {context.interests.join(', ')}
            </div>
          )}
          {context.regions.length > 0 && (
            <div>
              <span className="font-medium">Regions:</span> {context.regions.join(', ')}
            </div>
          )}
          {context.budget && (
            <div>
              <span className="font-medium">Budget:</span> {context.budget}
            </div>
          )}
          {context.style && (
            <div>
              <span className="font-medium">Style:</span> {context.style}
            </div>
          )}
          {context.constraints.length > 0 && (
            <div>
              <span className="font-medium">Constraints:</span> {context.constraints.join(', ')}
            </div>
          )}
        </div>
      </div>
    )
  }, [context, handleEditContext])

  // Show loading state while checking BorderBuddy status
  if (borderBuddyEnabled === null || isLoadingContext) {
    return (
      <div className="card shadow-card p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <div className="text-sm text-muted-foreground">Loading BorderBuddy...</div>
          <div className="text-xs text-muted-foreground text-center max-w-xs">
            Checking your BorderBuddy status and loading preferences...
          </div>
        </div>
      </div>
    )
  }

  // Show form if BorderBuddy is not enabled OR if there's no context saved yet OR if user is actively editing
  if (borderBuddyEnabled === false || (borderBuddyEnabled === true && !context) || currentContextForEdit) {
    return (
      <div>
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-destructive mb-1">Unable to setup BorderBuddy</h3>
                <p className="text-xs text-destructive/80">{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="text-xs bg-destructive/20 hover:bg-destructive/30 text-destructive px-3 py-1 rounded transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
        <ContextForm
          onSubmit={handleContextSubmit}
          onCancel={handleCancelEdit}
          initialContext={currentContextForEdit || context || {
            interests: [],
            regions: [],
            budget: null,
            style: null,
            constraints: [],
          }}
          mode={currentContextForEdit ? 'edit' : 'setup'}
        />
      </div>
    )
  }

  return (
    <div className="card shadow-card p-4 md:p-6">
      <div aria-live="polite" aria-atomic="true" role="status" ref={liveRef} className="sr-only" />

      {ContextSummary}

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
