import { z } from 'zod'

export const PostMessageRequest = z.object({
  content: z.string().min(1),
  kind: z.string().default('Chat'),
})
export type PostMessageRequest = z.infer<typeof PostMessageRequest>

// Streaming query/headers contract
export const StreamQuery = z.object({
  stream: z
    .union([z.literal('1'), z.literal('true'), z.literal('yes')])
    .optional(),
})
export type StreamQuery = z.infer<typeof StreamQuery>

// Streaming event contracts used over SSE-like stream
export type ChatStreamEvent =
  | { type: 'start'; data: { tempId: string } }
  | { type: 'delta'; data: { content: string } }
  | { type: 'complete'; data: { id: string; content: string } }
  | { type: 'error'; data: { code: string; message?: string } }

