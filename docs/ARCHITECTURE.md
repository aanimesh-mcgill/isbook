# Architecture

## Overview

The IS Textbook Platform is a multi-tenant publishing system designed to host multiple textbooks. It consists of two major applications:

1. **Student Reader** — Read, search, bookmark, highlight, take notes, offline reading, AI tutor
2. **Author CMS** — Create and publish book content (Phase 3)

## System Diagram

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   React     │────▶│   Firebase   │────▶│  Firestore  │
│   PWA       │     │   Auth       │     │  (content)  │
└─────────────┘     └──────────────┘     └─────────────┘
       │                   │                    │
       │            ┌──────────────┐     ┌─────────────┐
       └───────────▶│   Firebase   │────▶│   Storage   │
                    │   Hosting    │     │  (images)   │
                    └──────────────┘     └─────────────┘
```

## Key Decisions

### Content in Firestore, Not Git

Textbook content is stored as Markdown in Firestore `contentBlocks` collection. This enables:

- Real-time publishing without code deploys
- CMS editing (Phase 3)
- Version control via Firestore (future)
- Multi-book support without repo changes

### Feature Folders

Code is organized by feature (`src/features/`) not by type. Each feature owns its components, hooks, and logic.

### Role-Based Authorization

Six roles: `anonymous`, `student`, `instructor`, `author`, `editor`, `administrator`. Enforced in Firestore security rules and UI.

## Frontend Architecture

```
App
├── QueryClientProvider
├── AppThemeProvider (dark/light mode)
├── AuthProvider (Firebase Auth + user profile)
└── BrowserRouter
    ├── RootLayout (home, login, book list)
    └── ReaderLayout (chapter reading with TOC)
```

## Data Flow

1. **Author (ChatGPT)** writes one section at a time in ISBX format → `books/`
2. **Publishing engine (Cursor)** validates with `npm run validate`
3. Parser (`scripts/lib/parse-section.mjs`) transforms Markdown → content blocks
4. `npm run publish` writes to Firestore (never edits author prose)
5. React app reads Firestore via TanStack Query
6. `ContentBlockRenderer` displays blocks with `react-markdown`

### Separation of Concerns

| Layer | Role |
|-------|------|
| `books/` (Git) | Canonical archive — PDF, EPUB, LMS can be generated from here |
| Firestore | Optimized runtime database for the website |
| `src/` | Application code only |

## PWA Strategy

- **App shell**: Cached via Workbox (JS, CSS, HTML)
- **Firestore content**: NetworkFirst strategy (5 min stale, 24h cache)
- **Storage images**: CacheFirst strategy (30 day cache)

## Future: Cloud Functions

Reserved for Phase 5 AI features:

- AI tutor endpoint
- Quiz generation
- Search indexing
- Analytics aggregation
