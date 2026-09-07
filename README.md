<div align="center">

  <a href="https://metaviewer.vercel.app/">
    <img src="https://raw.githubusercontent.com/bilalmlkdev/Metaviewer/main/public/favicon.svg" alt="Metaviewer logo" width="100%" height="120">
  </a>

  # Metaviewer

  Free, open-source link preview & meta tag analyzer. See how your URL renders on Google, X, LinkedIn, <br> Discord, Slack, WhatsApp, Telegram, Facebook & iMessage - with a 0–100 score, real decoded image dimensions, and copy-paste fixes. No signup, no database.

  [![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-black?style=for-the-badge)](https://metaviewer.vercel.app)
[![GitHub Stars](https://img.shields.io/github/stars/bilalmlkdev/Metaviewer?style=for-the-badge&logo=github&color=yellow)](https://github.com/bilalmlkdev/Metaviewer.git)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)


  [![Metaviewer Dashboard](https://raw.githubusercontent.com/bilalmlkdev/Metaviewer/main/public/preview.png)](https://metaviewer.vercel.app/)

</div>

# The Problem This Solves

You share a link and the preview card that shows up in Slack, Discord, or X looks wrong - missing image, blank title, or nothing at all. The page's own HTML looks fine when you eyeball it. Browser dev tools don't tell you which of the 40-odd things that could be wrong actually is, and every platform reads Open Graph and Twitter Card tags slightly differently, so "it works on X" doesn't mean it works anywhere else.

Metaviewer replaces the guessing with an actual score. Paste a URL and get a 0-100 grade across six categories, a real rendered preview on nine platforms side by side, and a specific copy-paste fix for every check that's failing - not a generic "add an og:image tag" but the exact line your page is missing.

# What You Actually Get

- **You stop guessing which platform is broken.** Live previews for Google, X, LinkedIn, Discord, Slack, WhatsApp, Telegram, Facebook, and iMessage, side by side, so you see the actual difference instead of imagining it.
- **You get a real score, not a pass/fail.** 0-100 with an A-F grade across six categories and 40+ individual checks - enough resolution to tell "basically fine" from "one tag away from perfect."
- **Image dimensions are verified, not trusted.** Your OG image, favicon, and apple-touch-icon get their actual pixel dimensions decoded from the file bytes - if a site's `og:image:width` tag lies about the real size, Metaviewer tells you that specifically, instead of repeating the lie back to you.
- **Every failing check comes with the fix.** Not "improve your meta tags" - a copy-paste-ready line for that exact check, every time.
- **You can take the result with you.** Export as JSON, CSV, raw HTML, or PNG, or share the result URL directly.
- **Nothing requires an account.** History lives in your browser; there's no sign-up standing between you and a check.

# How It Works Under the Hood

**One server hop, and only because browsers force it.** Submitting a URL sends you straight to a full-page loading screen while `app/api/analyze/route.ts` fetches the target page server-side, parses it with cheerio, probes its images for real dimensions, and scores it. That's the only server-side step, and it exists purely because a browser can't `fetch()` arbitrary cross-origin HTML - nothing about your check is stored on the server.

**Results live in your browser, on purpose.** The finished analysis saves to `localStorage` via `lib/localHistory.ts` and renders at `/results/[id]`. That means a result link only resolves in the browser that ran the check - it won't open on your phone if you ran it on your laptop. That's a real trade-off, not an oversight: `localHistory.ts` is written as thin wrapper functions specifically so swapping in a real backend later (Supabase or otherwise) doesn't require touching anything that calls it.

**Image dimensions are read from bytes, not trusted from meta tags.** `lib/imageDimensions.ts` is a small, dependency-free binary parser that reads PNG/JPEG/GIF/WebP/BMP/ICO headers directly from a ranged fetch - no image-decoding library, no full download. It's the reason Metaviewer can tell you when a site's declared `og:image` dimensions don't match what's actually in the file.

**Scoring has one source of truth.** `lib/analyzer.ts` holds `CHECKS[]`, and every result tab reads `result.checks` / `result.categoryScores` from it - no tab recomputes pass/fail on its own, so the score you see on the Score tab and the checks shown elsewhere can never quietly disagree.

# The Results Page

Seven tabs, all reading the same `AnalysisResult`, nothing mocked: Previews, Basic, Open Graph, X/Twitter, Images, Raw, Score.

- **Previews** renders all nine platform cards in a Pinterest-style masonry grid (CSS `columns`, no JS layout library) - each card sizes to its own content instead of being clipped to a shared height, and reflows cleanly when you filter by All / Search / Social / Messaging.
- **Score** shows a real, check-specific fix from `lib/checkFixes.ts` for anything not passing, instead of just repeating the check's own description back at you.
- **Images** shows decoded pixel dimensions for your OG image, favicon, and apple-touch-icon, flagging the difference when a site's declared dimensions don't match what was actually fetched.
- **Basic** surfaces detected JSON-LD `@type`s under a Structured Data row, backed by the `structured-data` check.

# Tech Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS**, CSS-variable theming (dark/light, no flash on load)
- **cheerio** for server-side HTML parsing
- No UI/animation component libraries - everything here is hand-built
- No image-decoding library - dimension probing is a from-scratch header parser

# Project Structure

```
app
├── page.tsx                    homepage: URL form, features, FAQ
├── layout.tsx                   root layout + theme init script
├── globals.css                    theme variables + animation keyframes
├── analyzing/page.tsx              full-page loading state while a check runs
├── history/page.tsx                 local check history, from localStorage
├── api/analyze/route.ts              server fetch + parse + score, no persistence
└── results/[id]/page.tsx              results page: tabs, score card, actions

components
├── AnalyzeForm.tsx, SiteHeader.tsx, ThemeToggle.tsx, ExportMenu.tsx
├── RecentAnalysis.tsx        homepage recent-checks section, hidden until
│                                a check exists, links to /history
├── ScoreRing.tsx, CategoryBars.tsx, StatusBadge.tsx
├── PlatformPreviewCard.tsx    a single platform preview, sized to its own content
└── results
    ├── ResultTabs.tsx, StatusIcon.tsx, CodeFixBlock.tsx
    ├── PreviewsTab.tsx          masonry grid of all 9 platform cards
    └── BasicTab.tsx, OpenGraphTab.tsx, TwitterTab.tsx, ImagesTab.tsx, RawTab.tsx, ScoreTab.tsx

lib
├── extract.ts             server fetch + cheerio parse: robots.txt, sitemap.xml,
│                             security headers, HTTP status/timing, JSON-LD
│                             detection, image dimension probing, rawTags[]
├── imageDimensions.ts       dependency-free PNG/JPEG/GIF/WebP/BMP/ICO header parser
├── analyzer.ts               CHECKS[] - single source of truth for scoring
├── checkFixes.ts               one actionable fix string per check id
├── platforms.ts, platformPreview.ts
├── localHistory.ts             the entire persistence layer
├── exportResult.ts               JSON/CSV/HTML/PNG export functions
└── id.ts, timeAgo.ts

types/index.ts    all shared TypeScript types - extend here first
```

# Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for Production

```bash
npm run build
npm run start
```

Deploys cleanly to Vercel with zero configuration - a standard Next.js 14 App Router project, one serverless API route, no environment variables required. Verified locally with a clean `npm install && npm run build` on Next.js 14.2.35, strict TypeScript, `noUncheckedIndexedAccess` on.

# Known Gaps

Worth knowing about before you rely on this for something critical:

- **No Accessibility or Performance scoring yet.** Would need real checks - page-wide alt-text audit, heading hierarchy, form labels, render-blocking resource detection - none of which exist today.
- **Image dimension probing has a real limit.** JPEG SOF markers are read from the first 256KB fetched, which covers the overwhelming majority of real photos and screenshots, but a JPEG with a large embedded thumbnail or ICC profile ahead of the frame header can still come back "Unknown." Progressive JPEGs and animated WebP/GIF are read for their first frame's dimensions only - correct for preview purposes either way.
- **Results don't follow you across devices**, by design - see "How It Works" above. This is exactly the seam a real backend would slot into: swap `localHistory.ts`'s internals, keep its function signatures.
- **Fix strings in `checkFixes.ts` are static**, not interpolated from the site's actual extracted values - unlike the Open Graph/Twitter tabs' `CodeFixBlock`, which does fill in real values. Upgrading fixes to include the site's own URL/title/etc. is an open improvement.

# Contributing

1. Don't add a database or auth unless there's a genuinely good reason to - this stays local-first on purpose.
2. New meta or technical fields flow in one direction: `types/index.ts` → `lib/extract.ts` → `lib/analyzer.ts` (plus `lib/checkFixes.ts` if it's a scored check) → the relevant results tab.
3. Never hardcode colors - use the theme tokens (`text-fg`, `bg-background`, `bg-surface`, `border-border`, `text-muted`, `text-accent`).
4. No new npm dependencies without a real reason - image dimension probing was deliberately hand-rolled instead of pulling in a library; keep that instinct unless something genuinely justifies the addition.
5. Keep `lib/analyzer.ts` as the single scoring source of truth - tabs read `result.checks` / `result.categoryScores`, they never recompute pass/fail themselves.

# License (MIT)

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2026 Bilal Malik

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
