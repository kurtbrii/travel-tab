import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Env } from '@/server/config/env'
import { UsersRepo } from '@/server/repositories/users.repo'
import type { LoginInput, RegisterInput } from '@/server/contracts/auth.dto'

export const AuthService = {
  async register(input: RegisterInput) {
    const existing = await UsersRepo.findByEmail(input.email)
    if (existing) {
      return { ok: false as const, code: 'DUPLICATE' as const }
    }

    const hashedPassword = await bcrypt.hash(input.password, 12)
    const created = await UsersRepo.create({
      email: input.email,
      fullName: input.fullName,
      hashedPassword,
    })

    const token = jwt.sign(
      { userId: created.id, email: created.email, fullName: created.fullName },
      Env.jwtSecret(),
      { expiresIn: '7d', algorithm: 'HS256' }
    )

    return { ok: true as const, user: created, token }
  },

  async login(input: LoginInput) {
    const user = await UsersRepo.findByEmail(input.email)
    if (!user) return { ok: false as const, code: 'INVALID_CREDENTIALS' as const }

    const valid = await bcrypt.compare(input.password, user.hashedPassword)
    if (!valid) return { ok: false as const, code: 'INVALID_CREDENTIALS' as const }

    const token = jwt.sign(
      { userId: user.id, email: user.email, fullName: user.fullName },
      Env.jwtSecret(),
      { expiresIn: '7d', algorithm: 'HS256' }
    )

    return { ok: true as const, user, token }
  },

  async logout() {
    return { ok: true as const }
  },

  async getCurrentUser() {
    try {
      const store = await cookies()
      const token = store.get('auth-token')?.value
      if (!token) return null
      const decoded = jwt.verify(token, Env.jwtSecret()) as any
      const id = decoded?.id ?? decoded?.userId
      if (!id) return null
      const user = await UsersRepo.findById(id)
      if (!user) return null
      return { id: user.id, email: user.email, fullName: user.fullName, createdAt: user.createdAt }
    } catch {
      return null
    }
  }
}

