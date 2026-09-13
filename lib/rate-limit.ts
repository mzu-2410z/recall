/**
 * Simple in-memory rate limiter for expensive API routes.
 * Uses a sliding window approach. Resets on server restart (acceptable for MVP).
 *
 * For production, use Redis/Upstash.
 */

interface RateLimitEntry {
  count: number
  windowStart: number
}

const store = new Map<string, RateLimitEntry>()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

/**
 * Check and consume rate limit for a key.
 *
 * @param key     - Unique identifier (e.g. userId + ':ai')
 * @param limit   - Max requests per window
 * @param windowMs - Window duration in milliseconds (default 1 hour)
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs = 60 * 60 * 1000
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now - entry.windowStart >= windowMs) {
    // New window
    store.set(key, { count: 1, windowStart: now })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.windowStart + windowMs,
    }
  }

  entry.count++
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetAt: entry.windowStart + windowMs,
  }
}

/**
 * Returns rate-limit headers for the response.
 */
export function rateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  }
}
