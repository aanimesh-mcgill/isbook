# Book Bible — Repository as Memory

**Modern Data Systems for Analytics and AI** · Version 2.0 rewrite

The Book Bible is the **constitution** of this textbook project. It lives in version-controlled files — not inside a chat session. Any Cursor session, any AI model, six months from now, reconstructs the full project context from these files before writing a single word.

---

## Files

| File | Purpose | Update when |
|------|---------|-------------|
| **`SYSTEM_PROMPT.md`** | Permanent Chief Author constitution (~15–20 pages). Voice, pedagogy, structure, standards. Rarely changes. | Major edition or philosophy shift |
| **`PROJECT_STATUS.md`** | What exists, what's draft, what's blocked, word counts, chapter checklist | After every meaningful authoring session |
| **`AUTHOR_DECISIONS.md`** | Locked decisions — terminology, fictional company, chapter order, technology scope | When a decision is made and should not be re-litigated |
| **`CURRENT_CONTEXT.md`** | Active work right now — chapter, section, blockers, next steps | Start and end of every session |

---

## Session workflow (mandatory)

Every Cursor session that touches book content **must** read these files **in order** before writing or editing:

```
1. SYSTEM_PROMPT.md      ← who you are and how you write
2. PROJECT_STATUS.md     ← what already exists
3. AUTHOR_DECISIONS.md   ← what must not change
4. CURRENT_CONTEXT.md    ← what we're doing today
5. Target chapter/section files
```

**Preferred:** use OpenAI via the author pipeline (reads Book Bible + repo automatically):

```bash
npm run author:write -- --chapter 01-why-data-still-matters --section opening-story
```

Then update `PROJECT_STATUS.md` and `CURRENT_CONTEXT.md` (auto-updated after each `author:write` run).

---

## Multi-book pattern

Each book gets its own `00_BOOK_BIBLE/`:

```
books/
  database-analytics-ai/
    00_BOOK_BIBLE/          ← this book
  managing-organizations-ai/
    00_BOOK_BIBLE/          ← future book
```

Root `SYSTEM_PROMPT.md` remains the **Publishing Engine** constitution (Cursor as publisher).  
Book-level `00_BOOK_BIBLE/SYSTEM_PROMPT.md` is the **Chief Author** constitution (Cursor as author).

---

## Related repository assets

| Asset | Location |
|-------|----------|
| Learning objects | `atlas/learning-objects/objects/` |
| Chapter manuscripts | `books/database-analytics-ai/chapters/` |
| ISBX format spec | `docs/CANONICAL_FORMAT.md` |
| Editorial framework | `docs/atlas/EDITORIAL_FRAMEWORK.md` |
| Publishing pipeline | `docs/atlas/MASTER_PUBLISHING_PROTOCOL.md` |
