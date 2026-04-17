import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { enforceApiRateLimit, __resetMemoryRateLimitForTests } from "./rate-limit";

function post(headers: Record<string, string> = {}) {
  return new NextRequest("http://localhost/api/analyze", {
    method: "POST",
    headers: new Headers(headers),
  });
}

describe("enforceApiRateLimit (memory)", () => {
  beforeEach(() => {
    __resetMemoryRateLimitForTests();
    delete process.env.RATE_LIMIT_DISABLED;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    process.env.RATE_LIMIT_MAX_REQUESTS = "3";
    process.env.RATE_LIMIT_WINDOW_MS = "60000";
  });

  it("allows requests under the limit", async () => {
    const h = { "x-forwarded-for": "10.0.0.1" };
    expect(await enforceApiRateLimit(post(h), "analyze")).toBeNull();
    expect(await enforceApiRateLimit(post(h), "analyze")).toBeNull();
    expect(await enforceApiRateLimit(post(h), "analyze")).toBeNull();
  });

  it("returns 429 when over the limit", async () => {
    const h = { "x-forwarded-for": "10.0.0.2" };
    expect(await enforceApiRateLimit(post(h), "analyze")).toBeNull();
    expect(await enforceApiRateLimit(post(h), "analyze")).toBeNull();
    expect(await enforceApiRateLimit(post(h), "analyze")).toBeNull();
    const blocked = await enforceApiRateLimit(post(h), "analyze");
    expect(blocked?.status).toBe(429);
    const body = await blocked?.json();
    expect(body).toMatchObject({ code: "RATE_LIMITED" });
  });

  it("skips enforcement when RATE_LIMIT_DISABLED is true", async () => {
    process.env.RATE_LIMIT_DISABLED = "true";
    const h = { "x-forwarded-for": "10.0.0.3" };
    for (let i = 0; i < 10; i++) {
      expect(await enforceApiRateLimit(post(h), "analyze")).toBeNull();
    }
  });
});
