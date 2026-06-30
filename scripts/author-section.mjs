#!/usr/bin/env node
/**
 * Generate one textbook section via OpenAI API.
 * Reads Book Bible + repository manuscript for consistency, writes directly to chapters/.
 *
 * Usage:
 *   npm run author -- --book database-analytics-ai --chapter 01-why-data-still-matters --section opening-story
 *   npm run author:write -- --chapter 01-why-data-still-matters --section 2
 */
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import {
  parseArgs,
  loadBookMeta,
  loadChapterMeta,
  resolveChapterDir,
} from './lib/paths.mjs';
import {
  loadBookCatalog,
  resolveSection,
  sectionFileName,
  buildAuthorPrompt,
} from './lib/book-catalog.mjs';
import { loadChapterInstance } from './lib/tos.mjs';
import { buildRepoContextBlock, updateBookBibleAfterWrite, wordCount } from './lib/repo-context.mjs';
import { generateManuscript, getModel, ROOT } from './lib/openai-author.mjs';
import { validateSection } from './lib/parse-section.mjs';

const args = parseArgs(process.argv.slice(2));
const bookSlug = args.book ?? 'database-analytics-ai';

if (!args.chapter || !args.section) {
  console.error(`
Usage:
  npm run author -- --book <book-slug> --chapter <chapter-dir> --section <section-slug-or-number>

Defaults (database-analytics-ai):
  --catalog v2          20-section Book Bible structure
  --out chapter         Write directly to chapters/ (not inbox)

Options:
  --instance <id>       Chapter instance YAML
  --catalog v2|tos|constitution|section-catalog
  --model gpt-4o
  --instructions "..."
  --out inbox|chapter
  --no-repo-context     Skip reading prior sections from repo
  --validate
  --force               Overwrite existing section file

Examples:
  npm run author -- --chapter 01-why-data-still-matters --section opening-story
  npm run author -- --chapter 01-why-data-still-matters --section 2 --instructions "Focus on Meridian Retail Group"
`);
  process.exit(1);
}

const defaultCatalog = bookSlug === 'database-analytics-ai' ? 'v2' : 'section-catalog';
const defaultOut = bookSlug === 'database-analytics-ai' ? 'chapter' : 'inbox';
const catalogName = args.catalog ?? defaultCatalog;
const outMode = args.out ?? defaultOut;

const bookMeta = loadBookMeta(bookSlug);
const chapterMeta = loadChapterMeta(bookSlug, args.chapter);
const catalog = loadBookCatalog(bookSlug, { catalog: catalogName });
const section = resolveSection(catalog, args.section);
const model = getModel(args.model);

const instanceId = args.instance ?? args.prompt;
let chapterInstance = null;
if (instanceId) {
  chapterInstance = loadChapterInstance(bookSlug, instanceId);
}

const repoContext =
  args['no-repo-context']
    ? ''
    : buildRepoContextBlock({
        bookSlug,
        chapterDir: args.chapter,
        chapterMeta,
        sectionOrder: section.order,
        catalog,
      });

const prompt = buildAuthorPrompt({
  bookMeta,
  chapterMeta,
  section,
  catalog,
  chapterPrompt: chapterInstance,
  extraInstructions: args.instructions ?? '',
  repoContext,
});

console.log(`Authoring: ${bookMeta.title}`);
console.log(`  Chapter ${chapterMeta.chapterNumber}: ${chapterMeta.title}`);
console.log(`  Section ${section.order}: ${section.title} (${section.slug})`);
console.log(`  Catalog: ${catalogName}`);
console.log(`  Book Bible + repo context: ${args['no-repo-context'] ? 'skipped' : 'loaded'}`);
if (chapterInstance) console.log(`  Chapter instance: ${instanceId}`);
console.log(`  Model: ${model}`);
console.log(`  Output: ${outMode}`);
console.log('  Calling OpenAI API…\n');

const { content: manuscript, usage } = await generateManuscript({
  userPrompt: prompt,
  model,
  bookSlug,
});

let outPath;
if (outMode === 'chapter') {
  const chapterDir = resolveChapterDir(bookSlug, args.chapter);
  const sectionsDir = join(chapterDir, 'sections');
  mkdirSync(sectionsDir, { recursive: true });
  outPath = join(sectionsDir, sectionFileName(section));
  if (existsSync(outPath) && !args.force) {
    console.error(`\nFile exists: ${outPath}`);
    console.error('Use --force to overwrite, or choose a different section.');
    process.exit(1);
  }
} else {
  const inboxDir = join(ROOT, 'books', '_inbox');
  mkdirSync(inboxDir, { recursive: true });
  outPath = join(inboxDir, sectionFileName(section));
}

writeFileSync(outPath, manuscript, 'utf8');
const words = wordCount(manuscript);

console.log(`Saved: ${outPath.replace(ROOT + '\\', '').replace(ROOT + '/', '')}`);
console.log(`  Words: ${words}`);
console.log(`  Tokens: ${usage?.total_tokens ?? 'unknown'}`);

updateBookBibleAfterWrite({
  bookSlug,
  chapterDir: args.chapter,
  chapterMeta,
  section,
  outPath,
  usage,
});

if (args.validate) {
  const result = validateSection(manuscript);
  if (!result.valid) {
    console.error('\nValidation failed:');
    result.errors.forEach((e) => console.error(`  ✗ ${e}`));
    process.exit(1);
  }
  result.warnings?.forEach((w) => console.warn(`  ⚠ ${w}`));
  console.log(`\n✓ Valid (${result.blocks?.length ?? 0} content blocks)`);
}

const nextSection = catalog.sections.find((s) => s.order === section.order + 1);
console.log(`
Next steps:
  Review the manuscript in Cursor
  Next section: ${nextSection ? `${nextSection.order} (${nextSection.slug})` : '(chapter complete — run author:chapter or next chapter)'}
  Revise:  npm run author:revise -- --book ${bookSlug} --chapter ${args.chapter} --section ${section.slug}
  Publish when status: published in frontmatter
`);
