import { z } from 'zod'

export const PostMessageRequest = z.object({
  content: z.string().min(1),
  kind: z.string().default('Chat'),
})
export type PostMessageRequest = z.infer<typeof PostMessageRequest>

