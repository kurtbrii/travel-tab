import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock next/image to a basic img for JSDOM
vi.mock('next/image', () => ({
  default: (props: any) => {
    const { src, alt, ...rest } = props
    // eslint-disable-next-line jsx-a11y/alt-text
    return React.createElement('img', { src: typeof src === 'string' ? src : '', alt, ...rest })
  },
}))

// Mock next/navigation router to avoid app router invariant
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/',
}))

import RegisterPage from '@/app/register/page'

describe('RegisterPage UI', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(global, 'fetch' as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { user: { id: 'u1' } } }),
    } as any)

    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost/',
        assign: vi.fn(),
        replace: vi.fn(),
      },
      writable: true,
      configurable: true,
    })
  })

  it('validates email, password rules, and confirm password', async () => {
    render(<RegisterPage />)

    const fullName = screen.getByPlaceholderText(/enter your full name/i)
    const email = screen.getByPlaceholderText(/you@example.com/i)
    const password = screen.getByPlaceholderText(/create a strong password/i)
    const confirm = screen.getByPlaceholderText(/confirm your password/i)
    const submit = screen.getByRole('button', { name: /create account/i })

    // Initially disabled
    expect(submit).toBeDisabled()

    await user.type(fullName, 'A')
    fireEvent.blur(fullName)
    expect(await screen.findByText(/full name must be at least 3/i)).toBeInTheDocument()

    await user.clear(fullName)
    await user.type(fullName, 'Alice Anderson')

    await user.type(email, 'not-an-email')
    fireEvent.blur(email)
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument()

    // Weak password should trigger helper state; error appears on blur if invalid
    await user.type(password, 'short')
    fireEvent.blur(password)
    expect(await screen.findByText(/password must be at least 8/i)).toBeInTheDocument()

    // Confirm mismatch shows message
    await user.type(confirm, 'shortX')
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument()
  })

  it('submits and redirects to /dashboard on success', async () => {
    render(<RegisterPage />)

    await user.type(screen.getByPlaceholderText(/enter your full name/i), 'Alice Anderson')
    await user.type(screen.getByPlaceholderText(/you@example.com/i), 'alice@example.com')
    await user.type(screen.getByPlaceholderText(/create a strong password/i), 'Secret123!')
    await user.type(screen.getByPlaceholderText(/confirm your password/i), 'Secret123!')

    const submit = screen.getByRole('button', { name: /create account/i })
    expect(submit).toBeEnabled()

    await user.click(submit)

    await waitFor(() => {
      expect((window as any).location.href).toBe('/dashboard')
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', expect.objectContaining({ method: 'POST' }))
  })
})
