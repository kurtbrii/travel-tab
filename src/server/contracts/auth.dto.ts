import { z } from 'zod'
import { registerSchema, loginSchema } from '@/lib/validation'

export const RegisterInput = registerSchema
export type RegisterInput = z.infer<typeof RegisterInput>

export const LoginInput = loginSchema
export type LoginInput = z.infer<typeof LoginInput>

export const MeResponse = z.object({
  success: z.literal(true),
  data: z.object({
    user: z.object({
      id: z.string(),
      email: z.string().email(),
      fullName: z.string().optional().nullable(),
      createdAt: z.any().optional(), // serialized Date in JSON
    })
  })
}).or(z.object({
  success: z.literal(false),
  error: z.object({ code: z.string(), message: z.string().optional() })
}))

export type MeResponse = z.infer<typeof MeResponse>

