import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '@/firebase';
import type { Book, Chapter, ContentBlock, Section } from '@/types';

function mapDoc<T>(id: string, data: DocumentData): T {
  return { id, ...data } as T;
}

/** Fetch all published books, ordered by title. */
export async function getPublishedBooks(): Promise<Book[]> {
  try {
    const q = query(
      collection(db, 'books'),
      where('status', '==', 'published'),
      orderBy('title'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => mapDoc<Book>(d.id, d.data()));
  } catch (err) {
    // Fallback when composite index is still building — sort client-side
    const q = query(collection(db, 'books'), where('status', '==', 'published'));
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((d) => mapDoc<Book>(d.id, d.data()))
      .sort((a, b) => a.title.localeCompare(b.title));
  }
}

/** Fetch a single published book by slug. */
export async function getBookBySlug(slug: string): Promise<Book | null> {
  const q = query(
    collection(db, 'books'),
    where('slug', '==', slug),
    where('status', '==', 'published'),
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return mapDoc<Book>(d.id, d.data());
}

/** Fetch a book by ID. */
export async function getBookById(bookId: string): Promise<Book | null> {
  const snapshot = await getDoc(doc(db, 'books', bookId));
  if (!snapshot.exists()) return null;
  return mapDoc<Book>(snapshot.id, snapshot.data());
}

/** Fetch all chapters for a book, ordered by chapter number (published only). */
export async function getChaptersByBookId(bookId: string): Promise<Chapter[]> {
  try {
    const q = query(
      collection(db, 'chapters'),
      where('bookId', '==', bookId),
      where('status', '==', 'published'),
      orderBy('order'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => mapDoc<Chapter>(d.id, d.data()));
  } catch {
    const q = query(
      collection(db, 'chapters'),
      where('bookId', '==', bookId),
      where('status', '==', 'published'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((d) => mapDoc<Chapter>(d.id, d.data()))
      .sort((a, b) => a.order - b.order);
  }
}

/** Fetch a chapter by book ID and slug (published only). */
export async function getChapterBySlug(
  bookId: string,
  slug: string,
): Promise<Chapter | null> {
  const q = query(
    collection(db, 'chapters'),
    where('bookId', '==', bookId),
    where('slug', '==', slug),
    where('status', '==', 'published'),
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return mapDoc<Chapter>(d.id, d.data());
}

/** Fetch all sections for a chapter, ordered by position. */
export async function getSectionsByChapterId(
  chapterId: string,
): Promise<Section[]> {
  const q = query(
    collection(db, 'sections'),
    where('chapterId', '==', chapterId),
    orderBy('order'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapDoc<Section>(d.id, d.data()));
}

/** Fetch a section by chapter ID and slug. */
export async function getSectionBySlug(
  chapterId: string,
  slug: string,
): Promise<Section | null> {
  const q = query(
    collection(db, 'sections'),
    where('chapterId', '==', chapterId),
    where('slug', '==', slug),
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return mapDoc<Section>(d.id, d.data());
}

/** Fetch content blocks for a section, ordered by position. */
export async function getContentBlocksBySectionId(
  sectionId: string,
): Promise<ContentBlock[]> {
  const q = query(
    collection(db, 'contentBlocks'),
    where('sectionId', '==', sectionId),
    orderBy('order'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapDoc<ContentBlock>(d.id, d.data()));
}
