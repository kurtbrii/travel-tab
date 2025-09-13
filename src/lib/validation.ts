import { z } from "zod"
import { isValidAlpha2 } from "@/lib/iso-countries"

export const registerSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(72, { message: "Password too long" })
    .regex(/[a-z]/, { message: "Include at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Include at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Include at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Include at least one symbol" })
    .refine((val) => !/\s/.test(val), { message: "No spaces allowed" }),
})


export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const tripSchema = z.object({
  destinationCountry: z
    .string()
    .length(2, { message: 'Use ISO alpha-2 code (e.g., US)' })
    .regex(/^[A-Za-z]{2}$/, { message: 'Use ISO alpha-2 letters only' })
    .transform((s) => s.toUpperCase())
    .refine((code) => isValidAlpha2(code), {
      message: 'Unknown country code. Use ISO alpha-2 (e.g., US, GB)',
      path: ['destinationCountry']
    }),
  purpose: z
    .string()
    .min(3, { message: 'Purpose must be at least 3 characters' })
    .max(100, { message: 'Purpose must be at most 100 characters' }),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
}).refine(
  (data) => {
    if (!data.startDate || !data.endDate) return true
    return new Date(data.startDate) <= new Date(data.endDate)
  },
  { message: 'End date must be after start date', path: ['endDate'] }
)
