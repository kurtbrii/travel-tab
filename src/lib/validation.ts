import { z } from "zod"

export const registerSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  fullName: z.string().min(3, { message: "Username must be at least 3 characters" }),
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
})
