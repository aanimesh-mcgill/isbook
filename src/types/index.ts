/** User roles for role-based authorization. */
export type UserRole =
  | 'anonymous'
  | 'student'
  | 'instructor'
  | 'author'
  | 'editor'
  | 'administrator';

/** Supported content block types stored in Firestore. */
export type ContentBlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'figure'
  | 'table'
  | 'quote'
  | 'callout'
  | 'research_box'
  | 'case'
  | 'quiz'
  | 'ai_exercise'
  | 'checklist'
  | 'reference';

export type BookStatus = 'draft' | 'published' | 'archived';

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  slug: string;
  status: BookStatus;
  coverImageUrl?: string;
  partCount: number;
  chapterCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Chapter {
  id: string;
  bookId: string;
  title: string;
  slug: string;
  partNumber: number;
  partTitle: string;
  chapterNumber: number;
  summary?: string;
  order: number;
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  bookId: string;
  chapterId: string;
  title: string;
  slug: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContentBlock {
  id: string;
  bookId: string;
  chapterId: string;
  sectionId: string;
  type: ContentBlockType;
  order: number;
  /** Markdown content for text-based blocks. */
  content?: string;
  /** Storage path or URL for image/figure blocks. */
  imageUrl?: string;
  caption?: string;
  alt?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  photoURL?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  bookId: string;
  chapterId: string;
  sectionId?: string;
  label: string;
  createdAt: string;
}

export interface UserNote {
  id: string;
  userId: string;
  bookId: string;
  chapterId: string;
  sectionId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
