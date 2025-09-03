import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { registerSchema } from "@/lib/validation"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = registerSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid input" } },
        { status: 400 }
      )
    }

    const { email, password, fullName } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: "DUPLICATE", message: "Email is already registered" } },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { email, hashedPassword, fullName },
      select: { id: true, email: true, createdAt: true },
    })

    return NextResponse.json({
      success: true,
      data: { user },
      meta: { timestamp: new Date().toISOString() },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Something went wrong" } },
      { status: 500 }
    )
  }
}
