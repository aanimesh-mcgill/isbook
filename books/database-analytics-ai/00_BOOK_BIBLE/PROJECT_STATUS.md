# Project Status

**Book:** Modern Data Systems for Analytics and AI  
**Edition:** v2.0 (rewrite from scratch)  
**Last updated:** 2026-06-30
**Updated by:** Chief Author session — Book Bible architecture initialized

---

## Overall status

| Metric | Target (v2) | Current |
|--------|-------------|---------|
| Parts | 4 | 4 planned (not finalized in catalog) |
| Chapters | 40–45 | 0 v2-ready · 24 v1 legacy |
| Pages | ~500 | ~0 v2 |
| Learning objects | TBD | 7+ in atlas (v1/v2 mixed) |
| Book Bible | Complete | **Initialized** |

**Phase:** Chapter 1 v2 first draft complete (~20 sections). Refinement pass next.

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
| 1 | Why Data Still Matters in the Age of AI | **draft (v2 complete)** | ~10,825 | All 20 v2 sections generated via OpenAI; refinement pending |
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
| OpenAI repo-context pipeline (`scripts/lib/repo-context.mjs`) | ✅ Created |
| v2 section catalog (`section-catalog-v2.yaml`) | ✅ Created |
| v2 chapters catalog YAML | ⬜ Not created |
| Meridian Retail Group character bible | ⬜ Not created |
| Part I chapter outline (detailed) | ⬜ Not created |

---

## Blockers

| Blocker | Owner | Notes |
|---------|-------|-------|
| v2 chapter catalog not finalized | Chief Author | Part I topics listed in SYSTEM_PROMPT §27; need full 40–45 chapter YAML |
| v1 vs v2 coexistence | Chief Author | Decide: archive v1 chapters or keep as reference |
| atlas-publisher rule conflict | Documented in AUTHOR_DECISIONS AD-015 — Book Bible author mode vs publisher-only mode |

---

## Recent sessions

| Date | Work completed |
|------|----------------|
| 2026-06-30 | OpenAI: `chapters/01-why-data-still-matters/sections/05-why-this-matters.md` (406 words) |
| 2026-06-30 | OpenAI: `chapters/01-why-data-still-matters/sections/04-executive-summary.md` (256 words) |
| 2026-06-30 | OpenAI: `chapters/01-why-data-still-matters/sections/03-learning-objectives.md` (276 words) |
| 2026-06-30 | OpenAI: `chapters/01-why-data-still-matters/sections/02-think-first.md` (494 words) |
| 2026-06-30 | OpenAI: `chapters/01-why-data-still-matters/sections/01-opening-story.md` (530 words) |
| 2026-06-30 | OpenAI repo-context pipeline + Ch1 `01-opening-story.md` v2 draft (530 words) |

---

## Next milestones

1. Finalize Part I chapter catalog (8–10 chapters with slugs and summaries)
2. Create Meridian Retail Group character bible (1–2 pages)
3. Rewrite Chapter 1 to v2 22-section structure
4. Register LOs for all Chapter 1 sections
5. Expand atlas learning object index for v2
