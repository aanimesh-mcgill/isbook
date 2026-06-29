#!/usr/bin/env node
/**
 * Publish a single section to Firestore.
 *
 * Usage:
 *   npm run publish:section -- --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution --section 01-opening-case
 */
import {
  parseArgs,
  loadBookMeta,
  loadChapterMeta,
  loadSectionFile,
} from './lib/paths.mjs';
import { parseSection, validateSection } from './lib/parse-section.mjs';
import { publishSection } from './lib/firestore-publish.mjs';

const args = parseArgs(process.argv.slice(2));

if (!args.book || !args.chapter || !args.section) {
  console.error(
    'Usage: npm run publish:section -- --book <slug> --chapter <dir> --section <name-without-md>',
  );
  process.exit(1);
}

const file = args.section.endsWith('.md') ? args.section : `${args.section}.md`;
const raw = loadSectionFile(args.book, args.chapter, file);
const validation = validateSection(raw);

if (!validation.valid) {
  console.error('Validation failed:');
  validation.errors.forEach((e) => console.error(`  ${e}`));
  process.exit(1);
}

if (validation.warnings?.length) {
  validation.warnings.forEach((w) => console.warn(`  ⚠ ${w}`));
}

const bookMeta = loadBookMeta(args.book);
const chapterMeta = loadChapterMeta(args.book, args.chapter);
const { frontmatter, blocks } = parseSection(raw);

if (frontmatter.status !== 'published' && !args.force) {
  console.log(`Section status is "${frontmatter.status}". Use --force to publish anyway.`);
  process.exit(0);
}

const result = await publishSection({
  bookMeta: {
    title: bookMeta.title,
    subtitle: bookMeta.subtitle ?? null,
    description: bookMeta.description,
    slug: bookMeta.slug,
    status: bookMeta.status,
    partCount: bookMeta.partCount,
    chapterCount: bookMeta.chapterCount,
  },
  chapterMeta: {
    title: chapterMeta.title,
    slug: chapterMeta.slug,
    partNumber: chapterMeta.partNumber,
    partTitle: chapterMeta.partTitle,
    chapterNumber: chapterMeta.chapterNumber,
    summary: chapterMeta.summary ?? null,
    order: chapterMeta.order,
    status: chapterMeta.status,
  },
  sectionMeta: {
    title: frontmatter.title,
    slug: frontmatter.slug,
    order: frontmatter.order,
  },
  blocks,
});

console.log(`Published ${file}`);
console.log(`  ${result.blockCount} blocks → section ${result.sectionId}`);
console.log(`  /read/${bookMeta.slug}/${chapterMeta.slug}/${frontmatter.slug}`);
