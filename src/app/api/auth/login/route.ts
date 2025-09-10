// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import { LoginInput as LoginDto } from "@/server/contracts/auth.dto"
import { AuthService } from "@/server/services/auth.service"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = LoginDto.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid input" } },
        { status: 400 }
      )
    }

    const result = await AuthService.login(parsed.data)
    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" } },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          fullName: result.user.fullName,
          createdAt: result.user.createdAt
        }
      },
      meta: { timestamp: new Date().toISOString() },
    })

    response.cookies.set({
      name: 'auth-token',
      value: result.token,
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
