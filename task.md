# Dawa AI — Project Build Checklist

## Phase 1: Project Setup
- [ ] Initialize Next.js 14 project with App Router
- [ ] Install dependencies (openai, convex, tailwindcss, lucide-react, exa-js)
- [ ] Configure environment variables (.env.local)
- [ ] Set up Convex backend (`npx convex dev`)
- [ ] Set up Google Fonts (Noto Nastaliq Urdu)
- [ ] Verify all API keys work

## Phase 2: Core Feature — Text Input → Urdu Response
- [ ] Build main page layout (RTL Urdu interface)
- [ ] Create medicine name text input (Urdu)
- [ ] Build OpenAI API route with system prompt
- [ ] Display structured Urdu response card
- [ ] Add loading states and error handling

## Phase 3: Prescription Photo Upload
- [ ] Add image upload component (camera + gallery)
- [ ] Integrate OpenAI Vision API for prescription reading
- [ ] Parse and display results in structured Urdu cards
- [ ] Test with real prescription images

## Phase 4: Exa + Apify Integration
- [ ] Exa API route for drug information enrichment
- [ ] Apify integration for CDSCO drug database scraping
- [ ] Hardcoded fallback JSON of 50 common medicines
- [ ] "Verified by" source badges in UI

## Phase 5: Convex Real-Time Database
- [ ] Define Convex schema (queries table)
- [ ] Save every query + response to Convex
- [ ] Build "Recent Queries" real-time panel
- [ ] Live dashboard demo capability

## Phase 6: UI Polish & Production Ready
- [ ] Premium dark/glass UI with Tailwind
- [ ] Color-coded warnings (red=danger, green=safe)
- [ ] Mobile-responsive design
- [ ] Loading spinners and error messages everywhere
- [ ] Offline/slow-network fallbacks

## Phase 7: Testing & Demo Prep
- [ ] End-to-end testing with 10+ prescriptions
- [ ] Test on slow internet / mobile
- [ ] Prepare 3 demo prescriptions
- [ ] Record demo video
