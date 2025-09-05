import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
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
      select: { id: true, email: true, fullName: true, createdAt: true },
    })

    // Create JWT token and set as httpOnly cookie
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      return NextResponse.json(
        { success: false, error: { code: "SERVER_ERROR", message: "Authentication configuration error" } },
        { status: 500 }
      )
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        fullName: user.fullName
      },
      jwtSecret,
      {
        expiresIn: "7d",
        algorithm: 'HS256' // Explicit algorithm for security
      }
    )

    const response = NextResponse.json({
      success: true,
      data: { user },
      meta: { timestamp: new Date().toISOString() },
    })

    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Something went wrong" } },
      { status: 500 }
    )
  }
}
