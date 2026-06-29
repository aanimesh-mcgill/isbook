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
| Application code | GitHub |
| Textbook content (Markdown) | Firestore |
| Images & figures | Firebase Storage |

**Never store textbook chapters as HTML files in Git.**

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
