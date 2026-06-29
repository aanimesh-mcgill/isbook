import { useQueries } from '@tanstack/react-query';
import { getContentBlocksBySectionId } from '@/services/books';
import { extractCitations } from '@/utils/citations';
import type { Section } from '@/types';

export function useChapterCitations(sections: Section[]) {
  const blockQueries = useQueries({
    queries: sections.map((section) => ({
      queryKey: ['contentBlocks', section.id],
      queryFn: () => getContentBlocksBySectionId(section.id),
      enabled: Boolean(section.id),
      staleTime: 1000 * 60 * 10,
    })),
  });

  const loading = blockQueries.some((q) => q.isLoading);

  const allText = blockQueries.flatMap((q) =>
    (q.data ?? []).map((b) => b.content).filter(Boolean),
  ) as string[];

  const citations = extractCitations(...allText);

  return { citations, loading };
}
