import { prisma } from '@/lib/db'

export const TripsRepo = {
  async findById(id: string) {
    return prisma.trip.findUnique({ where: { id } })
  },

  async findOwnedByUser(id: string, userId: string) {
    return prisma.trip.findFirst({ where: { id, userId } })
  },
}

