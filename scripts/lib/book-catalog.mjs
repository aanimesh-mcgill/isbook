/**
 * Per-book section catalogs and author prompt builder.
 */
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { load as loadYaml } from 'js-yaml';
import { getBooksRoot } from './paths.mjs';
import { buildChapterContextBlock, loadExperienceBlocksCatalog } from './tos.mjs';
import { buildRepoContextBlock } from './repo-context.mjs';

import {
  STANDARD_SECTIONS as IS_SECTIONS,
  IS_SECTION_RULES,
  sectionFileName,
  stripCodeFences,
} from './section-catalog-is.mjs';

export { sectionFileName, stripCodeFences };

/** Default IS textbook sections (re-exported for backward compatibility). */
export const STANDARD_SECTIONS = IS_SECTIONS;

/**
 * Load section catalog for a book. Falls back to IS textbook catalog.
 * @param {string} bookSlug
 * @param {{ catalogName?: string }} [opts]
 */
export function loadBookCatalog(bookSlug, opts = {}) {
  const catalogKey = opts.catalogName ?? opts.catalog ?? 'section-catalog';

  if (catalogKey === 'tos' || catalogKey === 'constitution' || catalogKey === 'section-catalog-constitution') {
    const tosCatalog = loadExperienceBlocksCatalog();
    if (tosCatalog) return tosCatalog;
  }

  const catalogName =
    catalogKey === 'constitution' || catalogKey === 'tos'
      ? 'section-catalog-constitution'
      : catalogKey === 'v2'
        ? 'section-catalog-v2'
        : catalogKey;
  const catalogPath = join(getBooksRoot(), bookSlug, `${catalogName}.yaml`);
  if (!existsSync(catalogPath)) {
    return {
      sections: IS_SECTIONS,
      rules: IS_SECTION_RULES,
      isDefault: true,
    };
  }

  const data = loadYaml(readFileSync(catalogPath, 'utf8'));
  const sections = (data.sections ?? []).map((s) => ({
    order: s.order,
    slug: s.slug,
    title: s.title,
    sectionNum: s.order,
    rules: s.rules ?? '',
  }));

  return { sections, rules: Object.fromEntries(sections.map((s) => [s.slug, s.rules])), isDefault: false };
}

export function resolveSection(catalog, input) {
  const normalized = input.replace(/^\d+-/, '');
  const bySlug = catalog.sections.find((s) => s.slug === normalized || s.slug === input);
  if (bySlug) return bySlug;

  const byOrder = catalog.sections.find(
    (s) => String(s.order) === input || String(s.sectionNum) === input,
  );
  if (byOrder) return byOrder;

  throw new Error(`Unknown section "${input}". Use slug or order number.`);
}

export function buildAuthorPrompt({
  bookMeta,
  chapterMeta,
  section,
  catalog,
  chapterPrompt,
  extraInstructions = '',
  repoContext = '',
}) {
  const chapterNum = chapterMeta.chapterNumber;
  const sectionId = `${chapterNum}.${section.sectionNum ?? section.order}`;
  const fileName = sectionFileName(section);
  const chapterDir = `${String(chapterMeta.order).padStart(2, '0')}-${chapterMeta.slug}`;
  const rules =
    section.rules ??
    catalog.rules?.[section.slug] ??
    'Follow ISBX format with appropriate fenced blocks.';

  const audience = bookMeta.audience ?? 'undergraduate and MBA business students';
  const philosophy = bookMeta.philosophy ?? 'Evidence-based managerial thinking for the AI era.';
  const authorVoice = bookMeta.authorVoice ?? 'Professional, evidence-based, managerial tone.';
  const chapterContext = chapterMeta.authorContext ?? chapterMeta.summary ?? '';

  let chapterBrief = '';
  if (chapterPrompt) {
    chapterBrief = buildChapterContextBlock(chapterPrompt);
  }

  return `Using the Book Bible and Pedagogy Engine already loaded as your system instructions,

Write ONE experience block (section) for this learning experience:

Book: ${bookMeta.title}
Book slug: ${bookMeta.slug}
Chapter ${chapterNum}: ${chapterMeta.title}
Chapter slug: ${chapterMeta.slug}
Part ${chapterMeta.partNumber}: ${chapterMeta.partTitle}
Section ${sectionId}: ${section.title}
Section slug: ${section.slug}

Chapter context (cover these topics across the full chapter):
${chapterContext}

${chapterBrief ? `${chapterBrief}\n\n` : ''}${repoContext ? `${repoContext}\n\n` : ''}SECTION-SPECIFIC RULES:
${rules}

OUTPUT: Return ONLY the complete markdown file content. No preamble, no explanation after.
The file path is: books/${bookMeta.slug}/chapters/${chapterDir}/sections/${fileName}

Required frontmatter:
---
title: ${section.title}
section: "${sectionId}"
order: ${section.order}
slug: ${section.slug}
status: draft
learningObjectives:
  - [write 2-3 objectives for this section]
keywords:
  - [relevant keywords]
estimatedReadingTime: [minutes]
researchStreams:
  - [relevant topics]
---

WRITING RULES:
- Follow TOS Pedagogy Engine rules (business problem before technology)
- Use real companies and realistic examples with sample data tables before SQL
- MySQL syntax unless comparing dialects
- No HTML tags
- No Firestore JSON
- Target 500–1,500 words (worked examples may be longer)
- Use fenced blocks: :::case :::research :::manager :::ai :::exercise :::checklist :::quote :::callout

${extraInstructions ? `ADDITIONAL INSTRUCTIONS:\n${extraInstructions}` : ''}`;
}
