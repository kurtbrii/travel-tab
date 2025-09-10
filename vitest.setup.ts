// Set required environment variables for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret'

export { }

// Extend expect with jest-dom only in jsdom environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  await import('@testing-library/jest-dom/vitest')
}
