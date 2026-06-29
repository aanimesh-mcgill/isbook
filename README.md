# AI-First Information Systems Textbook Platform

Production-quality PWA for hosting AI-first Information Systems textbooks.

## Stack

- React 19 + TypeScript + Vite
- Material UI (MUI)
- React Router + TanStack Query
- Firebase (Auth, Firestore, Storage, Hosting)
- PWA with offline caching

## Content Philosophy

| What | Where |
|------|-------|
| Application code | GitHub (`src/`) |
| **Canonical manuscripts** | GitHub (`books/`) — Markdown + YAML |
| Runtime content | Firestore (parsed by publishing engine) |
| Images & figures | `books/.../figures/` → Firebase Storage |

**Never store textbook content as Firestore JSON or HTML in Git.**

### Publishing Pipeline

```
ChatGPT (author)  →  Markdown section in books/
       ↓
Cursor (engine)   →  validate → parse → Firestore → deploy
```

```bash
npm run validate -- --book <slug> --chapter <dir>
npm run publish  -- --book <slug> --chapter <dir>
npm run firebase:deploy
```

See `SYSTEM_PROMPT.md` and `docs/CANONICAL_FORMAT.md`.

### Generate sections with ChatGPT (OpenAI API)

```bash
npm run author -- --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution --section learning-objectives
```

See `docs/author/OPENAI_AUTHOR.md` for setup.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start dev server
npm run dev

# Build for production
npm run build
```

## Firebase Setup

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Select project: `firebase use istextbook-e8a3b`
4. Deploy rules & indexes: `npm run firebase:rules`
5. Seed sample content: `npm run seed`
6. Deploy hosting: `npm run firebase:deploy`

## Project Structure

```
src/
  components/     Shared UI components
  features/       Feature modules (auth, reader, cms)
  pages/          Route-level page components
  hooks/          Custom React hooks
  services/       Firestore data access
  firebase/       Firebase initialization
  types/          TypeScript type definitions
  layouts/        App shell layouts
  theme/          MUI theme configuration
docs/             Architecture & specifications
scripts/          Seed & utility scripts
```

## Development Phases

- **Phase 1** (current): Project setup, Firebase, Auth, PWA, Hosting
- **Phase 2**: Reader — navigation, Markdown renderer, responsive layout
- **Phase 3**: CMS — book/chapter/section editors
- **Phase 4**: Search, bookmarks, notes, offline
- **Phase 5**: AI tutor, quizzes, flashcards

## Documentation

See the [`docs/`](docs/) folder for architecture, database schema, and roadmap.

## License

Private — McGill University Information Systems Textbook Project
