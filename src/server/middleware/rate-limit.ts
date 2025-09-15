type Bucket = number[]

// Simple in-memory sliding window limiter. Suitable for single-process dev.
const buckets: Map<string, Bucket> = new Map()

export type RateLimitOptions = {
  limit: number
  windowMs: number
}

export function consume(key: string, opts: RateLimitOptions): boolean {
  const now = Date.now()
  const windowStart = now - opts.windowMs
  let bucket = buckets.get(key)
  if (!bucket) {
    bucket = []
    buckets.set(key, bucket)
  }
  // Drop events outside window
  while (bucket.length && bucket[0] <= windowStart) bucket.shift()
  if (bucket.length >= opts.limit) return false
  bucket.push(now)
  return true
}

export function resetAll() {
  buckets.clear()
}

