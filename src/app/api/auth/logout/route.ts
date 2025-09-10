import { NextResponse } from "next/server"

export async function POST() {
  // 204 No Content per story spec
  const response = new NextResponse(null, { status: 204 })

  // Clear the auth token cookie
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // Expire immediately
  })

  return response
}
