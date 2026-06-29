/**
 * Firestore connection for publishing scripts.
 */
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { Firestore } from '@google-cloud/firestore';
import { OAuth2Client } from 'google-auth-library';

const PROJECT_ID = 'istextbook-e8a3b';

export function getDb() {
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (serviceAccountPath && existsSync(serviceAccountPath)) {
    return new Firestore({ projectId: PROJECT_ID, keyFilename: serviceAccountPath });
  }

  const token = execSync('gcloud auth print-access-token', { encoding: 'utf8' }).trim();
  const authClient = new OAuth2Client();
  authClient.setCredentials({ access_token: token });

  return new Firestore({ projectId: PROJECT_ID, authClient });
}

export function now() {
  return new Date().toISOString();
}

/**
 * Find existing document by field match, or return null.
 */
export async function findDoc(collection, field, value) {
  const db = getDb();
  const snap = await db.collection(collection).where(field, '==', value).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, data: doc.data() };
}

/**
 * Upsert book, chapter, section, and content blocks from parsed manuscript.
 */
export async function publishSection({
  bookMeta,
  chapterMeta,
  sectionMeta,
  blocks,
  bookId,
  chapterId,
  sectionId,
}) {
  const db = getDb();
  const timestamp = now();

  // Upsert book
  let resolvedBookId = bookId;
  if (!resolvedBookId) {
    const existing = await findDoc('books', 'slug', bookMeta.slug);
    if (existing) {
      resolvedBookId = existing.id;
      await db.collection('books').doc(resolvedBookId).update({
        ...bookMeta,
        updatedAt: timestamp,
      });
    } else {
      const ref = db.collection('books').doc();
      resolvedBookId = ref.id;
      await ref.set({
        ...bookMeta,
        createdAt: timestamp,
        updatedAt: timestamp,
        publishedAt: bookMeta.status === 'published' ? timestamp : null,
      });
    }
  }

  // Upsert chapter
  let resolvedChapterId = chapterId;
  if (!resolvedChapterId) {
    const snap = await db
      .collection('chapters')
      .where('bookId', '==', resolvedBookId)
      .where('slug', '==', chapterMeta.slug)
      .limit(1)
      .get();

    if (!snap.empty) {
      resolvedChapterId = snap.docs[0].id;
      await db.collection('chapters').doc(resolvedChapterId).update({
        ...chapterMeta,
        bookId: resolvedBookId,
        updatedAt: timestamp,
      });
    } else {
      const ref = db.collection('chapters').doc();
      resolvedChapterId = ref.id;
      await ref.set({
        ...chapterMeta,
        bookId: resolvedBookId,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }
  }

  // Upsert section
  let resolvedSectionId = sectionId;
  const sectionSnap = await db
    .collection('sections')
    .where('chapterId', '==', resolvedChapterId)
    .where('slug', '==', sectionMeta.slug)
    .limit(1)
    .get();

  const sectionDoc = {
    title: sectionMeta.title,
    slug: sectionMeta.slug,
    order: sectionMeta.order,
    bookId: resolvedBookId,
    chapterId: resolvedChapterId,
    updatedAt: timestamp,
  };

  if (!sectionSnap.empty) {
    resolvedSectionId = sectionSnap.docs[0].id;
    await db.collection('sections').doc(resolvedSectionId).update(sectionDoc);
  } else {
    const ref = db.collection('sections').doc();
    resolvedSectionId = ref.id;
    await ref.set({ ...sectionDoc, createdAt: timestamp });
  }

  // Replace content blocks for this section
  const existingBlocks = await db
    .collection('contentBlocks')
    .where('sectionId', '==', resolvedSectionId)
    .get();

  const batch = db.batch();
  existingBlocks.docs.forEach((d) => batch.delete(d.ref));

  for (const block of blocks) {
    const ref = db.collection('contentBlocks').doc();
    batch.set(ref, {
      type: block.type,
      order: block.order,
      content: block.content ?? null,
      imageUrl: block.imageUrl ?? null,
      caption: block.caption ?? null,
      alt: block.alt ?? null,
      metadata: block.metadata ?? null,
      bookId: resolvedBookId,
      chapterId: resolvedChapterId,
      sectionId: resolvedSectionId,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }

  await batch.commit();

  return {
    bookId: resolvedBookId,
    chapterId: resolvedChapterId,
    sectionId: resolvedSectionId,
    blockCount: blocks.length,
  };
}
