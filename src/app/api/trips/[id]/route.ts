import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { deleteTripById, getTripById, updateTrip } from '@/lib/trips'

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const trip = await getTripById(id)
    if (!trip) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }
    if (trip.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await deleteTripById(id)
    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting trip:', error)
    return NextResponse.json({ error: 'Failed to delete trip' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const existing = await getTripById(id)
    if (!existing) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }
    if (existing.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const updated = await updateTrip(id, body)
    return NextResponse.json(updated, { status: 200 })
  } catch (error: any) {
    console.error('Error updating trip:', error)
    const msg = String(error?.message || error || '')
    const isValidation = /invalid|end date|start date|iso|code|format/i.test(msg)
    return NextResponse.json(
      {
        error: isValidation ? 'Missing or invalid fields' : 'Failed to update trip',
        ...(process.env.NODE_ENV !== 'production' && { details: msg }),
      },
      { status: isValidation ? 400 : 500 }
    )
  }
}
