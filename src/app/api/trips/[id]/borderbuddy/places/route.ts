import { NextRequest } from 'next/server'
import { ok, created, responses } from '@/lib/api'
import { getCurrentUser } from '@/lib/auth'
import { PlacesService } from '@/server/services/places.service'
import { GeneratePlacesRequest } from '@/server/contracts/places.dto'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return responses.unauthorized()
  const { id } = await params
  if (!id) return responses.badRequest('Missing tripId')

  const result = await PlacesService.get(id, user.id)
  if (!result.ok) {
    if (result.code === 'NOT_FOUND') return responses.notFound(result.message || 'Not found')
    if (result.code === 'FORBIDDEN') return responses.forbidden()
    return responses.serverError()
  }
  return ok({ places: result.places })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return responses.unauthorized()
  const { id } = await params
  if (!id) return responses.badRequest('Missing tripId')
  const json = await req.json().catch(() => ({}))
  const parsed = GeneratePlacesRequest.safeParse(json)
  if (!parsed.success) return responses.badRequest(parsed.error.issues?.[0]?.message)

  const result = await PlacesService.generate(id, user.id, parsed.data.seed)
  if (!result.ok) {
    if (result.code === 'NOT_FOUND') return responses.notFound(result.message || 'Not found')
    if (result.code === 'FORBIDDEN') return responses.forbidden()
    return responses.serverError()
  }
  return created({ places: result.places })
}
