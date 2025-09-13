import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock non-essential UI components to avoid client boundary complexity
vi.mock('@/components/navbar', () => ({ default: () => <nav data-testid="navbar" /> }))
vi.mock('@/components/ui/status-badge', () => ({ default: (props: any) => <span data-testid="status-badge">{props.status}</span> }))
vi.mock('@/components/ui/tabs', () => ({ default: (props: any) => <div data-testid="tabs">{props?.tabs?.[0]?.content}</div> }))
vi.mock('next/link', () => ({ default: (props: any) => <a {...props} /> }))

// Mock data/auth modules per scenario inside tests

// Error instance used for 404 assertions
const notFoundErr = new Error('NOT_FOUND')

// Import page inside each test after setting mocks via vi.doMock

describe('TripDetailPage', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })
  it('returns 404 for non-owner', async () => {
    vi.doMock('next/navigation', () => ({ notFound: () => { throw notFoundErr } }))
    vi.doMock('@/lib/auth', () => ({ getCurrentUser: vi.fn(async () => ({ id: 'owner-a' })) }))
    vi.doMock('@/lib/trips', () => ({ getTripById: vi.fn(async () => ({ id: 't1', userId: 'owner-b', purpose: 'Work', destinationCountry: 'US', startDate: '2025-01-01', endDate: '2025-01-02', status: 'Planning', statusColor: '', modules: [], createdAt: new Date(), updatedAt: new Date() })) }))

    // Re-import with scenario-specific mocks applied
    const Page = (await import('../page')).default

    await expect(
      Page({ params: { id: 't1' }, searchParams: {} })
    ).rejects.toBe(notFoundErr)
  })

  it('renders Back to Trips link preserving state (sanitized)', async () => {
    vi.doMock('next/navigation', async (importOriginal) => {
      const actual: any = await importOriginal()
      return { ...actual, notFound: vi.fn(), useRouter: () => ({ back: vi.fn(), push: vi.fn() }) }
    })
    vi.doMock('@/lib/auth', () => ({ getCurrentUser: vi.fn(async () => ({ id: 'u1' })) }))
    vi.doMock('@/lib/trips', () => ({ getTripById: vi.fn(async () => ({ id: 't1', userId: 'u1', purpose: 'Work', destinationCountry: 'US', startDate: '2025-01-01', endDate: '2025-01-02', status: 'Planning', statusColor: '', modules: [], createdAt: new Date(), updatedAt: new Date() })) }))

    const Page = (await import('../page')).default

    const ui = await Page({ params: { id: 't1' }, searchParams: { returnTo: '/trips?q=abc&page=2' } })
    render(ui as any)

    const back = screen.getByRole('link', { name: /back to trips/i }) as HTMLAnchorElement
    expect(back).toBeInTheDocument()
    expect(back.getAttribute('href')).toBe('/trips?q=abc&page=2')
  })

  it('sanitizes an unsafe returnTo and falls back to /trips', async () => {
    vi.doMock('next/navigation', async (importOriginal) => {
      const actual: any = await importOriginal()
      return { ...actual, notFound: vi.fn(), useRouter: () => ({ back: vi.fn(), push: vi.fn() }) }
    })
    vi.doMock('@/lib/auth', () => ({ getCurrentUser: vi.fn(async () => ({ id: 'u1' })) }))
    vi.doMock('@/lib/trips', () => ({ getTripById: vi.fn(async () => ({ id: 't2', userId: 'u1', purpose: 'Vacation', destinationCountry: 'CA', startDate: '2025-03-10', endDate: '2025-03-12', status: 'Planning', statusColor: '', modules: [], createdAt: new Date(), updatedAt: new Date() })) }))

    const Page = (await import('../page')).default
    const ui = await Page({ params: { id: 't2' }, searchParams: { returnTo: 'https://evil.com' } })
    render(ui as any)

    const back = screen.getByRole('link', { name: /back to trips/i }) as HTMLAnchorElement
    expect(back.getAttribute('href')).toBe('/trips')
  })
})
