import { prisma } from '@/lib/db'

export const ChatRepo = {
  async listMessages(borderBuddyId: string, limit = 50, cursor?: { createdAt: Date; id: string }) {
    return prisma.chatMessage.findMany({
      where: { borderBuddyId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: Math.min(Math.max(limit, 1), 100),
      skip: cursor ? 1 : 0,
      ...(cursor ? { cursor: { id: cursor.id } } : {}),
    })
  },
  async create(borderBuddyId: string, data: { role: 'User' | 'Assistant'; kind: string; content: string }) {
    return prisma.chatMessage.create({ data: { borderBuddyId, ...data } })
  }
}

