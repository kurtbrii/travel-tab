import { NextRequest } from 'next/server'
import { ok, created, responses } from '@/lib/api'
import { getCurrentUser } from '@/lib/auth'
import { ChatService } from '@/server/services/chat.service'
import { PostMessageRequest, StreamQuery } from '@/server/contracts/chat.dto'
import { consume } from '@/server/middleware/rate-limit'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return responses.unauthorized()
  const { id } = await params
  if (!id) return responses.badRequest('Missing tripId')
  const result = await ChatService.list(id, user.id, 50)
  if (!result.ok) {
    if (result.code === 'NOT_FOUND') return responses.notFound(result.message || 'Not found')
    if (result.code === 'FORBIDDEN') return responses.forbidden()
    return responses.serverError()
  }
  return ok({ messages: result.messages })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return responses.unauthorized()
  const { id } = await params
  if (!id) return responses.badRequest('Missing tripId')
  // Basic per-user rate limiting for chat posting
  const key = `${user.id}:${id}:chat:post`
  const allowed = consume(key, { limit: 5, windowMs: 60_000 })
  if (!allowed) return responses.tooManyRequests('Please slow down')
  const json = await req.json().catch(() => null)
  const parsed = PostMessageRequest.safeParse(json)
  if (!parsed.success) return responses.badRequest(parsed.error.issues?.[0]?.message)

  // Streaming detection via Accept or query (?stream=1)
  const accept = req.headers.get('accept') || ''
  const url = new URL(req.url)
  const qp = Object.fromEntries(url.searchParams.entries())
  const streamQ = StreamQuery.safeParse(qp)
  const wantsStream = accept.includes('text/event-stream') || (streamQ.success && !!streamQ.data.stream)

  if (!wantsStream) {
    const result = await ChatService.post(id, user.id, parsed.data)
    if (!result.ok) {
      if (result.code === 'NOT_FOUND') return responses.notFound(result.message || 'Not found')
      if (result.code === 'FORBIDDEN') return responses.forbidden()
      return responses.serverError()
    }
    return created({ saved: result.saved, assistant: result.assistant })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      function send(data: any) {
        const line = `data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(encoder.encode(line))
      }

      ChatService.postStream(id, user.id, parsed.data, (evt) => {
        // Normalize to simple contract { type, data }
        send({ type: evt.type, data: evt.data })
        if (evt.type === 'complete' || evt.type === 'error') {
          try { controller.close() } catch {}
        }
      }).catch((_err) => {
        send({ type: 'error', data: { code: 'SERVER_ERROR', message: 'Stream failed' } })
        try { controller.close() } catch {}
      })
    },
  })

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
