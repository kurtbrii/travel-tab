import { z } from 'zod'

export const PlaceItem = z.object({
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
})
export type PlaceItem = z.infer<typeof PlaceItem>

export const GeneratePlacesRequest = z.object({ seed: z.string().optional() })
export type GeneratePlacesRequest = z.infer<typeof GeneratePlacesRequest>

