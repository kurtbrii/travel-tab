import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createTrip, getTripsByUser } from '@/lib/trips';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const trips = await getTripsByUser(user.id);
    return NextResponse.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const trip = await createTrip(user.id, body);
    return NextResponse.json(trip, { status: 201 });
  } catch (error: any) {
    console.error('Error creating trip:', error);
    return NextResponse.json(
      {
        error: 'Failed to create trip',
        ...(process.env.NODE_ENV !== 'production' && { details: String(error?.message || error) }),
      },
      { status: 500 }
    );
  }
}
