# Author Decisions

**Purpose:** Locked decisions that must not be re-litigated across sessions.  
If a new session proposes something that contradicts an entry here, stop and escalate to the human Chief Author.

**Last updated:** 2026-06-30

---

## AD-001 — Repository as memory (Book Bible architecture)

**Decision:** The textbook project's constitution lives in `books/database-analytics-ai/00_BOOK_BIBLE/`, not in chat history or external prompts.

**Implication:** Every Cursor session reads Book Bible files before authoring. `PROJECT_STATUS.md` and `CURRENT_CONTEXT.md` are updated after every session.

**Supersedes:** External ChatGPT-as-Chief-Author workflow for v2 content generation.

---

## AD-002 — Version 2 is a full rewrite

**Decision:** v2 (`Modern Data Systems for Analytics and AI`) is written from scratch using the Book Bible constitution. v1 manuscript (24 chapters) is reference material only.

**Implication:** Do not patch v1 chapters incrementally. Rewrite chapters to the 22-section v2 structure.

**v1 location:** `books/database-analytics-ai/chapters/` (legacy)

---

## AD-003 — Book title and subtitle (v2)

| Field | Value |
|-------|-------|
| Title | Modern Data Systems for Analytics and AI |
| Subtitle | A Business-First Approach to Enterprise Data, Analytics, and Artificial Intelligence |
| Slug | `database-analytics-ai` (unchanged) |

**Supersedes:** v1 title "Database and Distributed Systems for Analytics in the Age of AI"

---

## AD-004 — Target audience

MBA Analytics · MS Business Analytics · Advanced Undergraduate Analytics · Senior MIS · Business Schools.

Assume little prior database knowledge. Students are comfortable with technology.

---

## AD-005 — Pedagogy order: WHY → WHAT → WHEN → HOW

Never reverse. Never open with definitions. Never teach syntax before business motivation.

See SYSTEM_PROMPT §8 and `docs/atlas/EDITORIAL_FRAMEWORK.md`.

---

## AD-006 — Chapter structure: 22 sections

Every v2 chapter uses the 22-section structure defined in SYSTEM_PROMPT §18. No exceptions without a new AD entry.

**Supersedes:** v1 15-section constitution catalog (`section-catalog-constitution.yaml`) for new content.

---

## AD-007 — Fictional spine company: Meridian Retail Group

**Decision:** Use **Meridian Retail Group** as the recurring fictional omnichannel retailer connecting chapters.

**Cast (initial):**
- Priya Sharma — VP Data & Analytics
- Marcus Chen — Analytics Manager
- Elena Rodriguez — Senior Data Engineer
- James Okonkwo — Director of Store Operations

**Do not rename** without a new AD entry. Character bible to be expanded in a future deliverable.

---

## AD-008 — Real companies for industry examples

Reuse: Amazon, Netflix, Uber, Spotify, Tesla, Shopify, Disney, Starbucks, Costco, Walmart, OpenAI, Microsoft, Google.

Use real companies in Industry Insight sections. Use Meridian for continuity exercises and worked examples.

---

## AD-009 — SQL dialect default

**MySQL syntax** unless explicitly comparing dialects (then add Snowflake/BigQuery notes).

SQL must always follow: Business Question → Schema → Sample Data → Expected Output → SQL → Explanation → Result.

---

## AD-010 — AI in every chapter

Every chapter includes an AI activity where students **critique** AI output — not blind trust.

2026 context: every technology chapter must address how AI affects that technology.

---

## AD-011 — Book scope: 4 parts, ~40–45 chapters, ~500 pages

| Part | Title |
|------|-------|
| I | Understanding Enterprise Data |
| II | Working with Enterprise Data |
| III | Modern Enterprise Data Platforms |
| IV | Building AI-Driven Organizations |

Detailed chapter catalog for Parts II–IV not yet locked.

---

## AD-012 — Permanent IDs never change

Learning objects (`LO-NNN`), chapters (`CH-NNN`), concepts (`CONCEPT-NNN`), figures (`FIG-NNN`) are immutable once published.

See `docs/atlas/PERMANENT_IDS.md`.

---

## AD-013 — ISBX is the manuscript format

Markdown + YAML frontmatter + fenced blocks. One file per section. Git is canonical.

See `docs/CANONICAL_FORMAT.md`.

---

## AD-014 — Depth over breadth

When choosing between covering more technologies or fewer technologies deeply, always choose depth.

---

## AD-015 — Publishing vs authoring mode

| Mode | When | Cursor role |
|------|------|-------------|
| **Authoring** | Working in `00_BOOK_BIBLE/`, writing v2 chapters | Chief Author — write and improve content |
| **Publishing** | Importing deliverables, running `atlas:publish` | Publisher — store exactly, never rewrite prose |

When `.cursor/rules/book-bible.mdc` applies, authoring mode takes precedence for book content.

---

## AD-016 — OpenAI direct authoring with repository context

**Decision:** Cursor writes book content by calling OpenAI via `npm run author:write`, not by generating prose in chat.

**Pipeline:**
1. System prompt = all 4 Book Bible files
2. User prompt = section rules + **repository context** (prior sections, chapter index, learning objects)
3. Output written directly to `books/database-analytics-ai/chapters/.../sections/`
4. `PROJECT_STATUS.md` and `CURRENT_CONTEXT.md` updated after each write

**Implication:** The repo is the source of truth for consistency. OpenAI reads prior manuscript before each section.

**Command:** `npm run author:write -- --chapter <dir> --section <slug>`

---

## Decision log (append-only)

| ID | Date | Summary |
|----|------|---------|
| AD-001 | 2026-06-30 | Book Bible repository-as-memory architecture |
| AD-002 | 2026-06-30 | v2 full rewrite |
| AD-003 | 2026-06-30 | v2 title and subtitle |
| AD-004 | 2026-06-30 | Target audience |
| AD-005 | 2026-06-30 | WHY→WHAT→WHEN→HOW pedagogy |
| AD-006 | 2026-06-30 | 22-section chapter structure |
| AD-007 | 2026-06-30 | Meridian Retail Group fictional spine |
| AD-008 | 2026-06-30 | Recurring real companies |
| AD-009 | 2026-06-30 | MySQL default dialect |
| AD-010 | 2026-06-30 | AI in every chapter |
| AD-011 | 2026-06-30 | 4 parts, 40–45 chapters |
| AD-012 | 2026-06-30 | Permanent IDs immutable |
| AD-013 | 2026-06-30 | ISBX format |
| AD-014 | 2026-06-30 | Depth over breadth |
| AD-015 | 2026-06-30 | Authoring vs publishing mode |
| AD-016 | 2026-06-30 | OpenAI direct authoring with repo context |
