<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

## Shifa AI — agent context

**Read first for full product scope, limits, and architecture:** [`docs/PROJECT_REFERENCE.md`](docs/PROJECT_REFERENCE.md)

### One-line summary

Next.js 14 app: **Gemini** for medicine Q&A and prescription image analysis (JSON + legacy fallback), optional **Exa** enrichment and **Apify** scrape, **Convex** for recent-query feed — **informational only**, not medical advice.

### Do not assume

- No auth / HIPAA guarantees in repo.
- Structured prescription JSON requires successful `analyzePrescriptionImageStructured`; failure falls back to text parsing.
- `NEXT_PUBLIC_CONVEX_URL` required for Convex React client at runtime.

### Quick paths

| Task | Where |
|------|--------|
| Analyze API | `src/app/api/analyze/route.ts`, `src/lib/gemini.ts` |
| UI shell | `src/app/page.tsx`, `src/components/prescription/*` |
| Convex | `convex/schema.ts`, `mutations.ts`, `queries.ts` |
