import { useQuery } from '@tanstack/react-query';
import {
  getBookBySlug,
  getChapterBySlug,
  getChaptersByBookId,
  getContentBlocksBySectionId,
  getPublishedBooks,
  getSectionBySlug,
  getSectionsByChapterId,
} from '@/services/books';

export function usePublishedBooks() {
  return useQuery({
    queryKey: ['books', 'published'],
    queryFn: getPublishedBooks,
  });
}

export function useBook(slug: string) {
  return useQuery({
    queryKey: ['books', slug],
    queryFn: () => getBookBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useChapters(bookId: string | undefined) {
  return useQuery({
    queryKey: ['chapters', bookId],
    queryFn: () => getChaptersByBookId(bookId!),
    enabled: Boolean(bookId),
  });
}

export function useChapter(bookId: string | undefined, chapterSlug: string) {
  return useQuery({
    queryKey: ['chapters', bookId, chapterSlug],
    queryFn: () => getChapterBySlug(bookId!, chapterSlug),
    enabled: Boolean(bookId && chapterSlug),
  });
}

export function useSections(chapterId: string | undefined) {
  return useQuery({
    queryKey: ['sections', chapterId],
    queryFn: () => getSectionsByChapterId(chapterId!),
    enabled: Boolean(chapterId),
  });
}

export function useSection(chapterId: string | undefined, sectionSlug: string) {
  return useQuery({
    queryKey: ['sections', chapterId, sectionSlug],
    queryFn: () => getSectionBySlug(chapterId!, sectionSlug),
    enabled: Boolean(chapterId && sectionSlug),
  });
}

export function useContentBlocks(sectionId: string | undefined) {
  return useQuery({
    queryKey: ['contentBlocks', sectionId],
    queryFn: () => getContentBlocksBySectionId(sectionId!),
    enabled: Boolean(sectionId),
  });
}
