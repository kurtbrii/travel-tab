import { describe, it, expect } from 'vitest'
import { GET } from '../route'

describe('GET /api/health', () => {
  it('returns 200 with health payload', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data).toBeDefined()
    expect(body.data.status).toBe('ok')
    expect(typeof body.data.env).toBe('string')
    expect(typeof body.data.version).toBe('string')
    expect(typeof body.data.timestamp).toBe('string')
  })
})

