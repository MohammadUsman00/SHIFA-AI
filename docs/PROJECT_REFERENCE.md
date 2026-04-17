# Shifa AI — Project reference (for humans & AI assistants)

This document describes what **SHIFA-AI** does, what it **does not** do, how data flows, and where to change behavior. Keep it aligned with the code when you ship features.

---

## 1. Product identity

**Shifa AI** is a **patient-facing informational web app** that helps users understand:

- **Medicines** (by typed name: brand, generic, or local name), in **Hindi**, **Urdu**, or **English** UI language.
- **Prescription images** (upload or camera): multimodal AI extracts content and presents it as **structured JSON** (preferred) or **legacy free-text** parsed into cards if structured analysis fails.

It is **not** a regulated medical device, **not** a replacement for a doctor, and **not** diagnostic or prescribing software.

---

## 2. What this project **does**

### 2.1 Frontend (Next.js 14 App Router)

- **Welcome screen**: user enters a display name; theme + language toggles.
- **Main workspace (`ShifaWorkspace`)**: bento-style layout — tools (text vs photo tab), center preview for prescription image, right column with quick actions and **live recent queries**.
- **Structured prescription view (`PrescriptionAnalysisDashboard`)**: shown when `/api/analyze` returns **`prescriptionAnalysis`** (Gemini JSON mode for images). Bilingual medication rows, image preview, safety notes, activity feed.
- **Legacy results**: if structured JSON is absent, **ResultCard** list for text medicine answers or parsed free-text prescription output.
- **i18n**: `LanguageProvider` (`ur` | `en` | `hi`) drives copy from `src/lib/translations.ts`; `LanguageSwitcher` + `localStorage` key `shifa-lang`. Workspace shell uses **`dir="ltr"`** so grid layout is stable; RTL applies for Urdu where needed.
- **Theme**: `ThemeProvider` toggles `html.dark` for light/dark tokens in `globals.css`.
- **Motion**: `motion/react` for transitions on key surfaces.

### 2.2 API: `POST /api/analyze`

**Body:** `{ text?: string, image?: string (data URL), lang?: "ur" | "en" | "hi" }` — require **either** `text` **or** `image`.

**Text path**

- Calls Gemini (`analyzeText`) with language-specific system prompts that enforce a fixed line-oriented format (Urdu or English blocks: name, purpose, dosage, timing, food, stop, warnings).
- Optional **fallback** from `src/lib/fallback-medicines.ts` if Gemini fails for text only.
- Response: `{ medicines[], rawText, prescriptionSummary?, prescriptionAnalysis?, usedFallback?, error? }`.
- Parsed server-side via `parseGeminiResponse()` into `MedicineResult[]`.

**Image path (preferred)**

1. **First** tries **`analyzePrescriptionImageStructured`**: Gemini **`gemini-2.5-flash`** with `responseMimeType: application/json` + **schema** for `PrescriptionAnalysisJson` (`patient_name`, `medications[]` with bilingual `name/dosage/route/timing`, `safety_notes[]`).
2. On success: returns immediately with `prescriptionAnalysis`, `medicines` mapped via `mapStructuredToMedicineResults` for compatibility (enrich, Convex save).
3. On failure: **falls back** to **`analyzeImage`** (legacy formatted text), then same `parseGeminiResponse` as text.

**Convex side effect:** on success with medicines, client calls **`saveQuery`** mutation with first medicine name or `"Rx"`, `inputType`, and `rawText`.

### 2.3 API: `POST /api/enrich`

- **`medicineName`** required.
- Uses **Exa** (`searchDrugInfo`) to return `{ sources: Source[] }` (titles, URLs, snippets). Failures return `{ sources: [] }`.

### 2.4 API: `POST /api/scrape`

- **`medicineName`** required.
- Uses **Apify** `scrapeCDSCO` against CDSCO drug search URL; may return `officialData` or fallback via `findFallbackMedicine`.

### 2.5 Convex (`convex/`)

- **Table `queries`**: `medicineName`, `inputType` (`text`|`image`), `response`, optional `sources` (note: schema uses `v.array(v.string())` but mutation passes arrays of strings for sources in practice — verify if mismatch).
- **`saveQuery` mutation**: inserts one row per successful analyze that returns medicines (from client).
- **`getRecentQueries` query**: last **20** rows, descending by `timestamp`.

### 2.6 Docker

- `next.config.mjs`: `output: "standalone"`.
- `Dockerfile` + `docker-compose.yml` document production image; **`NEXT_PUBLIC_CONVEX_URL`** is a **build arg** for client bundle.

---

## 3. What this project **does not** do (limitations)

| Area | Limitation |
|------|------------|
| **Medical role** | Does **not** diagnose, prescribe, or override clinician judgment. Copy repeatedly disclaims. |
| **Structured extraction** | **Not guaranteed** for every image: depends on Gemini JSON path succeeding; illegible photos yield `null` fields or fallback text. |
| **Guaranteed accuracy** | AI can hallucinate or misread handwriting; app presents **best-effort** output. |
| **Authentication** | No user accounts, sessions, or role-based access in codebase — display name is local UX only. |
| **PHI handling** | No HIPAA/BAA claims; images go to Google APIs when user analyzes — production needs legal review, retention policy, encryption. |
| **Exa / Apify** | Optional; if keys missing or calls fail, enrichment/scrape degrade gracefully (empty or null). |
| **Convex** | App expects `NEXT_PUBLIC_CONVEX_URL`; without it, Convex client may error at runtime. |
| **Offline** | Requires network for APIs and Convex. |
| **Regulatory** | Not validated as a medical product in any jurisdiction. |

---

## 4. Environment variables

| Variable | Required for | Notes |
|----------|----------------|-------|
| `GEMINI_API_KEY` | Core AI (text + image) | Server-only |
| `NEXT_PUBLIC_CONVEX_URL` | Live queries | Public URL; must match deployment; baked in Docker **build** |
| `EXA_API_KEY` | `/api/enrich` | Optional for core flow |
| `APIFY_API_TOKEN` | `/api/scrape` | Optional |

Copy from `.env.example` to `.env.local` locally.

---

## 5. File map (high signal)

| Path | Role |
|------|------|
| `src/app/page.tsx` | Main app: welcome vs workspace vs structured dashboard |
| `src/app/api/analyze/route.ts` | Analyze orchestration |
| `src/lib/gemini.ts` | Gemini models, JSON prescription, text/image prompts |
| `src/components/prescription/ShifaWorkspace.tsx` | Bento workspace UI |
| `src/components/prescription/PrescriptionAnalysisDashboard.tsx` | Structured result UI |
| `convex/schema.ts`, `mutations.ts`, `queries.ts` | Data layer |
| `README.md` | User-facing setup, Docker, badges |

---

## 6. Scripts

- `npm run dev` — dev server  
- `npm run clean` — delete `.next`  
- `npm run dev:clean` — clean + dev (helps chunk cache issues on Windows/OneDrive)  
- `npm run build` / `npm run build:clean` / `npm run start` / `npm run lint`

---

## 7. When editing behavior

- **Change AI tone/format**: `src/lib/gemini.ts` system prompts and `parseGeminiResponse` labels in `route.ts` must stay in sync where applicable.
- **Change Convex schema**: follow `convex/_generated/ai/guidelines.md`; add migrations if needed.
- **New API route**: add under `src/app/api/<name>/route.ts` and document env deps.

---

## 8. Version pin (check `package.json` for current)

- Next.js 14.x, React 18, TypeScript 5, Tailwind 3, Convex 1.x, `@google/generative-ai`, etc.

---

*Last updated to match repository structure; regenerate or edit this file when architecture changes materially.*
