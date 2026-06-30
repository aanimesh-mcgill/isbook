#!/usr/bin/env node
/**
 * Archive a chapter in Firestore (removes from public site TOC).
 *
 * Usage:
 *   node scripts/archive-chapter.mjs --book database-analytics-ai --slug why-databases-still-matter-ai
 */
import { parseArgs } from './lib/paths.mjs';
import { findDoc, getDb, now } from './lib/firestore-publish.mjs';

const args = parseArgs(process.argv.slice(2));

if (!args.book || !args.slug) {
  console.error('Usage: node scripts/archive-chapter.mjs --book <book-slug> --slug <chapter-slug>');
  process.exit(1);
}

const db = getDb();
const timestamp = now();

const book = await findDoc('books', 'slug', args.book);
if (!book) {
  console.error(`Book not found: ${args.book}`);
  process.exit(1);
}

const chapterSnap = await db
  .collection('chapters')
  .where('bookId', '==', book.id)
  .where('slug', '==', args.slug)
  .limit(1)
  .get();

if (chapterSnap.empty) {
  console.error(`Chapter not found in Firestore: ${args.slug}`);
  process.exit(1);
}

const chapterRef = chapterSnap.docs[0].ref;
const chapterId = chapterSnap.docs[0].id;
const chapterData = chapterSnap.docs[0].data();

await chapterRef.update({
  status: 'archived',
  archivedAt: timestamp,
  updatedAt: timestamp,
});

const sectionSnap = await db.collection('sections').where('chapterId', '==', chapterId).get();
const batch = db.batch();
for (const doc of sectionSnap.docs) {
  batch.update(doc.ref, { archivedAt: timestamp, updatedAt: timestamp });
}
if (!sectionSnap.empty) await batch.commit();

console.log(`Archived chapter: ${chapterData.title}`);
console.log(`  Book:  ${args.book} (${book.id})`);
console.log(`  Slug:  ${args.slug}`);
console.log(`  ID:    ${chapterId}`);
console.log(`  Sections marked: ${sectionSnap.size}`);
console.log('\nChapter will no longer appear in the public catalog (status != published).');
