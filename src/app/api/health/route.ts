import { NextResponse } from 'next/server'
import { appVersion } from '@/lib/version'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const data = {
      status: 'ok' as const,
      env: process.env.NODE_ENV ?? 'development',
      version: appVersion,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(
      { success: true, data },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )
  } catch {
    // Even if something unexpected happens, return a safe payload
    const data = {
      status: 'ok' as const,
      env: process.env.NODE_ENV ?? 'development',
      version: 'unknown',
      timestamp: new Date().toISOString(),
    }
    return NextResponse.json({ success: true, data }, { status: 200 })
  }
}
