# Editorial Workflow

Professional publishing pipeline for research-driven textbook production.

---

## Roles

| Role | Who | Responsibility |
|------|-----|----------------|
| Chief Author | ChatGPT | Research synthesis, writing, pedagogy |
| Chief Architect | ChatGPT | Schema, features, UI specs |
| Editor | Project owner | Final approval, voice consistency |
| Publishing Engine | Cursor | Parse, validate, deploy — never edit prose |

---

## Pipeline

```
Research
   ↓
Outline
   ↓
Section Draft          ← one section per ChatGPT session
   ↓
Technical Review       ← Cursor validates format
   ↓
Research Review        ← ChatGPT verifies citations
   ↓
Pedagogical Review     ← ChatGPT checks learning objectives
   ↓
Figures                ← author describes; designer creates
   ↓
Exercises              ← AI exercises, discussion questions
   ↓
Instructor Notes
   ↓
Publish                ← Cursor: Git commit + Firestore
   ↓
Deploy                 ← Cursor: Firebase Hosting
```

---

## GitHub Issues (one per stage)

| Issue label | Stage | Owner |
|-------------|-------|-------|
| `research` | Literature review for section | ChatGPT |
| `outline` | Chapter outline approval | ChatGPT + Editor |
| `draft` | Section manuscript | ChatGPT |
| `review:technical` | Format validation | Cursor |
| `review:research` | Citation accuracy | ChatGPT |
| `review:pedagogy` | Learning objectives | ChatGPT |
| `figures` | Figure creation | Designer / ChatGPT spec |
| `exercises` | Questions and AI exercises | ChatGPT |
| `instructor` | Instructor notes | ChatGPT |
| `publish` | Firestore + deploy | Cursor |

---

## Section-by-Section Cadence

**Never:** "Write Chapter 3" (10,000 words — too large, unreliable)

**Always:** "Write Chapter 3, Section 3.1 — Opening Case" (~800 words)

### Per-Section Cycle

1. **ChatGPT** produces `03-opening-case.md` using `docs/author/SECTION_PROMPT.md`
2. **Editor** reviews prose (optional quick read)
3. **Cursor** validates: `npm run validate -- --book ... --section ...`
4. **Cursor** saves to `books/.../sections/03-opening-case.md`
5. **Cursor** commits: `Add Ch.3 §3.1 Opening Case (draft)`
6. **Cursor** publishes: `npm run publish:section -- ...`
7. Repeat for §3.2, §3.3, …
8. When chapter complete: `npm run publish -- --book ... --chapter ...`
9. **Cursor** deploys: `npm run firebase:deploy`
10. **Editor** marks chapter published in `chapter.yaml` (`status: published`)

---

## Version Control

Every section edit is a Git commit:

```
Add Ch.1 §1.1 Opening Case (draft)
Revise Ch.1 §1.1 Opening Case (research review)
Publish Ch.1 §1.1 Opening Case
Add Ch.1 §1.2 Managerial Problem (draft)
...
Publish Chapter 1
```

Rollback = `git revert`. Firestore republish from Git source.

---

## Status Field

| Status | Meaning |
|--------|---------|
| `draft` | In editorial pipeline, not on website |
| `published` | Live on website |
| `archived` | Removed from catalog, kept in Git |

Set in section frontmatter and `chapter.yaml`. Publishing engine only deploys `published` sections to the public site.

---

## Quality Gates

Before `status: published`:

- [ ] All 17 standard sections exist
- [ ] `npm run validate` passes for entire chapter
- [ ] Research review complete (citations verified)
- [ ] At least one `:::case` and one `:::research` per chapter
- [ ] AI Transformation section includes Before/After comparison
- [ ] Learning objectives align with content
- [ ] No HTML in manuscripts
