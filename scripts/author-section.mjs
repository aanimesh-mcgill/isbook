#!/usr/bin/env node
/**
 * Generate one textbook section via OpenAI API (ChatGPT models).
 *
 * Usage:
 *   npm run author -- --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution --section learning-objectives
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
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
  stripCodeFences,
} from './lib/book-catalog.mjs';
import { validateSection } from './lib/parse-section.mjs';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

function loadEnv() {
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const args = parseArgs(process.argv.slice(2));

if (!args.book || !args.chapter || !args.section) {
  console.error(`
Usage:
  npm run author -- --book <book-slug> --chapter <chapter-dir> --section <section-slug-or-number>

Examples:
  npm run author -- --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution --section learning-objectives
  npm run author -- --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution --section 3

Options:
  --model gpt-4o          OpenAI model (default: OPENAI_MODEL env or gpt-4o)
  --instructions "..."    Extra instructions for the author
  --out inbox             Save to books/_inbox/ (default) or chapter sections folder if --out chapter
  --validate              Run validation after generation
`);
  process.exit(1);
}

loadEnv();

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('Missing OPENAI_API_KEY in .env — see docs/author/OPENAI_AUTHOR.md');
  process.exit(1);
}

const bookMeta = loadBookMeta(args.book);
const chapterMeta = loadChapterMeta(args.book, args.chapter);
const catalog = loadBookCatalog(args.book);
const section = resolveSection(catalog, args.section);
const model = args.model ?? process.env.OPENAI_MODEL ?? 'gpt-4o';
const fileName = sectionFileName(section);
const prompt = buildAuthorPrompt({
  bookMeta,
  chapterMeta,
  section,
  catalog,
  extraInstructions: args.instructions ?? '',
});

console.log(`Authoring: ${bookMeta.title}`);
console.log(`  Chapter ${chapterMeta.chapterNumber}: ${chapterMeta.title}`);
console.log(`  Section ${section.sectionNum}: ${section.title}`);
console.log(`  Model: ${model}`);
console.log('  Calling OpenAI API…\n');

const openai = new OpenAI({ apiKey });

const response = await openai.chat.completions.create({
  model,
  temperature: 0.7,
  messages: [
    {
      role: 'system',
      content:
        'You are an expert MIS textbook author. Output only the requested markdown file. Never output JSON or HTML.',
    },
    { role: 'user', content: prompt },
  ],
});

const raw = response.choices[0]?.message?.content;
if (!raw) {
  console.error('No content returned from OpenAI.');
  process.exit(1);
}

const manuscript = stripCodeFences(raw);

let outPath;
if (args.out === 'chapter') {
  const chapterDir = resolveChapterDir(args.book, args.chapter);
  const sectionsDir = join(chapterDir, 'sections');
  mkdirSync(sectionsDir, { recursive: true });
  outPath = join(sectionsDir, fileName);
} else {
  const inboxDir = join(ROOT, 'books', '_inbox');
  mkdirSync(inboxDir, { recursive: true });
  outPath = join(inboxDir, fileName);
}

writeFileSync(outPath, manuscript, 'utf8');
console.log(`Saved: ${outPath.replace(ROOT + '\\', '').replace(ROOT + '/', '')}`);
console.log(`  Tokens: ${response.usage?.total_tokens ?? 'unknown'}`);

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

console.log(`
Next steps:
  1. Review the manuscript (edit if needed — you are the editor)
  2. Move to chapter folder if saved in _inbox:
     books/${args.book}/chapters/${args.chapter}/sections/${fileName}
  3. Set status: published in frontmatter when ready
  4. Publish:
     node scripts/publish-section.mjs --book ${args.book} --chapter ${args.chapter} --section ${section.slug}
  5. Deploy:
     npm run firebase:deploy
`);
