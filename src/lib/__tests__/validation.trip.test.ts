import { describe, it, expect } from 'vitest'
import { tripSchema } from '@/lib/validation'

describe('tripSchema validation', () => {
  it('accepts valid input', () => {
    const result = tripSchema.safeParse({ destinationCountry: 'US', purpose: 'Business', startDate: '2025-01-01', endDate: '2025-01-02' })
    expect(result.success).toBe(true)
  })

  it('rejects unknown country code', () => {
    const result = tripSchema.safeParse({ destinationCountry: 'ZZ', purpose: 'Business', startDate: '2025-01-01', endDate: '2025-01-02' })
    expect(result.success).toBe(false)
  })

  it('rejects end date before start date', () => {
    const result = tripSchema.safeParse({ destinationCountry: 'US', purpose: 'Biz', startDate: '2025-01-03', endDate: '2025-01-02' })
    expect(result.success).toBe(false)
  })
})

