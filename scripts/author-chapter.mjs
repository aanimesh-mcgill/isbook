#!/usr/bin/env node
/**
 * Generate all sections for a chapter via OpenAI API (Constitution + optional chapter prompt).
 */
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import {
  parseArgs,
  loadBookMeta,
  loadChapterMeta,
  resolveChapterDir,
} from './lib/paths.mjs';
import {
  loadBookCatalog,
  sectionFileName,
  buildAuthorPrompt,
} from './lib/book-catalog.mjs';
import { loadChapterInstance } from './lib/tos.mjs';
import { buildRepoContextBlock, updateBookBibleAfterWrite } from './lib/repo-context.mjs';
import { generateManuscript, getModel } from './lib/openai-author.mjs';
import { validateSection } from './lib/parse-section.mjs';

const args = parseArgs(process.argv.slice(2));

const bookSlug = args.book ?? 'database-analytics-ai';

if (!args.chapter) {
  console.error(`
Usage:
  npm run author:chapter -- --book <slug> --chapter <dir> [--prompt <id>] [--from N] [--to N] [--force]

Options:
  --instance <id>         Chapter instance YAML
  --prompt <id>           Alias for --instance (legacy)
  --catalog tos           Use Pedagogy Engine experience blocks (15 blocks)
  --from / --to             Section order range
`);
  process.exit(1);
}

const bookMeta = loadBookMeta(bookSlug);
const chapterMeta = loadChapterMeta(bookSlug, args.chapter);
const defaultCatalog = bookSlug === 'database-analytics-ai' ? 'v2' : 'section-catalog';
const catalog = loadBookCatalog(bookSlug, { catalog: args.catalog ?? defaultCatalog });
const chapterDir = resolveChapterDir(bookSlug, args.chapter);
const sectionsDir = join(chapterDir, 'sections');
mkdirSync(sectionsDir, { recursive: true });

const instanceId = args.instance ?? args.prompt;
const chapterInstance = instanceId ? loadChapterInstance(bookSlug, instanceId) : null;
const model = getModel(args.model);

const maxOrder = catalog.sections.length;
const fromOrder = args.from ? Number(args.from) : 1;
const toOrder = args.to ? Number(args.to) : maxOrder;
const toGenerate = catalog.sections.filter((s) => s.order >= fromOrder && s.order <= toOrder);

console.log(`\nGenerating Chapter ${chapterMeta.chapterNumber}: ${chapterMeta.title}`);
console.log(`  Book: ${bookMeta.title}`);
console.log(`  Pedagogy Engine (TOS): loaded`);
if (chapterInstance) console.log(`  Chapter instance: ${instanceId}`);
console.log(`  Sections ${fromOrder}–${toOrder} (${toGenerate.length} total)\n`);

let generated = 0;
let skipped = 0;
let failed = 0;

for (const section of toGenerate) {
  const fileName = sectionFileName(section);
  const outPath = join(sectionsDir, fileName);

  if (existsSync(outPath) && !args.force) {
    console.log(`  ⊘ ${fileName} — already exists (use --force)`);
    skipped++;
    continue;
  }

  process.stdout.write(`  … ${fileName} `);

  try {
    const repoContext = args['no-repo-context']
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

    const { content: manuscript, usage } = await generateManuscript({
      userPrompt: prompt,
      model,
      bookSlug,
    });
    const validation = validateSection(manuscript);

    if (!validation.valid) {
      throw new Error(validation.errors.join('; '));
    }

    writeFileSync(outPath, manuscript, 'utf8');
    updateBookBibleAfterWrite({
      bookSlug,
      chapterDir: args.chapter,
      chapterMeta,
      section,
      outPath,
      usage,
    });
    console.log(`✓ (${usage?.total_tokens ?? '?'} tokens)`);
    generated++;
    await new Promise((r) => setTimeout(r, 8000));
  } catch (err) {
    console.log(`✗ ${err.message}`);
    failed++;
  }
}

console.log(`\nDone: ${generated} generated, ${skipped} skipped, ${failed} failed`);
console.log(`  Next: npm run author:revise -- --book ${bookSlug} --chapter ${args.chapter}`);

if (failed > 0) process.exit(1);
