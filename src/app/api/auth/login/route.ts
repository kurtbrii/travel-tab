// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { loginSchema } from "@/lib/validation"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = loginSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid input" } },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" } },
        { status: 401 }
      )
    }

    const validPassword = await bcrypt.compare(password, user.hashedPassword)
    if (!validPassword) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" } },
        { status: 401 }
      )
    }

    // Normally, you’d call Auth.js here to issue a session cookie.
    // For now, just return success.
    return NextResponse.json({
      success: true,
      data: { id: user.id, email: user.email },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Something went wrong" } },
      { status: 500 }
    )
  }
}
