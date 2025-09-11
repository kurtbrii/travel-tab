import { describe, it, expect } from 'vitest'
import { tripSchema } from '@/lib/validation'

describe('tripSchema', () => {
  it('accepts valid data', () => {
    const data = { destinationCountry: 'US', purpose: 'Business trip', startDate: '2025-01-10', endDate: '2025-01-12' }
    const parsed = tripSchema.safeParse(data)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.destinationCountry).toBe('US')
    }
  })

  it('rejects non-ISO country code', () => {
    const data = { destinationCountry: 'USA', purpose: 'Tourism', startDate: '2025-01-10', endDate: '2025-01-12' }
    const parsed = tripSchema.safeParse(data)
    expect(parsed.success).toBe(false)
  })

  it('rejects short purpose', () => {
    const data = { destinationCountry: 'GB', purpose: 'ok', startDate: '2025-01-10', endDate: '2025-01-12' }
    const parsed = tripSchema.safeParse(data)
    expect(parsed.success).toBe(false)
  })

  it('rejects end before start', () => {
    const data = { destinationCountry: 'CA', purpose: 'Conference', startDate: '2025-01-12', endDate: '2025-01-10' }
    const parsed = tripSchema.safeParse(data)
    expect(parsed.success).toBe(false)
  })
})

