import { NextRequest } from 'next/server'
import { ok, created, responses } from '@/lib/api'
import { getCurrentUser } from '@/lib/auth'
import { BorderBuddyService } from '@/server/services/borderbuddy.service'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return responses.unauthorized()
  const { id } = await params
  if (!id) return responses.badRequest('Missing tripId')

  const result = await BorderBuddyService.enable(id, user.id)
  if (!result.ok) {
    if (result.code === 'NOT_FOUND') return responses.notFound('Trip not found')
    if (result.code === 'FORBIDDEN') return responses.forbidden('You do not own this trip')
    return responses.serverError('Unable to enable BorderBuddy')
  }

  const payload = { borderBuddy: { id: result.borderBuddy.id, tripId: result.borderBuddy.tripId, enabledAt: result.borderBuddy.enabledAt }, created: result.created }
  return result.created ? created(payload) : ok(payload)
}
