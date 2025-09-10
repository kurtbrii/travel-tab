import { NextResponse } from "next/server"
import { RegisterInput as RegisterDto } from "@/server/contracts/auth.dto"
import { AuthService } from "@/server/services/auth.service"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = RegisterDto.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid input" } },
        { status: 400 }
      )
    }

    const result = await AuthService.register(parsed.data)
    if (!result.ok) {
      if (result.code === 'DUPLICATE') {
        return NextResponse.json(
          { success: false, error: { code: "DUPLICATE", message: "Email is already registered" } },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { success: false, error: { code: "SERVER_ERROR", message: "Unable to register" } },
        { status: 500 }
      )
    }

    const response = NextResponse.json({
      success: true,
      data: { user: { id: result.user.id, email: result.user.email, fullName: result.user.fullName, createdAt: result.user.createdAt } },
      meta: { timestamp: new Date().toISOString() },
    }, { status: 201 })

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
