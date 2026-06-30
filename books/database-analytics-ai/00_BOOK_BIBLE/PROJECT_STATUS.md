# Project Status

**Book:** Modern Data Systems for Analytics and AI  
**Edition:** v2.0 (rewrite from scratch)  
**Last updated:** 2026-06-30  
**Updated by:** Publish + deploy session

---

## Overall status

| Metric | Target (v2) | Current |
|--------|-------------|---------|
| Parts | 4 | 4 planned (not finalized in catalog) |
| Chapters | 40–45 | 1 published (v2 Ch.1) · 24 v1 legacy in repo |
| Pages | ~500 | ~10,825 words (Ch.1) |
| Learning objects | TBD | 7+ in atlas (v1/v2 mixed) |
| Book Bible | Complete | **Active** |

**Phase:** Chapter 1 v2 **live on site**. Refinement or Chapter 2 next.

---

## Book Bible files

| File | Status |
|------|--------|
| `SYSTEM_PROMPT.md` | ✅ v2.0 constitution complete |
| `PROJECT_STATUS.md` | ✅ This file |
| `AUTHOR_DECISIONS.md` | ✅ Initialized |
| `CURRENT_CONTEXT.md` | ✅ Initialized |
| `README.md` | ✅ Session workflow documented |

---

## v2 chapter progress

### Part I — Understanding Enterprise Data

| Ch | Title | Status | Words | Notes |
|----|-------|--------|-------|-------|
| 1 | Why Data Still Matters in the Age of AI | **published (v2 live)** | ~10,825 | 20 sections · Git `4788138` · Firestore + Firebase deployed 2026-06-30 |
| 2 | Data as a Business Asset | not started | — | |
| 3 | The Enterprise Data Journey | not started | — | |
| 4 | Types of Data Systems | not started | — | |
| 5 | Data Architecture Fundamentals | not started | — | |
| 6 | Cloud vs On-Premise Data Strategy | not started | — | |
| 7 | Data Governance and Trust | not started | — | |
| 8 | The Analytics Professional's Role | not started | — | |

### Parts II–IV

Not yet cataloged for v2. v1 chapters 5–24 in `books/database-analytics-ai/chapters/` are **legacy reference only**.

---

## Learning objects (atlas)

| ID | Title | Status | Chapter |
|----|-------|--------|---------|
| LO-007 | Why Organizations Need Different Types of Databases | ready | CH-001 |
| *(others)* | See `atlas/learning-objects/index.json` | mixed | — |

---

## Infrastructure

| Item | Status |
|------|--------|
| Book Bible architecture | ✅ Created 2026-06-30 |
| Cursor rule (`book-bible.mdc`) | ✅ Created |
| OpenAI repo-context pipeline | ✅ Live |
| Chapter 1 on website | ✅ https://istextbook-e8a3b.web.app/read/database-analytics-ai/why-data-still-matters |
| Old Ch.1 archived | ✅ `why-databases-still-matter-ai` → `_archive/chapters/` + Firestore |
| v2 chapters catalog YAML | ⬜ Not created |
| Meridian Retail Group character bible | ⬜ Not created |
| Part I chapter outline (detailed) | ⬜ Not created |

---

## Blockers

| Blocker | Owner | Notes |
|---------|-------|-------|
| Remove duplicate old Ch.1 (`why-databases-still-matter-ai`) from Firestore TOC | Chief Author | ~~Old slug may still appear beside new v2 chapter~~ **Resolved 2026-06-30** — archived in Firestore + Git |

---

## Recent sessions

| Date | Work completed |
|------|----------------|
| 2026-06-30 | OpenAI: `chapters/01-why-data-still-matters/sections/05-why-this-matters.md` (406 words) |
| 2026-06-30 | OpenAI: `chapters/01-why-data-still-matters/sections/04-executive-summary.md` (256 words) |
| 2026-06-30 | OpenAI: `chapters/01-why-data-still-matters/sections/03-learning-objectives.md` (276 words) |
| 2026-06-30 | OpenAI: `chapters/01-why-data-still-matters/sections/02-think-first.md` (494 words) |
| 2026-06-30 | OpenAI: `chapters/01-why-data-still-matters/sections/01-opening-story.md` (530 words) |
| 2026-06-30 | Committed, published, deployed Chapter 1 v2 (20 sections) |
| 2026-06-30 | OpenAI repo-context pipeline + Ch1 first draft |

---

## Next milestones

1. Finalize Part I chapter catalog (8–10 chapters with slugs and summaries)
2. Create Meridian Retail Group character bible (1–2 pages)
3. Rewrite Chapter 1 to v2 22-section structure
4. Register LOs for all Chapter 1 sections
5. Expand atlas learning object index for v2
