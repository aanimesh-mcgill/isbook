#!/usr/bin/env node
/**
 * Publish canonical manuscripts from books/ to Firestore.
 *
 * Usage:
 *   npm run publish -- --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution
 */
import {
  parseArgs,
  loadBookMeta,
  loadChapterMeta,
  listSectionFiles,
  loadSectionFile,
} from './lib/paths.mjs';
import { parseSection, validateSection } from './lib/parse-section.mjs';
import { publishSection } from './lib/firestore-publish.mjs';

const args = parseArgs(process.argv.slice(2));

if (!args.book || !args.chapter) {
  console.error('Usage: npm run publish -- --book <slug> --chapter <dir>');
  process.exit(1);
}

const bookMeta = loadBookMeta(args.book);
const chapterMeta = loadChapterMeta(args.book, args.chapter);
const sectionFiles = listSectionFiles(args.book, args.chapter);

if (sectionFiles.length === 0) {
  console.error('No sections to publish.');
  process.exit(1);
}

console.log(`Publishing ${args.book} / ${args.chapter} (${sectionFiles.length} sections)…`);

let bookId, chapterId;

for (const file of sectionFiles) {
  const raw = loadSectionFile(args.book, args.chapter, file);
  const validation = validateSection(raw);

  if (!validation.valid) {
    console.error(`\n✗ ${file} failed validation:`);
    validation.errors.forEach((e) => console.error(`  ${e}`));
    process.exit(1);
  }

  const { frontmatter, blocks } = parseSection(raw);

  // Only publish sections marked published (or all if --force)
  if (frontmatter.status !== 'published' && !args.force) {
    console.log(`  ⊘ ${file} (status: ${frontmatter.status}) — skipped`);
    continue;
  }

  const chapterStatus =
    args.force && bookMeta.status === 'published' ? 'published' : chapterMeta.status;

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
      status: chapterStatus,
    },
    sectionMeta: {
      title: frontmatter.title,
      slug: frontmatter.slug,
      order: frontmatter.order,
    },
    blocks,
    bookId,
    chapterId,
  });

  bookId = result.bookId;
  chapterId = result.chapterId;

  console.log(`  ✓ ${file} → ${result.blockCount} blocks (section ${result.sectionId})`);
}

console.log(`\nPublished to Firestore.`);
console.log(`  Book:    /read/${bookMeta.slug}`);
console.log(`  Chapter: /read/${bookMeta.slug}/${chapterMeta.slug}`);
