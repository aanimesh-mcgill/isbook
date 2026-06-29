# Developer Onboarding

## Prerequisites

- Node.js 20+
- npm 10+
- Firebase CLI (`npm install -g firebase-tools`)
- Git

## Setup

```bash
git clone https://github.com/aanimesh-mcgill/isbook.git
cd isbook
npm install
cp .env.example .env
```

Edit `.env` with Firebase configuration (see Firebase Console → Project Settings).

## Run Locally

```bash
npm run dev
```

Open http://localhost:5173

## Seed Sample Content

```bash
firebase login
firebase use istextbook-e8a3b
npm run firebase:rules
npm run seed
```

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Routes and providers |
| `src/firebase/config.ts` | Firebase initialization |
| `src/services/books.ts` | Firestore queries |
| `src/features/reader/ContentBlockRenderer.tsx` | Renders textbook content |
| `firestore.rules` | Security rules |
| `docs/DATABASE.md` | Schema reference |

## Workflow

1. ChatGPT designs features → saves spec in `docs/specifications/`
2. Cursor implements the spec
3. Commit with meaningful messages explaining WHY
4. Push and deploy

## Cursor Rules

The `.cursor/rules/` directory contains permanent instructions that Cursor follows automatically.
