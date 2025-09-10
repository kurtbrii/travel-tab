import { prisma } from '@/lib/db'

export const UsersRepo = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  },

  async create(data: { email: string; fullName: string; hashedPassword: string }) {
    return prisma.user.create({ data })
  }
}

