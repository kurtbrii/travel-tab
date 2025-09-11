import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock next/image to a basic img for JSDOM
vi.mock('next/image', () => ({
  default: (props: any) => {
    const { src, alt, ...rest } = props
    // Render a plain img; src can be a string in tests
    // eslint-disable-next-line jsx-a11y/alt-text
    return React.createElement('img', { src: typeof src === 'string' ? src : '', alt, ...rest })
  },
}))

// Mock next/navigation router to avoid app router invariant
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/',
}))

// Component under test
import LoginPage from '@/app/login/page'

describe('LoginPage UI', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.restoreAllMocks()
    // Stub fetch by default to avoid real network
    vi.spyOn(global, 'fetch' as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { user: { id: 'u1' } } }),
    } as any)

    // Make window.location writable and inert for tests
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

  it('validates inputs and shows field errors', async () => {
    render(<LoginPage />)

    const email = screen.getByPlaceholderText(/you@example.com/i)
    const password = screen.getByPlaceholderText(/enter your password/i)
    const submit = screen.getByRole('button', { name: /sign in/i })

    // Initially disabled until valid
    expect(submit).toBeDisabled()

    // Invalid email
    await user.type(email, 'not-an-email')
    fireEvent.blur(email)
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument()

    // Empty password error after blur
    fireEvent.blur(password)
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument()
  })

  it('submits and redirects to /trips on success', async () => {
    render(<LoginPage />)

    await user.type(screen.getByPlaceholderText(/you@example.com/i), 'test@example.com')
    await user.type(screen.getByPlaceholderText(/enter your password/i), 'Secret123!')

    const submit = screen.getByRole('button', { name: /sign in/i })
    expect(submit).toBeEnabled()

    await user.click(submit)

    await waitFor(() => {
      expect((window as any).location.href).toBe('/trips')
    })

    // Ensure API was called as expected
    expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({ method: 'POST' }))
  })

  it('shows server error when API responds non-ok', async () => {
    vi.spyOn(global, 'fetch' as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: { message: 'INVALID_CREDENTIALS' } }),
    } as any)

    render(<LoginPage />)

    await user.type(screen.getByPlaceholderText(/you@example.com/i), 'test@example.com')
    await user.type(screen.getByPlaceholderText(/enter your password/i), 'wrong')

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/invalid_credentials|sign in failed/i)).toBeInTheDocument()
  })
})
