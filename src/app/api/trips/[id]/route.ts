import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { deleteTripById, getTripById } from '@/lib/trips'

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

