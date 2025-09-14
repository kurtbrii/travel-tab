import { prisma } from '@/lib/db'

export const ContextRepo = {
  async getByBorderBuddyId(borderBuddyId: string) {
    return prisma.borderBuddyContext.findUnique({ where: { borderBuddyId } })
  },
  async upsert(borderBuddyId: string, data: { interests: string[]; regions: string[]; budget?: string | null; style?: string | null; constraints: string[] }) {
    return prisma.borderBuddyContext.upsert({
      where: { borderBuddyId },
      update: { ...data },
      create: { borderBuddyId, ...data },
    })
  }
}

