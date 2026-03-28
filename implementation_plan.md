# Dawa AI — Implementation Plan

A prescription-reading web app that explains medicines in simple Urdu for rural Kashmiri patients. Built for a 36-hour hackathon.

## User Review Required

> [!IMPORTANT]
> **API Keys Needed:** You must have keys for OpenAI (GPT-4o + Vision), Exa, Apify, and Convex ready before we start.

> [!WARNING]
> **You mentioned you only have Exa, Apify, and Cursor credits.** If you don't have an OpenAI API key, the core feature won't work. Confirm if you have access to OpenAI GPT-4o, or if we should use an alternative (e.g., Google Gemini, which has a free tier with vision support).

---

## Project Directory Structure

```
SHIFA-AI/
├── .env.local                    # API keys
├── next.config.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── convex/
│   ├── _generated/
│   ├── schema.ts                 # Convex DB schema
│   ├── queries.ts                # Read functions
│   └── mutations.ts              # Write functions
├── public/
│   ├── favicon.ico
│   └── prescription-sample.jpg   # Demo image
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout (Urdu font, RTL)
│   │   ├── page.tsx              # Main app page
│   │   ├── globals.css           # Global styles + Tailwind
│   │   └── api/
│   │       ├── analyze/
│   │       │   └── route.ts      # OpenAI text + vision API
│   │       ├── enrich/
│   │       │   └── route.ts      # Exa drug info lookup
│   │       └── scrape/
│   │           └── route.ts      # Apify CDSCO scraper
│   ├── components/
│   │   ├── Header.tsx            # App branding
│   │   ├── MedicineInput.tsx     # Text input (Urdu)
│   │   ├── PhotoUpload.tsx       # Camera/gallery upload
│   │   ├── ResultCard.tsx        # Structured Urdu result
│   │   ├── WarningBadge.tsx      # Color-coded warnings
│   │   ├── RecentQueries.tsx     # Convex real-time panel
│   │   ├── LoadingSpinner.tsx    # Loading state
│   │   └── SourceBadge.tsx       # "Verified by" badges
│   ├── lib/
│   │   ├── openai.ts             # OpenAI client + system prompt
│   │   ├── exa.ts                # Exa client
│   │   ├── apify.ts              # Apify client
│   │   └── fallback-medicines.ts # Hardcoded 50 medicines
│   └── types/
│       └── index.ts              # TypeScript interfaces
└── README.md
```

---

## Proposed Changes

### 1. Project Initialization

#### [NEW] [package.json](file:///c:/Users/usman/OneDrive/Desktop/scans/SHIFA-AI/package.json)
Initialize with `npx create-next-app@latest ./` using TypeScript, Tailwind, App Router, `src/` directory. Then install additional deps:
- `openai` — GPT-4o + Vision
- `convex` — real-time database
- `exa-js` — drug info search
- `apify-client` — CDSCO scraping
- `lucide-react` — icons

#### [NEW] [.env.local](file:///c:/Users/usman/OneDrive/Desktop/scans/SHIFA-AI/.env.local)
```env
OPENAI_API_KEY=sk-...
EXA_API_KEY=...
APIFY_API_TOKEN=...
NEXT_PUBLIC_CONVEX_URL=...
```

---

### 2. Core Layout & Styling

#### [NEW] [src/app/layout.tsx](file:///c:/Users/usman/OneDrive/Desktop/scans/SHIFA-AI/src/app/layout.tsx)
- Set `dir="rtl"` and `lang="ur"` on the HTML element
- Import Google Font **Noto Nastaliq Urdu** via `next/font/google`
- Wrap children with `ConvexProvider`
- Dark theme with premium glassmorphism aesthetic

#### [NEW] [src/app/globals.css](file:///c:/Users/usman/OneDrive/Desktop/scans/SHIFA-AI/src/app/globals.css)
- Tailwind imports
- Custom CSS: glass cards, gradient backgrounds, RTL utilities
- Urdu typography scale (large, readable text)
- Color system: `--danger: red`, `--safe: green`, `--warning: amber`

---

### 3. Main Page

#### [NEW] [src/app/page.tsx](file:///c:/Users/usman/OneDrive/Desktop/scans/SHIFA-AI/src/app/page.tsx)
Single-page app with:
- **Header** — "دوا AI" branding with tagline
- **Two input modes** — Text input (medicine name in Urdu) + Photo upload
- **Result area** — Structured medicine cards
- **Sidebar** — Recent queries from Convex (real-time)
- State management for loading, errors, results

---

### 4. API Routes

#### [NEW] [src/app/api/analyze/route.ts](file:///c:/Users/usman/OneDrive/Desktop/scans/SHIFA-AI/src/app/api/analyze/route.ts)
- **POST** handler accepting `{ text?: string, image?: base64 }`
- If text: call GPT-4o with the Urdu system prompt
- If image: call GPT-4o Vision with the image + system prompt
- Parse structured Urdu response into JSON fields
- Also call Exa enrichment in parallel
- Return combined result

**System Prompt (exact copy from playbook):**
```
You are a medical assistant helping rural patients in Kashmir
understand their prescriptions. The user will give you a
medicine name or photo of a prescription.

Always respond in simple Urdu (Nastaliq script).
Never use complex medical terms without explaining them.
Structure your response ALWAYS as:

دوا کا نام: [medicine name in Urdu]
یہ کس لیے ہے: [what it treats - simple words]
کتنی لینی ہے: [dosage]
کب لینی ہے: [timing - morning/night/after food]
کھانے سے پرہیز: [food to avoid]
کب بند کریں: [when to stop]
⚠️ خبردار: [any serious warning if applicable]

If you see multiple medicines, explain each one separately.
If anything is unclear, say so honestly in Urdu.
```

#### [NEW] [src/app/api/enrich/route.ts](file:///c:/Users/usman/OneDrive/Desktop/scans/SHIFA-AI/src/app/api/enrich/route.ts)
- **POST** `{ medicineName: string }`
- Call Exa API to search for drug info from WHO / medical sites
- Return source URLs and summary for "Verified by" badges

#### [NEW] [src/app/api/scrape/route.ts](file:///c:/Users/usman/OneDrive/Desktop/scans/SHIFA-AI/src/app/api/scrape/route.ts)
- **POST** `{ medicineName: string }`
- Call Apify to scrape CDSCO.gov.in for official drug data
- Fallback to `fallback-medicines.ts` if Apify fails

---

### 5. UI Components

| Component | Purpose |
|---|---|
| `Header.tsx` | "دوا AI" logo, tagline in Urdu, gradient text |
| `MedicineInput.tsx` | Large RTL text input, submit button, Urdu placeholder |
| `PhotoUpload.tsx` | Drag-drop / camera button, image preview, base64 conversion |
| `ResultCard.tsx` | Glass card with structured fields: name, purpose, dosage, timing, food warnings, stop instructions |
| `WarningBadge.tsx` | Red/amber/green badges for severity levels |
| `RecentQueries.tsx` | Real-time list from Convex, updates live |
| `LoadingSpinner.tsx` | Pulse animation with Urdu "...جاری ہے" text |
| `SourceBadge.tsx` | "تصدیق شدہ" (Verified) badges with Exa source links |

---

### 6. Convex Backend

#### [NEW] [convex/schema.ts](file:///c:/Users/usman/OneDrive/Desktop/scans/SHIFA-AI/convex/schema.ts)
```ts
queries: defineTable({
  medicineName: v.string(),
  inputType: v.union(v.literal("text"), v.literal("image")),
  response: v.string(),
  sources: v.optional(v.array(v.string())),
  timestamp: v.number(),
})
```

#### [NEW] [convex/mutations.ts](file:///c:/Users/usman/OneDrive/Desktop/scans/SHIFA-AI/convex/mutations.ts)
- `saveQuery` — inserts a new query record

#### [NEW] [convex/queries.ts](file:///c:/Users/usman/OneDrive/Desktop/scans/SHIFA-AI/convex/queries.ts)
- `getRecentQueries` — returns last 20 queries, ordered by timestamp desc

---

### 7. Fallback Data

#### [NEW] [src/lib/fallback-medicines.ts](file:///c:/Users/usman/OneDrive/Desktop/scans/SHIFA-AI/src/lib/fallback-medicines.ts)
Hardcoded JSON array of 50 common medicines (Paracetamol, Metformin, Amoxicillin, etc.) with Urdu descriptions. Used when Apify/Exa/OpenAI fails.

---

## Verification Plan

### Browser Testing
1. **Start dev server:** `npm run dev` in the project directory
2. **Open `http://localhost:3000`** — verify RTL Urdu layout loads correctly with Noto Nastaliq font
3. **Text input test:** Type "Paracetamol" → verify structured Urdu response card appears within 10 seconds
4. **Photo upload test:** Upload a prescription image → verify medicines are detected and explained in Urdu
5. **Recent queries panel:** Verify the sidebar updates in real-time after each query
6. **Error handling:** Disconnect internet → verify fallback data displays and no crashes

### Manual Verification (by you)
- [ ] Test on mobile browser (responsive design)
- [ ] Test with 3 real prescription photos for live demo
- [ ] Confirm Urdu font loads on mobile data (not just WiFi)
- [ ] Check all loading spinners appear during API calls
- [ ] Verify Convex dashboard shows live query updates
