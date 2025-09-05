import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { User } from "@/types"


export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret-change-in-production"
    ) as User

    return decoded
  } catch (error) {
    return null
  }
}
