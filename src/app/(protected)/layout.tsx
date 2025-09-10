import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { AuthService } from '@/server/services/auth.service'

// Ensure no static caching; always read cookies on each request
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const user = await AuthService.getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return <>{children}</>
}
