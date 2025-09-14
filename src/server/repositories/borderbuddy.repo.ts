import { prisma } from '@/lib/db'

export const BorderBuddyRepo = {
  async findByTripId(tripId: string) {
    return prisma.borderBuddy.findUnique({ where: { tripId } })
  },

  async createForTrip(tripId: string) {
    return prisma.borderBuddy.create({ data: { tripId } })
  },
}

