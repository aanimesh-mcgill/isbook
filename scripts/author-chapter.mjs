#!/usr/bin/env node
/**
 * Generate all sections for a chapter via OpenAI API.
 *
 * Usage:
 *   node scripts/author-chapter.mjs --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution
 *   node scripts/author-chapter.mjs --book ... --chapter ... --force
 *   node scripts/author-chapter.mjs --book ... --chapter ... --from 4 --to 17
 */
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { resolve } from 'path';
import {
  parseArgs,
  loadBookMeta,
  loadChapterMeta,
  resolveChapterDir,
} from './lib/paths.mjs';
import {
  STANDARD_SECTIONS,
  sectionFileName,
  buildAuthorPrompt,
  stripCodeFences,
} from './lib/section-catalog.mjs';
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

if (!args.book || !args.chapter) {
  console.error('Usage: node scripts/author-chapter.mjs --book <slug> --chapter <dir> [--force] [--from N] [--to N]');
  process.exit(1);
}

loadEnv();

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey || apiKey.includes('your-key')) {
  console.error('Set OPENAI_API_KEY in .env');
  process.exit(1);
}

const bookMeta = loadBookMeta(args.book);
const chapterMeta = loadChapterMeta(args.book, args.chapter);
const chapterDir = resolveChapterDir(args.book, args.chapter);
const sectionsDir = join(chapterDir, 'sections');
mkdirSync(sectionsDir, { recursive: true });

const fromOrder = args.from ? Number(args.from) : 1;
const toOrder = args.to ? Number(args.to) : 17;
const model = args.model ?? process.env.OPENAI_MODEL ?? 'gpt-4o';
const openai = new OpenAI({ apiKey });

const toGenerate = STANDARD_SECTIONS.filter(
  (s) => s.order >= fromOrder && s.order <= toOrder,
);

console.log(`\nGenerating Chapter ${chapterMeta.chapterNumber}: ${chapterMeta.title}`);
console.log(`  Sections ${fromOrder}–${toOrder} (${toGenerate.length} total)\n`);

let generated = 0;
let skipped = 0;
let failed = 0;

for (const section of toGenerate) {
  const fileName = sectionFileName(section);
  const outPath = join(sectionsDir, fileName);

  if (existsSync(outPath) && !args.force) {
    console.log(`  ⊘ ${fileName} — already exists (use --force to overwrite)`);
    skipped++;
    continue;
  }

  process.stdout.write(`  … ${fileName} `);

  try {
    const prompt = buildAuthorPrompt({
      bookMeta,
      chapterMeta,
      section,
      extraInstructions: args.instructions ?? '',
    });

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
    if (!raw) throw new Error('empty response');

    const manuscript = stripCodeFences(raw);
    const validation = validateSection(manuscript);

    if (!validation.valid) {
      throw new Error(validation.errors.join('; '));
    }

    writeFileSync(outPath, manuscript, 'utf8');
    const tokens = response.usage?.total_tokens ?? '?';
    console.log(`✓ (${tokens} tokens, ${validation.blocks?.length ?? 0} blocks)`);
    generated++;

    // Brief pause to avoid rate limits
    await new Promise((r) => setTimeout(r, 1500));
  } catch (err) {
    console.log(`✗ ${err.message}`);
    failed++;
  }
}

console.log(`\nDone: ${generated} generated, ${skipped} skipped, ${failed} failed`);
console.log(`  Manuscripts: books/${args.book}/chapters/${args.chapter}/sections/`);

if (failed > 0) process.exit(1);
