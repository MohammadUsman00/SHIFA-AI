import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/** Client identifier for rate limiting (first hop in X-Forwarded-For when present). */
export function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();
  return "unknown";
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** Sliding window in memory — effective for single Node process (e.g. one Docker replica). Not shared across Vercel isolates. */
const memoryBuckets = new Map<string, number[]>();
let memoryChecks = 0;

function pruneMemoryBuckets(): void {
  const now = Date.now();
  const windowMs = parsePositiveInt(process.env.RATE_LIMIT_WINDOW_MS, 60_000);
  for (const [k, stamps] of Array.from(memoryBuckets.entries())) {
    const next = stamps.filter((t) => now - t < windowMs);
    if (next.length === 0) memoryBuckets.delete(k);
    else memoryBuckets.set(k, next);
  }
}

function memoryAllow(key: string, max: number, windowMs: number): boolean {
  if (++memoryChecks % 500 === 0) pruneMemoryBuckets();
  const now = Date.now();
  const stamps = (memoryBuckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (stamps.length >= max) {
    memoryBuckets.set(key, stamps);
    return false;
  }
  stamps.push(now);
  memoryBuckets.set(key, stamps);
  return true;
}

let upstashLimiter: Ratelimit | null | undefined;

function getUpstashLimiter(): Ratelimit | null {
  if (upstashLimiter !== undefined) return upstashLimiter;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    upstashLimiter = null;
    return null;
  }
  const redis = Redis.fromEnv();
  const max = parsePositiveInt(process.env.RATE_LIMIT_MAX_REQUESTS, 30);
  const windowSec = Math.max(1, Math.ceil(parsePositiveInt(process.env.RATE_LIMIT_WINDOW_MS, 60_000) / 1000));
  upstashLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, `${windowSec} s`),
    prefix: "shifa",
    analytics: true,
  });
  return upstashLimiter;
}

function tooManyResponse(retryAfterSec?: number): NextResponse {
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  if (retryAfterSec != null && retryAfterSec > 0) {
    headers.set("Retry-After", String(retryAfterSec));
  }
  return NextResponse.json(
    { error: "Too many requests. Please wait and try again.", code: "RATE_LIMITED" },
    { status: 429, headers }
  );
}

/**
 * Enforce per-IP (or unknown) limits on expensive API routes.
 * - If `RATE_LIMIT_DISABLED=true`, no limit.
 * - If Upstash env vars are set, limits are distributed (recommended on Vercel).
 * - Otherwise uses in-process memory (best for single-instance Docker / local dev).
 */
export async function enforceApiRateLimit(
  request: NextRequest,
  namespace: "analyze" | "enrich" | "scrape" | "chat" | "simplify" | "interactions"
): Promise<NextResponse | null> {
  if (process.env.RATE_LIMIT_DISABLED === "true") {
    return null;
  }

  const ip = getClientIp(request);
  const key = `${namespace}:${ip}`;
  const max = parsePositiveInt(process.env.RATE_LIMIT_MAX_REQUESTS, 30);
  const windowMs = parsePositiveInt(process.env.RATE_LIMIT_WINDOW_MS, 60_000);

  const upstash = getUpstashLimiter();
  if (upstash) {
    const { success, reset } = await upstash.limit(key);
    if (success) return null;
    const retryAfterSec = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
    return tooManyResponse(retryAfterSec);
  }

  if (!memoryAllow(key, max, windowMs)) {
    return tooManyResponse(Math.ceil(windowMs / 1000));
  }
  return null;
}

/** Test-only: clear in-memory buckets. */
export function __resetMemoryRateLimitForTests(): void {
  memoryBuckets.clear();
  memoryChecks = 0;
}
