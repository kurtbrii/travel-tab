// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
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

    // Create JWT token and set as httpOnly cookie
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error("JWT_SECRET environment variable is not set")
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
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          createdAt: user.createdAt
        }
      },
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
