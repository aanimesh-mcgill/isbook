# Current Context

**Purpose:** What we're working on *right now*. Update at the start and end of every session.

**Last updated:** 2026-06-30
**Session focus:** Chapter 1 committed, published, deployed — live on site

---

## Active task

**Chapter 1 v2 is live.** Git commit `4788138`, Firestore published, Firebase deployed.

Status: **Published** — refine content or start Chapter 2

---

## Immediate next task

1. **Optional:** Remove/archive old Chapter 1 slug `why-databases-still-matter-ai` from Firestore (duplicate in TOC)
2. **Refinement pass** on Chapter 1: `npm run author:revise -- --book database-analytics-ai --chapter 01-why-data-still-matters`
3. **Chapter 2**: create catalog entry + `npm run author:chapter -- --chapter 02-... --from 1 --to 20 --force`

---

## Current chapter

| Field | Value |
|-------|-------|
| Chapter | 1 — Why Data Still Matters in the Age of AI |
| Slug | `01-why-data-still-matters` |
| Part | I — Understanding Enterprise Data |
| Status | **published** — live on site |
| Live URL | https://istextbook-e8a3b.web.app/read/database-analytics-ai/why-data-still-matters |
| Next section to write | Chapter 2 (TBD) or refinement pass on Ch.1 |

---

## Context for Chapter 1

**Opening story angle:** A VP of Data at a company like Meridian (or named real company) discovers their "AI strategy" collapsed because the data foundation was never built. ChatGPT can answer questions — but cannot fix siloed, untrusted, inaccessible data.

**Core concepts to establish:**
- Data is still the foundation of analytics and AI
- Modern enterprises use many database types — not one
- The book's mental model: Business Problem → Data → Technology → Analytics → AI → Decision

**Learning objects already registered:**
- LO-007: Why Organizations Need Different Types of Databases (ready)

**Continuity:**
- This is Chapter 1 — no prior chapter dependencies
- Must preview Part I arc and tease the ecosystem map (Chapter 4)

---

## Files to read next session

```
books/database-analytics-ai/00_BOOK_BIBLE/SYSTEM_PROMPT.md
books/database-analytics-ai/00_BOOK_BIBLE/PROJECT_STATUS.md
books/database-analytics-ai/00_BOOK_BIBLE/AUTHOR_DECISIONS.md
books/database-analytics-ai/00_BOOK_BIBLE/CURRENT_CONTEXT.md   ← this file
books/database-analytics-ai/chapters/01-why-data-still-matters/chapter.yaml
atlas/learning-objects/objects/LO-007.yaml
books/database-analytics-ai/chapters/01-why-data-still-matters/sections/   ← v1 reference only
```

---

## Open questions

| # | Question | Blocking? |
|---|----------|-----------|
| 1 | Archive v1 chapters to `chapters-v1/` or keep in place as reference? | No — can proceed with v2 rewrite in same folders |
| 2 | Final Part I chapter count: 8 or 10? | No — 8 minimum per SYSTEM_PROMPT §27 |
| 3 | Create new `CH-001` metadata or reuse existing chapter.yaml? | No — reuse slug, update summary for v2 |

---

## Session notes

- 2026-06-30: OpenAI wrote `chapters/01-why-data-still-matters/sections/05-why-this-matters.md` (406 words, 26515 tokens)
- 2026-06-30: OpenAI wrote `chapters/01-why-data-still-matters/sections/04-executive-summary.md` (256 words, 20064 tokens)
- 2026-06-30: OpenAI wrote `chapters/01-why-data-still-matters/sections/03-learning-objectives.md` (276 words, 18361 tokens)
- 2026-06-30: OpenAI wrote `chapters/01-why-data-still-matters/sections/02-think-first.md` (494 words, 17855 tokens)
- 2026-06-30: OpenAI wrote `chapters/01-why-data-still-matters/sections/01-opening-story.md` (530 words, 16182 tokens)
- Book Bible constitution (~15–20 pages) written to `SYSTEM_PROMPT.md`
- Cursor rule `book-bible.mdc` created for automatic session loading
- v1 `docs/tos/pedagogy-engine/system-prompt.md` superseded for v2 (redirect added)
- Root `SYSTEM_PROMPT.md` remains Publishing Engine — distinct from Book Bible Chief Author prompt

---

## Handoff to next session

```
Start here:
1. Read all 00_BOOK_BIBLE/ files
2. Ask human Chief Author: "Proceed with Chapter 1 v2 rewrite, starting with Opening Story?"
3. If yes: write 01-opening-story.md following SYSTEM_PROMPT §18 section 1 rules
4. Update PROJECT_STATUS and this file when done
```
