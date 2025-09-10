import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/server/repositories/users.repo', () => ({
  UsersRepo: {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  },
}))

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(async (s: string) => `hashed:${s}`),
    compare: vi.fn(async (a: string, b: string) => b === `hashed:${a}`),
  },
}))

vi.mock('jsonwebtoken', async () => {
  return {
    default: {
      sign: vi.fn((payload: any, _secret: string) => `token:${payload.userId ?? payload.id ?? 'uid'}`),
      verify: vi.fn((token: string, _secret: string) => {
        const id = token.startsWith('token:') ? token.slice(6) : undefined
        return { userId: id }
      }),
    },
  }
})

// Mock next/headers cookies for getCurrentUser
vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ get: (name: string) => (name === 'auth-token' ? { value: 'token:123' } : undefined) })),
}))

vi.mock('@/server/config/env', () => ({
  Env: { jwtSecret: () => 'test-secret' },
}))

import { AuthService } from '@/server/services/auth.service'
import { UsersRepo } from '@/server/repositories/users.repo'

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('registers a new user and returns token', async () => {
    vi.mocked(UsersRepo.findByEmail).mockResolvedValue(null as any)
    vi.mocked(UsersRepo.create).mockResolvedValue({ id: 'u1', email: 'a@b.com', fullName: 'A', hashedPassword: 'hashed:x', createdAt: new Date().toISOString() } as any)

    const result = await AuthService.register({ email: 'a@b.com', fullName: 'A', password: 'secret123!' })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.user.id).toBe('u1')
      expect(result.token).toContain('token:')
    }
  })

  it('rejects duplicate registration', async () => {
    vi.mocked(UsersRepo.findByEmail).mockResolvedValue({ id: 'u1' } as any)
    const result = await AuthService.register({ email: 'a@b.com', fullName: 'A', password: 'secret123!' })
    expect(result.ok).toBe(false)
  })

  it('logs in with valid credentials', async () => {
    vi.mocked(UsersRepo.findByEmail).mockResolvedValue({ id: 'u1', email: 'a@b.com', fullName: 'A', hashedPassword: 'hashed:secret123!' } as any)
    const result = await AuthService.login({ email: 'a@b.com', password: 'secret123!' })
    expect(result.ok).toBe(true)
  })

  it('rejects invalid login', async () => {
    vi.mocked(UsersRepo.findByEmail).mockResolvedValue(null as any)
    const result = await AuthService.login({ email: 'a@b.com', password: 'bad' })
    expect(result.ok).toBe(false)
  })

  it('getCurrentUser returns user when cookie and repo ok', async () => {
    vi.mocked(UsersRepo.findById).mockResolvedValue({ id: '123', email: 'a@b.com', fullName: 'A', createdAt: new Date().toISOString() } as any)
    const user = await AuthService.getCurrentUser()
    expect(user?.id).toBe('123')
  })
})

