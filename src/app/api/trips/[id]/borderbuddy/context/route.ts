import { NextRequest } from 'next/server'
import { ok, responses } from '@/lib/api'
import { getCurrentUser } from '@/lib/auth'
import { ContextService } from '@/server/services/context.service'
import { ContextForm } from '@/server/contracts/context.dto'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return responses.unauthorized()
  const { id } = await params
  if (!id) return responses.badRequest('Missing tripId')

  const result = await ContextService.get(id, user.id)
  if (!result.ok) {
    if (result.code === 'NOT_FOUND') return responses.notFound(result.message || 'Not found')
    if (result.code === 'FORBIDDEN') return responses.forbidden()
    return responses.serverError()
  }
  return ok({ context: result.context })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return responses.unauthorized()
  const { id } = await params
  if (!id) return responses.badRequest('Missing tripId')
  const json = await req.json().catch(() => null)
  const parsed = ContextForm.safeParse(json)
  if (!parsed.success) return responses.badRequest(parsed.error.issues?.[0]?.message)

  const result = await ContextService.save(id, user.id, parsed.data)
  if (!result.ok) {
    if (result.code === 'NOT_FOUND') return responses.notFound(result.message || 'Not found')
    if (result.code === 'FORBIDDEN') return responses.forbidden()
    return responses.serverError()
  }
  return ok({ context: result.context })
}
