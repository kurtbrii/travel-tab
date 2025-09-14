import { prisma } from '@/lib/db'

export const PlacesRepo = {
  async getLatest(borderBuddyId: string) {
    return prisma.placesRecommendation.findUnique({ where: { borderBuddyId } })
  },
  async upsert(borderBuddyId: string, items: any) {
    return prisma.placesRecommendation.upsert({
      where: { borderBuddyId },
      update: { items, generatedAt: new Date() },
      create: { borderBuddyId, items },
    })
  }
}

