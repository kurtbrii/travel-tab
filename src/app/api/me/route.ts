import { NextResponse } from 'next/server'
import { AuthService } from '@/server/services/auth.service'

export async function GET() {
  const user = await AuthService.getCurrentUser()
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
      { status: 401 }
    )
  }

  return NextResponse.json({ success: true, data: { user } }, { status: 200 })
}