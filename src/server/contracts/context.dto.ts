import { z } from 'zod'

export const ContextForm = z.object({
  interests: z.array(z.string()).default([]),
  regions: z.array(z.string()).default([]),
  budget: z.string().optional().nullable(),
  style: z.string().optional().nullable(),
  constraints: z.array(z.string()).default([]),
})
export type ContextForm = z.infer<typeof ContextForm>

