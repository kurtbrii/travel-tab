import { z } from 'zod'

export const TripIdParam = z.object({ tripId: z.string().min(1) })
export type TripIdParam = z.infer<typeof TripIdParam>

export const EnableBorderBuddyResponse = z.object({
  success: z.literal(true),
  data: z.object({
    borderBuddy: z.object({ id: z.string(), tripId: z.string(), enabledAt: z.any() }),
    created: z.boolean(),
  })
}).or(z.object({
  success: z.literal(false),
  error: z.object({ code: z.string(), message: z.string().optional() })
}))
export type EnableBorderBuddyResponse = z.infer<typeof EnableBorderBuddyResponse>

