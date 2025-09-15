import { NextResponse } from 'next/server'

type ErrorBody = { success: false; error: { code: string; message?: string }; meta?: Record<string, any> }
type SuccessBody<T> = { success: true; data: T; meta?: Record<string, any> }

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data } as SuccessBody<T>, {
    ...init,
    status: init?.status ?? 200,
    headers: { 'X-API-Version': '0', ...(init?.headers || {}) },
  })
}

export function created<T>(data: T) {
  return ok(data, { status: 201 })
}

export function error(code: string, message?: string, status = 500) {
  return NextResponse.json(
    { success: false, error: { code, message } } as ErrorBody,
    { status, headers: { 'X-API-Version': '0' } }
  )
}

export const responses = {
  badRequest: (msg?: string) => error('VALIDATION_ERROR', msg, 400),
  unauthorized: (msg?: string) => error('UNAUTHORIZED', msg || 'Not authenticated', 401),
  forbidden: (msg?: string) => error('FORBIDDEN', msg || 'Not allowed', 403),
  notFound: (msg?: string) => error('NOT_FOUND', msg || 'Not found', 404),
  conflict: (msg?: string) => error('CONFLICT', msg || 'Conflict', 409),
  tooManyRequests: (msg?: string) => error('RATE_LIMITED', msg || 'Too many requests', 429),
  serverError: (msg?: string) => error('SERVER_ERROR', msg || 'Server error', 500),
}
