# Shifa AI — Project reference (for humans & AI assistants)

This document describes what **SHIFA-AI** does, what it **does not** do, how data flows, and where to change behavior. Keep it aligned with the code when you ship features. User-facing setup: [`README.md`](../README.md).

---

## 1. Product identity

**Shifa AI** is a **patient-facing informational web app** that helps users understand:

- **Medicines** (typed name: brand, generic, or local) with UI in **Hindi**, **Urdu**, or **English**.
- **Prescription images** (upload or camera): multimodal AI extracts content as **structured JSON** (preferred) or **legacy free-text** parsed into cards.

Extended capabilities (informational only): **medicine cabinet**, **family profiles**, **schedule timeline**, **interaction hints**, **Rx compare**, **simplify**, **TTS**, **scoped chat**, **share links**, **PWA**.

It is **not** a regulated medical device, **not** a replacement for a doctor, and **not** diagnostic or prescribing software.

---

## 2. What this project **does**

### 2.1 App routes

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/app/page.tsx` | Single-page app: welcome → logged-in workspace |
| `/share/[token]` | `src/app/share/[token]/page.tsx` | Read-only shared prescription summary (Convex) |

### 2.2 Frontend flow (`page.tsx`)

1. **Welcome** (`WelcomeScreen`) — landing, mission copy, FAQ, impact counter; user enters display name.
2. **Main scroll** — hero, trust ribbon, `ShifaWorkspace` (text/photo tabs), `MedicineCabinet`, landing sections, FAQ footer.
3. **Results branch:**
   - **`prescriptionAnalysis` present** → `PrescriptionAnalysisDashboard` + `AnalysisTools` (schedule, interactions, chat, export, share, compare, TTS, simplify).
   - **Otherwise** → `ResultCard` list + inline tools (simplify, TTS, export, chat) for legacy/text flows.

**Convex optional:** `hasConvex = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL)`. Without it: `ConvexMissingBanner`, `RecentQueriesDisabled`, cabinet uses `localStorage` via `src/lib/local-cabinet.ts`.

### 2.3 UI shell & design

- **Theme:** `ThemeProvider` — `html.dark` class, `localStorage` key `dawa-theme` (default **light**).
- **i18n:** `LanguageProvider` — `ur` \| `en` \| `hi`; copy in `src/lib/translations.ts`; feature strings in `src/lib/feature-copy.ts`; `localStorage` key `shifa-lang`.
- **Typography:** `src/lib/lang-ui.ts` — `bodyFontVar`, `chromeFontVar`, `scriptTitleClass`, `scriptUiClass`.
- **Design tokens:** `src/app/globals.css` — royal healthcare palette (navy `#0f1c2e`, gold `#b8956a`, sage primary, cream surfaces); classes like `shifa-page`, `royal-kicker`, `royal-title`, `cause-panel`, `segment-tabs`, `btn-primary`, `btn-gold`.
- **Fonts:** `src/app/layout.tsx` — Cormorant Garamond (display), Source Sans 3 (UI), Noto Nastaliq / Noto Devanagari (Urdu/Hindi).
- **Motion:** `motion/react` on `PrescriptionAnalysisDashboard` expand/collapse.
- **PWA:** `public/manifest.json`, `public/sw.js`, `PwaRegister.tsx` — SW registers **production only**; dev unregisters SW to avoid stale `/_next/static` interception.

### 2.4 Key components

| Component | Role |
|-----------|------|
| `ShifaWorkspace` | Care-desk layout; text vs photo segment tabs |
| `MedicineInput` | Text search + voice input (Web Speech API) |
| `PhotoUpload` | Image upload/camera + `CameraCoach` |
| `PrescriptionAnalysisDashboard` | Structured Rx UI; hosts `AnalysisTools` |
| `AnalysisTools` | Schedule, interactions, chat, export, share, compare, TTS, simplify |
| `MedicineCabinet` | Cabinet list + `FamilyProfileBar`; Convex or local fallback |
| `ImpactCounter` | `getImpactStats` query; static fallback without Convex |
| `RecentQueries` | Live feed via `getRecentQueries` |

### 2.5 Client-side persistence (no auth)

| Key / module | Storage | Purpose |
|--------------|---------|---------|
| `shifa-client-id` | `localStorage` | Anonymous cabinet/sync id (`client-id.ts`) |
| `shifa-profiles`, `shifa-active-profile` | `localStorage` | Family profiles (`profiles.ts`) |
| `shifa-lang` | `localStorage` | UI language |
| `dawa-theme` | `localStorage` | Light/dark theme |
| `local-cabinet.ts` | `localStorage` | Cabinet when Convex unavailable |

Display name is **session state only** (React), not persisted server-side.

---

## 3. API routes

**Rate limiting:** All inference POST routes call `enforceApiRateLimit(request, namespace)` first. Namespaces: `analyze`, `enrich`, `scrape`, `chat`, `simplify`, `interactions`. Returns **429** `{ code: "RATE_LIMITED" }` when exceeded. See `src/lib/rate-limit.ts` and `docs/PRODUCTION.md`.

### 3.1 `POST /api/analyze`

**File:** `src/app/api/analyze/route.ts`  
**Body:** `{ text?: string, image?: string (data URL), lang?: "ur" | "en" | "hi" }` — require **either** `text` **or** `image`.

**Text path**

- Gemini `analyzeText` (`src/lib/gemini.ts`) — line-oriented format (name, purpose, dosage, timing, food, stop, warnings).
- Fallback: `findFallbackMedicine` from `src/lib/fallback-medicines.ts` if Gemini fails.
- Parsed via `parseGeminiResponse()` → `MedicineResult[]`.

**Image path**

1. **Preferred:** `analyzePrescriptionImageStructured` — `gemini-2.5-flash`, JSON schema → `PrescriptionAnalysisJson`.
2. **Fallback:** `analyzeImage` (legacy text) → `parseGeminiResponse`.

**Response (typical):** `{ medicines[], rawText, prescriptionSummary?, prescriptionAnalysis?, usedFallback?, error? }`.

**Client side effect:** on success, `saveQuery` mutation (if Convex configured).

### 3.2 `POST /api/enrich`

**File:** `src/app/api/enrich/route.ts`  
**Body:** `{ medicineName }`  
**Returns:** `{ sources: Source[] }` via Exa (`src/lib/exa.ts`). Failures → `{ sources: [] }`.

### 3.3 `POST /api/scrape`

**File:** `src/app/api/scrape/route.ts`  
**Body:** `{ medicineName }`  
**Returns:** Apify CDSCO scrape (`src/lib/apify.ts`) or fallback medicine data. **Not called from UI** — backend/API-only.

### 3.4 `POST /api/chat`

**File:** `src/app/api/chat/route.ts`  
**Body:** `{ message, contextSummary, lang? }`  
**Returns:** `{ reply }` via `rxFollowUpChat` (`src/lib/gemini-features.ts`).

### 3.5 `POST /api/simplify`

**File:** `src/app/api/simplify/route.ts`  
**Body:** `{ text, lang? }`  
**Returns:** `{ simplified }` via `simplifyMedicalText`.

### 3.6 `POST /api/interactions`

**File:** `src/app/api/interactions/route.ts`  
**Body:** `{ medications: MedicationStructured[], lang? }`  
**Returns:** `{ hints }` or `{ hints: "", skipped: true }` if fewer than 2 medications.

---

## 4. Convex (`convex/`)

Read **`convex/_generated/ai/guidelines.md`** before editing Convex code.

### 4.1 Schema (`convex/schema.ts`)

| Table | Fields (summary) | Indexes |
|-------|------------------|---------|
| `queries` | `medicineName`, `inputType`, `response`, `sources?`, `timestamp` | — |
| `cabinetItems` | `clientId`, `profileId`, `medicineName`, optional med fields, `purchased`, `savedAt` | `by_client_profile` |
| `shareLinks` | `token`, `payload` (JSON string), `expiresAt`, `createdAt` | `by_token` |

### 4.2 Mutations (`convex/mutations.ts`)

| Export | Purpose |
|--------|---------|
| `saveQuery` | Insert recent query after analyze |
| `saveCabinetItem` | Upsert cabinet row by client + profile + name |
| `removeCabinetItem` | Delete cabinet row |
| `toggleCabinetPurchased` | Pharmacy checklist toggle |
| `createShareLink` | Store share token + payload |

### 4.3 Queries (`convex/queries.ts`)

| Export | Purpose |
|--------|---------|
| `getRecentQueries` | Last 20 queries, desc |
| `getCabinetItems` | Cabinet for `clientId` + `profileId` |
| `getShareByToken` | Share payload if not expired |
| `getImpactStats` | Counts for welcome impact counter |

### 4.4 Deployments

| Command | Target |
|---------|--------|
| `npx convex dev` | **Dev** deployment (`CONVEX_DEPLOYMENT` in `.env.local`) |
| `npx convex dev --once` | One-shot push to dev |
| `npx convex deploy` | **Production** deployment |

`NEXT_PUBLIC_CONVEX_URL` must match the deployment you pushed to. Mismatch causes errors like `Could not find public function for 'queries:getImpactStats'`.

---

## 5. Shared types (`src/types/index.ts`)

| Type | Use |
|------|-----|
| `BilingualField` | `{ en, ur }` strings in structured Rx |
| `MedicationStructured` | Single med row in JSON Rx |
| `PrescriptionAnalysisJson` | Full structured image analysis |
| `MedicineResult` | Card/list UI model |
| `Source` | Exa enrichment link |
| `FallbackMedicine` | Offline JSON fallback entries |

---

## 6. Library modules (`src/lib/`)

| Module | Role |
|--------|------|
| `gemini.ts` | Core analyze: text, image, structured JSON |
| `gemini-features.ts` | Chat, simplify, interaction checks |
| `fallback-medicines.ts` | Offline drug JSON + lookup |
| `exa.ts` | Drug search enrichment |
| `apify.ts` | CDSCO scrape (API route only) |
| `rate-limit.ts` | Upstash + in-memory limiter |
| `translations.ts` | Main UI copy (en/ur/hi) |
| `feature-copy.ts` | Feature-specific i18n |
| `lang-ui.ts` | Font/CSS class helpers |
| `i18n/index.ts` | `languages`, `dir`, `fontClass` |
| `schedule.ts` | Parse timing → daily slots |
| `compare-rx.ts` | Diff two `PrescriptionAnalysisJson` |
| `pdf-export.ts` | Print-friendly summary window |
| `tts.ts` | Web Speech API read-aloud |
| `image-quality.ts` | Camera coach heuristics |
| `client-id.ts` | Anonymous client id |
| `profiles.ts` | Family profile CRUD (local) |
| `local-cabinet.ts` | Cabinet without Convex |

---

## 7. What this project **does not** do

| Area | Limitation |
|------|------------|
| **Medical role** | No diagnosis, prescribing, or clinician override |
| **Structured extraction** | Not guaranteed per image; JSON path can fail → legacy text |
| **Accuracy** | AI can hallucinate or misread handwriting |
| **Authentication** | No accounts; display name is local UX only |
| **PHI / HIPAA** | No BAA claims; images sent to Google when analyzed |
| **Exa / Apify** | Optional; graceful degradation |
| **Convex** | Optional; degraded mode without `NEXT_PUBLIC_CONVEX_URL` |
| **Offline** | Requires network for AI APIs |
| **Scrape API** | Implemented but not wired in UI |
| **Regulatory** | Not validated as a medical product |

---

## 8. Environment variables

| Variable | Required for | Notes |
|----------|----------------|-------|
| `GEMINI_API_KEY` | All AI routes | Server-only |
| `NEXT_PUBLIC_CONVEX_URL` | Convex features | Must match deployed backend; Docker build-time |
| `CONVEX_DEPLOYMENT` | `npx convex dev` | Set by Convex CLI (e.g. `dev:your-name`) |
| `EXA_API_KEY` | `/api/enrich` | Optional |
| `APIFY_API_TOKEN` | `/api/scrape` | Optional |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Distributed rate limits | Recommended on Vercel |
| `RATE_LIMIT_MAX_REQUESTS` / `RATE_LIMIT_WINDOW_MS` | Tuning | Defaults 30 / 60s |
| `RATE_LIMIT_DISABLED` | Local dev | `true` disables all limits |

Copy from `.env.example` → `.env.local`. Never commit secrets.

---

## 9. File map (high signal)

| Path | Role |
|------|------|
| `src/app/page.tsx` | Main app orchestration |
| `src/app/layout.tsx` | Fonts, metadata, PWA, providers shell |
| `src/app/globals.css` | Design system tokens + component classes |
| `src/app/api/*/route.ts` | Server API handlers |
| `src/components/WelcomeScreen.tsx` | Landing + onboarding |
| `src/components/prescription/ShifaWorkspace.tsx` | Assistant workspace |
| `src/components/prescription/PrescriptionAnalysisDashboard.tsx` | Structured Rx dashboard |
| `src/components/features/*` | Cabinet, tools, share, TTS, etc. |
| `src/components/providers/*` | Theme, language |
| `convex/schema.ts`, `mutations.ts`, `queries.ts` | Backend |
| `public/manifest.json`, `public/sw.js` | PWA |
| `next.config.mjs` | Standalone output, security headers, webpack poll (Windows) |
| `README.md` | Setup, deploy, troubleshooting |
| `docs/PRODUCTION.md` | Rate limits, ops runbook |

---

## 10. Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run dev:clean` | Remove `.next` then dev |
| `npm run clean` | Delete `.next` |
| `npm run build` / `build:clean` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run test` / `test:watch` | Vitest (`src/**/*.test.ts`) |
| `npm run ci` | lint + test + build |

**Local dev:** run `npx convex dev` in a second terminal when using Convex.

---

## 11. When editing behavior

| Change | Where to look |
|--------|----------------|
| AI tone / analyze format | `src/lib/gemini.ts`, `parseGeminiResponse` in `analyze/route.ts` |
| Chat / simplify / interactions | `src/lib/gemini-features.ts`, matching API routes |
| UI copy | `src/lib/translations.ts`, `src/lib/feature-copy.ts` |
| Convex schema | `convex/schema.ts` + `convex/_generated/ai/guidelines.md`; migrations if needed |
| New API route | `src/app/api/<name>/route.ts`, add rate-limit namespace, document env |
| New feature UI | `src/components/features/`, wire from `page.tsx` or `AnalysisTools.tsx` |
| Cabinet without Convex | `src/lib/local-cabinet.ts` |
| PWA / SW | `public/sw.js` — do not intercept `/_next/` or `/api/` |

---

## 12. Testing

Vitest covers deterministic logic only:

- `src/lib/fallback-medicines.test.ts`
- `src/lib/lang-ui.test.ts`
- `src/lib/i18n/i18n.test.ts`
- `src/lib/rate-limit.test.ts`

Gemini output is **not** unit-tested — smoke-test manually with real keys.

---

## 13. Version pins (see `package.json` for exact)

Next.js 14.x · React 18 · TypeScript 5 · Tailwind 3 · Convex 1.x · `@google/generative-ai` · Vitest 2.x

---

*Last updated to match repository structure (features, APIs, Convex, PWA). Edit when architecture changes materially.*
