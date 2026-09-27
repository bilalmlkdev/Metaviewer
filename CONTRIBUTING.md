# Contributing to Metaviewer

Thanks for your interest in contributing. This document explains how to get set up, what we accept, and how to get your change merged.

## Getting Started

```bash
git clone https://github.com/bilalmlkdev/Metaviewer.git
cd Metaviewer
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the homepage with the URL form.

Before submitting a PR, always run:

```bash
npm run lint
npm run build
```

Both must pass. The project uses strict TypeScript with `noUncheckedIndexedAccess` on.

## Project Philosophy

Read this before opening a PR - it explains why the codebase looks the way it does.

1. **No database, no auth.** History lives in `localStorage` via `lib/localHistory.ts`. This is local-first by design. Don't add a backend unless there's a genuinely compelling reason.
2. **No new npm dependencies without justification.** Image dimension probing was deliberately hand-rolled (`lib/imageDimensions.ts`) instead of pulling in a library. Keep that instinct.
3. **No hardcoded colors.** Use theme tokens: `text-fg`, `bg-background`, `bg-surface`, `border-border`, `text-muted`, `text-accent`.
4. **`lib/analyzer.ts` is the single source of truth for scoring.** Tabs read `result.checks` / `result.categoryScores`. Never recompute pass/fail in a component.

## Architecture

Understanding the data flow before making changes:

### Adding a new meta/technical field

Data flows in one direction:

```
types/index.ts  →  lib/extract.ts  →  lib/analyzer.ts  →  relevant results tab
                       ↑
                  lib/checkFixes.ts  (if it's a scored check with a fix string)
```

1. Define the type in `types/index.ts`
2. Extract it in `lib/extract.ts`
3. Add a check to `CHECKS[]` in `lib/analyzer.ts`
4. Add a fix string in `lib/checkFixes.ts` if the check is scored
5. Display it in the relevant tab under `components/results/`

### Key directories

| Directory | Purpose |
|-----------|---------|
| `app/` | Routes, API endpoints, pages |
| `components/` | Reusable UI components |
| `components/results/` | Results page tab components |
| `components/sections/` | Landing page sections |
| `components/ui/` | Small shared primitives (badges, cards, icons) |
| `hooks/` | Client-side React hooks (one per page/feature) |
| `lib/` | Business logic, extraction, scoring, utilities |
| `types/` | Shared TypeScript types |

### Page structure convention

Pages are thin - they compose hooks and components, they don't hold logic:

```
app/page.tsx          →  composes components/sections/*
app/history/page.tsx  →  uses hooks/useHistory + components/HistoryCard
app/results/[id]/page.tsx  →  uses hooks/useResult + components/results/*
```

Logic lives in `hooks/` and `lib/`. UI lives in `components/`.

## Making Changes

### Bug fixes

1. Open an issue first (unless it's a trivial typo fix)
2. Fork and create a branch: `git checkout -b fix/short-description`
3. Fix the bug
4. Add or update tests if applicable
5. Run `npm run lint && npm run build`
6. Open a PR referencing the issue

### New features

1. Open an issue first to discuss the feature - this saves time on both sides
2. Fork and create a branch: `git checkout -b feat/short-description`
3. Implement following the architecture above
4. Update `README.md` if the feature changes user-facing behavior
5. Run `npm run lint && npm run build`
6. Open a PR

### Adding a new platform preview

1. Add the platform definition to `lib/platforms.ts`
2. Add rendering logic to `lib/platformPreview.ts`
3. The platform automatically appears in the Previews tab - no other changes needed

## Code Style

- **TypeScript strict mode** - no `any` unless absolutely necessary (use `as` casts sparingly)
- **Component naming** - PascalCase, one component per file, filename matches export
- **File organization** - `"use client"` at the top of client components; server components have no directive
- **Imports** - use `@/` path alias for project imports
- **Animations** - use existing CSS keyframes (`rise-in`, `fade-in`) in `globals.css`; avoid adding animation libraries
- **No comments** unless explaining a non-obvious workaround

## Commit Messages

Use concise, imperative-style messages:

```
fix: prevent card shrink in RecentAnalysis grid
feat: add CSV export for history entries
refactor: extract isValidUrl into lib/url.ts
docs: update project structure in README
```

Prefix with one of: `feat`, `fix`, `refactor`, `docs`, `style`, `perf`, `chore`.

## Pull Request Guidelines

- Keep PRs focused - one concern per PR
- Fill out the PR template
- Link related issues with `Closes #123`
- Ensure CI passes (lint + build)
- Be responsive to review comments
- Don't force-push after review has started (add new commits instead)

## Reporting Bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md). Include:

- The URL you were analyzing (if relevant)
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS

## Feature Requests

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md). Describe:

- The problem you're trying to solve
- Your proposed solution
- Alternatives you've considered

## Questions?

Open a [discussion](https://github.com/bilalmlkdev/Metaviewer/discussions) or comment on an existing issue.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
