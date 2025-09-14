import { NextRequest } from 'next/server'
import { ok, created, responses } from '@/lib/api'
import { getCurrentUser } from '@/lib/auth'
import { ChatService } from '@/server/services/chat.service'
import { PostMessageRequest } from '@/server/contracts/chat.dto'

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
  const json = await req.json().catch(() => null)
  const parsed = PostMessageRequest.safeParse(json)
  if (!parsed.success) return responses.badRequest(parsed.error.issues?.[0]?.message)
  const result = await ChatService.post(id, user.id, parsed.data)
  if (!result.ok) {
    if (result.code === 'NOT_FOUND') return responses.notFound(result.message || 'Not found')
    if (result.code === 'FORBIDDEN') return responses.forbidden()
    return responses.serverError()
  }
  return created({ saved: result.saved, assistant: result.assistant })
}
