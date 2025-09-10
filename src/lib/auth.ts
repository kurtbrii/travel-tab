import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { User } from "@/types"
import { Env } from "@/server/config/env"


export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, Env.jwtSecret()) as any
    // Support tokens that use either `id` or `userId`
    const id = decoded?.id ?? decoded?.userId
    if (!id) return null

    // Return a minimal user shape; other fields may be undefined at runtime
    const user: Partial<User> = {
      id,
      email: decoded?.email,
      fullName: decoded?.fullName,
    }
    return user as User
  } catch (error) {
    return null
  }
}
