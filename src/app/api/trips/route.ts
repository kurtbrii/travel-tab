import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Map between DB enum and UI string
const toDisplayStatus = (status: string | null | undefined): string => {
  switch (status) {
    case 'Ready_to_Go':
      return 'Ready to Go';
    case 'In_Progress':
      return 'In Progress';
    case 'Completed':
      return 'Completed';
    case 'Planning':
    default:
      return 'Planning';
  }
};

const fromDisplayStatus = (status: string | null | undefined): string => {
  switch (status) {
    case 'Ready to Go':
      return 'Ready_to_Go';
    case 'In Progress':
      return 'In_Progress';
    case 'Completed':
      return 'Completed';
    case 'Planning':
    default:
      return 'Planning';
  }
};

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const trips = await prisma.trip.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    // Normalize status for UI
    const normalized = trips.map((t) => ({
      ...t,
      status: toDisplayStatus(t.status as any),
    }));
    return NextResponse.json(normalized);
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

    // Validate required fields
    if (!body.title || !body.destination || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate date formats and ordering (expecting YYYY-MM-DD from <input type="date"/>)
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!isoDateRegex.test(body.startDate) || !isoDateRegex.test(body.endDate)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD.' },
        { status: 400 }
      );
    }
    const start = new Date(`${body.startDate}T00:00:00.000Z`);
    const end = new Date(`${body.endDate}T00:00:00.000Z`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date values.' },
        { status: 400 }
      );
    }
    if (end < start) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Create trip with all required fields
    const trip = await prisma.trip.create({
      data: {
        title: body.title,
        destination: body.destination,
        startDate: start,
        endDate: end,
        status: fromDisplayStatus(body.status) as any, // Cast to enum type
        statusColor: body.statusColor || 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
        modules: body.modules || [],
        userId: user.id
      }
    });

    return NextResponse.json(
      { ...trip, status: toDisplayStatus(trip.status as any) },
      { status: 201 }
    );
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
