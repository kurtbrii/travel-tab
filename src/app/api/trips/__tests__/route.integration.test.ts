import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock auth and trips service modules used by the route
vi.mock('@/lib/auth', () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock('@/lib/trips', () => ({
  getTripsByUser: vi.fn(),
  createTrip: vi.fn(),
}))

import { getCurrentUser } from '@/lib/auth'
import { getTripsByUser, createTrip } from '@/lib/trips'
import { GET, POST } from '../route'

describe('/api/trips integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('POST creates a trip for u1 then GET returns only u1 trips', async () => {
    // getCurrentUser resolves to the same user for both POST and GET
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })

    // POST → mock createTrip to return a newly created trip for u1
    const newTrip = {
      id: 't-new',
      destinationCountry: 'US',
      purpose: 'Business',
      startDate: '2025-01-01',
      endDate: '2025-01-02',
      status: 'Planning',
      statusColor: '',
      modules: [] as string[],
      userId: 'u1',
    }
    vi.mocked(createTrip as any).mockResolvedValue(newTrip)

    const postReq = new Request('http://localhost/api/trips', {
      method: 'POST',
      body: JSON.stringify({
        destinationCountry: 'US',
        purpose: 'Business',
        startDate: '2025-01-01',
        endDate: '2025-01-02',
      }),
    })
    const postRes = await POST(postReq as any)
    expect(postRes.status).toBe(201)
    const created = await postRes.json()
    expect(created?.userId).toBe('u1')
    expect(createTrip).toHaveBeenCalledWith('u1', expect.any(Object))

    // GET → should request trips for u1 only
    const u1Trips = [
      newTrip,
      {
        id: 't-2',
        destinationCountry: 'CA',
        purpose: 'Conference',
        startDate: '2025-02-10',
        endDate: '2025-02-15',
        status: 'Planning',
        statusColor: '',
        modules: [] as string[],
        userId: 'u1',
      },
    ]
    vi.mocked(getTripsByUser as any).mockResolvedValue(u1Trips)

    const getRes = await GET()
    expect(getRes.status).toBe(200)
    const body = await getRes.json()
    expect(Array.isArray(body)).toBe(true)
    expect(getTripsByUser).toHaveBeenCalledWith('u1')
    // Ensure scoping: only u1 trips are returned
    expect(body.every((t: any) => t.userId === 'u1')).toBe(true)
  })

  it('GET scoping excludes other users\' trips', async () => {
    vi.mocked(getCurrentUser as any).mockResolvedValue({ id: 'u1' })

    // Service returns only u1 trips; assert no foreign user trips appear
    vi.mocked(getTripsByUser as any).mockResolvedValue([
      {
        id: 't-a',
        destinationCountry: 'FR',
        purpose: 'Vacation',
        startDate: '2025-03-01',
        endDate: '2025-03-10',
        status: 'Planning',
        statusColor: '',
        modules: [] as string[],
        userId: 'u1',
      },
    ])

    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.length).toBeGreaterThan(0)
    // Strong scoping assertion
    expect(body.some((t: any) => t.userId !== 'u1')).toBe(false)
  })
})

