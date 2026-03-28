# Shifa AI

AI-powered prescription assistant (**Shifa AI**) that helps users understand medicines and handwritten prescriptions in **Urdu** or **English**, with an optional prescription-level overview when you upload a photo.

## What This Project Does

The app lets users:

- Search any medicine by name (brand, generic, or local name)
- Upload a prescription photo for AI-based extraction and explanation
- Read structured medicine guidance:
  - what it is used for
  - dosage
  - timing
  - food precautions
  - stop instructions
  - warnings
- Switch UI language between Urdu and English
- Switch between dark and light themes
- View recent queries in real-time using Convex

## Tech Stack

- `Next.js 14` + `React` + `TypeScript`
- `Tailwind CSS` + custom design system
- `Google Gemini API` (`@google/generative-ai`) for text + image analysis
- `Exa API` for enrichment sources
- `Apify` for scraping support
- `Convex` for real-time query storage

## Core Features

- Premium UI with:
  - animated welcome/login screen
  - modern navbar with language and theme toggles
  - responsive layouts and refined spacing
- Prescription image workflow with preview and analysis action
- Robust AI response parsing with graceful fallback rendering
- Source badges and warning severity visuals

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Copy the example file and add your keys (do **not** commit real secrets):

```bash
copy .env.example .env.local
```

On macOS/Linux:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
GEMINI_API_KEY=your_gemini_key
EXA_API_KEY=your_exa_key
APIFY_API_TOKEN=your_apify_token
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

### 3) Configure Convex

Run:

```bash
npx convex dev
```

This links your project and generates Convex artifacts for local development.

### 4) Run the app

```bash
npm run dev
```

Open: `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run lint checks

## Project Notes

- This app provides informational support, not medical diagnosis.
- Always verify treatment decisions with a licensed doctor.

## Deployment (High-Level)

1. Deploy Next.js app (e.g., Vercel)
2. Add the same env vars in hosting dashboard
3. Deploy/link Convex production deployment
4. Verify API routes and image upload flow in production

---

Built for practical prescription understanding and multilingual accessibility.

## Push to GitHub

1. Create a **new empty repository** on GitHub (no README/license if you already have them locally).
2. From this project folder:

```bash
git init
git add .
git commit -m "Initial commit: Shifa AI prescription assistant"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repository name.

**Security:** Never commit `.env`, `.env.local`, or API keys. If keys were ever shared or committed, rotate them in each provider’s dashboard.
