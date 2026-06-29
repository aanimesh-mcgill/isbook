# Manuscript Archive

This directory contains the **canonical textbook manuscripts** for the IS Textbook Platform.

## Rules

- **Authors write Markdown here.** Never Firestore JSON.
- **One file = one section.** Never a full chapter in one file.
- **Cursor publishes to Firestore.** Never edit author prose during publish.

## Structure

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
```

## Commands

```bash
# Validate manuscripts
npm run validate -- --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution

# Publish chapter to Firestore
npm run publish -- --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution

# Publish one section
npm run publish:section -- --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution --section 01-opening-case
```

## Documentation

- Format spec: `docs/CANONICAL_FORMAT.md`
- Author prompt: `docs/author/SECTION_PROMPT.md`
- Editorial workflow: `docs/EDITORIAL_WORKFLOW.md`
- Publishing engine: `SYSTEM_PROMPT.md`
