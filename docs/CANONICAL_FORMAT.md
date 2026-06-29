# ISBX — Canonical Textbook Format

**ISBX** (Information Systems Book eXchange) is the canonical manuscript format for this platform.

- **Source of truth:** Markdown files in `books/` (Git)
- **Runtime:** Firestore (parsed by the publishing engine)
- **Outputs:** Website, PDF, EPUB, LMS (future — all from the same source)

---

## Design Principles

1. Authors write **Markdown**, not JSON or HTML.
2. Metadata lives in **YAML frontmatter**, not a separate database.
3. Special content types use **fenced blocks** (`:::type`).
4. One file = **one section** (~500–1,500 words).
5. The publishing engine **transforms**; it never **edits**.

---

## Repository Layout

```
books/
  {book-slug}/
    book.yaml
    chapters/
      {NN}-{chapter-slug}/
        chapter.yaml
        sections/
          {NN}-{section-slug}.md
        references.bib
        figures/
          {figure-name}.png
        cases/
        questions/
```

### Naming Rules

| Element | Rule | Example |
|---------|------|---------|
| Book slug | lowercase, hyphens | `managing-organizations-ai` |
| Chapter folder | `{NN}-{slug}` | `01-digital-organization-ai-revolution` |
| Section file | `{NN}-{slug}.md` | `01-opening-case.md` |
| Section slug | lowercase, hyphens | `opening-case` |

---

## book.yaml

```yaml
title: Managing Organizations in the Age of AI
subtitle: An AI-First Introduction to Information Systems
slug: managing-organizations-ai
description: >
  A next-generation textbook for undergraduate and MBA students.
status: published  # draft | published | archived
partCount: 2
chapterCount: 16
```

---

## chapter.yaml

```yaml
title: The Digital Organization and the AI Revolution
slug: digital-organization-ai-revolution
chapterNumber: 1
partNumber: 1
partTitle: Managing Organizations with Digital Technologies
summary: >
  How digital technologies and AI reshape how organizations create value.
order: 1
status: published  # draft | published | archived
```

---

## Section File (.md)

### Frontmatter (required fields)

```yaml
---
title: Opening Case                    # required
section: "1.1"                         # required — section number
order: 1                               # required — sort order in chapter
slug: opening-case                     # required — URL slug
status: draft                          # required — draft | published | archived
learningObjectives:                    # recommended
  - Objective one
  - Objective two
keywords:                              # recommended
  - digital organization
estimatedReadingTime: 15               # recommended — minutes
researchStreams:                       # optional
  - digital transformation
---
```

### Body

Standard Markdown for prose. The parser converts:

- `# Heading` → `heading` block
- `## Heading` at block start → included in following paragraph markdown
- Plain paragraphs → `paragraph` blocks
- Markdown tables → `paragraph` block (rendered via GFM)
- `![alt](figures/name.png)` → `figure` block

### Fenced Blocks

```markdown
:::case
## Company Name

Case narrative in Markdown...
:::

:::research
**Research Question:** Does X improve Y?

**Evidence:** Strong but conditional...
:::

:::manager
Managers should evaluate three factors before investing...
:::

:::ai
**Before AI:** Decisions took weeks.
**After AI:** Real-time recommendations.
:::

:::exercise
Ask your AI assistant: "What are three ways..."
Compare with the framework above.
:::

:::checklist
- [ ] Decision quality improved?
- [ ] Organizational change planned?
:::

:::quote
> "Quote text here."
> — Author, Year
:::

:::callout
**Key Insight:** Information systems are about decisions, not technology.
:::
```

### Fence → Firestore Mapping

| Fence | Block type | UI label |
|-------|-----------|----------|
| `case` | `case` | Case Study |
| `research` | `research_box` | What Research Tells Us |
| `manager` | `callout` | Managerial Implications |
| `ai` | `paragraph` | (in AI Transformation section) |
| `exercise` | `ai_exercise` | AI Exercise |
| `checklist` | `checklist` | Manager Checklist |
| `quote` | `quote` | — |
| `callout` | `callout` | — |

---

## Standard Chapter Sections

Every chapter uses these sections (one `.md` file each):

| Order | Title | Slug |
|-------|-------|------|
| 1 | Opening Case | `opening-case` |
| 2 | Managerial Problem | `managerial-problem` |
| 3 | Learning Objectives | `learning-objectives` |
| 4 | Motivating Questions | `motivating-questions` |
| 5 | Historical Evolution | `historical-evolution` |
| 6 | Core Concepts | `core-concepts` |
| 7 | Research Insights | `research-insights` |
| 8 | Managerial Framework | `managerial-framework` |
| 9 | AI Transformation | `ai-transformation` |
| 10 | Industry Cases | `industry-cases` |
| 11 | Ethical Issues | `ethical-issues` |
| 12 | Manager Checklist | `manager-checklist` |
| 13 | Key Takeaways | `key-takeaways` |
| 14 | Discussion Questions | `discussion-questions` |
| 15 | AI Exercises | `ai-exercises` |
| 16 | Further Reading | `further-reading` |
| 17 | Instructor Notes | `instructor-notes` |

---

## references.bib

Standard BibTeX. Referenced from section content; parsed separately in future.

---

## Validation Rules

The publishing engine rejects manuscripts that:

- Missing required frontmatter fields
- Use HTML tags (`<p>`, `<div>`, etc.)
- Have unclosed fenced blocks
- Use invalid slugs (uppercase, spaces, underscores)
- Exceed 3,000 words per section (warning, not error)

---

## What NOT to Do

- Do not store chapters as HTML in Git
- Do not ask authors for Firestore JSON
- Do not ask authors for full chapters in one response
- Do not edit author prose during publish
