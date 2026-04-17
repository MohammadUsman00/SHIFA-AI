# Production operations & hardening

This note is written for teams who will operate Shifa AI beyond the first deploy: capacity, abuse, observability, and data stewardship matter as much as feature velocity.

---

## 1. Quality assurance and automated testing

Automated tests are not a substitute for clinical judgment or manual review of model output, but they **anchor invariants** so refactors do not silently break parsers, fallbacks, or internationalization.

| Layer | What runs | Command |
|-------|-----------|---------|
| Lint | Next.js ESLint (`next/core-web-vitals`) | `npm run lint` |
| Unit tests | Vitest — pure helpers, rate-limit behavior, fallback formatting | `npm run test` |
| Build | TypeScript + Next production compile | `npm run build` |
| CI | Lint → test → build (GitHub Actions on push/PR) | `npm run ci` |

**What we do not automate:** end-to-end browser flows against Gemini (flaky, costly, key-dependent). Use **manual smoke tests** after each production deploy: text query, optional image upload, language switch, Convex recent queries.

---

## 2. Rate limiting and abuse management

Inference routes (`/api/analyze`, `/api/enrich`, `/api/scrape`) are **cost-sensitive**. Rate limiting protects your budget and keeps noisy neighbors from starving legitimate users.

### Behaviour

- **Default:** sliding window per client key (derived from `X-Forwarded-For` / `X-Real-Ip`, else `unknown`).
- **Defaults:** 30 requests per 60 seconds per namespace + IP (tune with `RATE_LIMIT_MAX_REQUESTS`, `RATE_LIMIT_WINDOW_MS`).
- **Disable:** `RATE_LIMIT_DISABLED=true` (local development only — never in public production).

### Single-instance vs serverless

| Deployment | In-memory fallback | Distributed limit |
|------------|-------------------|-------------------|
| One Docker container / single Node | Works — one process shares the Map | Optional Upstash |
| Vercel / multiple lambdas | **Not reliable** — each isolate has its own memory | **Use Upstash Redis** |

### Upstash (recommended on Vercel)

1. Create a Redis database in [Upstash](https://upstash.com/) (HTTP REST API).
2. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in Vercel (and locally if you want parity).
3. Redeploy. The app uses `@upstash/ratelimit` when both variables are present.

Clients exceeding the limit receive **429** with `Retry-After` when using Upstash, and a JSON body `{ "code": "RATE_LIMITED" }`.

---

## 3. Security headers

`next.config.mjs` applies baseline headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, etc.). Tighten further if you embed the app in iframes or need CSP — that is product-specific.

---

## 4. Observability and incident response

- **Platform logs:** Use Vercel’s log drain or export to your SIEM. Watch **5xx rate**, **429 rate**, and latency on `/api/analyze`.
- **Convex:** Use the Convex dashboard for function errors and subscription health.
- **Third-party quotas:** Monitor Gemini, Exa, and Apify usage dashboards; set billing alerts.

Define an **on-call playbook**: who rotates keys, who approves model prompt changes, and how you communicate outages to users (status page optional).

---

## 5. Data retention and compliance

Prescription images are processed by **Gemini** per your Google terms. This app does **not** implement long-term image storage by default. Before a broad public launch, document:

- How long logs are retained.
- Whether images pass through only in memory / API or are logged.
- Jurisdictional requirements (e.g. health-data regulations) for your audience.

These decisions are **yours**; the codebase stays intentionally minimal here.

---

## 6. Future hardening (when you need it)

- **Authentication** if you add accounts or paid tiers.
- **WAF** (Cloudflare, etc.) in front of Vercel for DDoS and bot management.
- **Structured audit log** for enterprise customers (who queried what, when — without storing raw images if policy forbids).

---

*Revision: keep this document aligned with `README.md` and environment variables in `.env.example`.*
