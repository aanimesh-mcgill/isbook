# Textbook Operating System (TOS)

We are not writing chapters. We are **designing learning experiences**.

A chapter is a **container**. The product is the sequence of questions, stories, diagrams, experiments, discussions, labs, AI activities, and reflections that change how students think.

TOS is the architecture that makes that repeatable, scalable, and professional.

---

## The five engines

| Engine | Purpose | Location |
|--------|---------|----------|
| **Pedagogy Engine** | How every concept is taught — learning cycle, experience blocks, voice, SQL rules | `docs/tos/pedagogy-engine/` |
| **Content Engine** | Reusable schemas, cases, datasets, explanations, visuals | `docs/tos/content-engine/` |
| **Assessment Engine** | Quizzes, prediction questions, reflections, labs, projects | `docs/tos/assessment-engine/` |
| **Publishing Engine** | Website, PDF, slides, instructor notes, companion resources | `docs/tos/publishing-engine/` |
| **AI Engine** | AI activities, critique tasks, generation/revision/student-review passes | `docs/tos/ai-engine/` |

---

## How a chapter works

A **chapter instance** is a configuration file that composes assets from all five engines:

```
books/{book}/instances/{NN}-{slug}.yaml
```

Example: `books/database-analytics-ai/instances/12-aggregation-grouping.yaml`

It specifies:

- Which **business schema** to reuse (Content Engine)
- Which **concepts** this experience teaches (Pedagogy Engine)
- Which **assessment types** to include (Assessment Engine)
- Continuity with prior and next experiences
- Optional **content sources** to ingest (existing manuscript, lecture slides)

The generator does not "write a chapter." It **assembles a learning experience** from engine assets and prompts.

---

## Inputs to the Content Engine

| Source | Role |
|--------|------|
| `books/database-analytics-ai/` (existing generated manuscript) | Raw material to refine, not publish as-is |
| Lecture slides (future: `content-engine/sources/slides/`) | Alternate explanations, diagrams, classroom pacing |
| Industry cases, datasets, schemas | Canonical reusable assets |

The output should feel like a **professionally designed learning platform**, not an AI-generated book or slide deck pasted into a website.

---

## Commands

```bash
# Generate one experience block (section)
npm run author -- --book database-analytics-ai --chapter 12-aggregation-grouping --section worked-example --instance 12-aggregation-grouping --catalog tos

# Generate full chapter instance (all 15 experience blocks)
npm run author:chapter -- --book database-analytics-ai --chapter 12-aggregation-grouping --instance 12-aggregation-grouping --catalog tos

# Quality passes (AI Engine)
npm run author:revise -- --book database-analytics-ai --chapter 12-aggregation-grouping
npm run author:student-review -- --book database-analytics-ai --chapter 12-aggregation-grouping

# Full pipeline
npm run author:pipeline -- --book database-analytics-ai --chapter 12-aggregation-grouping --instance 12-aggregation-grouping --catalog tos
```

---

## For Cursor

When working on `books/database-analytics-ai/` or learning objects, read **in order**:

1. `books/database-analytics-ai/00_BOOK_BIBLE/SYSTEM_PROMPT.md`
2. `books/database-analytics-ai/00_BOOK_BIBLE/PROJECT_STATUS.md`
3. `books/database-analytics-ai/00_BOOK_BIBLE/AUTHOR_DECISIONS.md`
4. `books/database-analytics-ai/00_BOOK_BIBLE/CURRENT_CONTEXT.md`
5. Target chapter / learning object files

See `.cursor/rules/book-bible.mdc`.

Legacy TOS pedagogy prompt: `docs/tos/pedagogy-engine/system-prompt.md` (redirects to Book Bible).

---

## Migration note

Former names map to TOS as follows:

| Old name | TOS engine |
|----------|------------|
| Book Constitution | **Book Bible** (`books/database-analytics-ai/00_BOOK_BIBLE/SYSTEM_PROMPT.md`) |
| Book Blueprint / chapter prompt | Chapter instance (`books/{book}/instances/`) |
| Revision / Student Review prompts | AI Engine |
| `SYSTEM_PROMPT.md` + publish scripts | Publishing Engine |

Deprecated paths remain as redirects until all scripts and docs are updated.
