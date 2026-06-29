export interface Citation {
  id: string;
  label: string;
  scholarUrl: string;
}

/** Build a Google Scholar search URL for a reference string. */
export function scholarSearchUrl(query: string): string {
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(query.trim())}`;
}

/**
 * Extract unique citations from markdown text.
 * Matches parenthetical (Author, Year), (Author et al., Year), and list-style references.
 */
export function extractCitations(...texts: (string | undefined)[]): Citation[] {
  const found = new Map<string, Citation>();

  const patterns = [
    // (Brynjolfsson & McElheran, 2016)
    /\(([A-Z][A-Za-z&\s.]+(?:\s+et\s+al\.)?),?\s*(\d{4}[a-z]?)\)/g,
    // *MIS Quarterly* (2022) or *Harvard Business Review* (2021)
    /\*([^*]+)\*\s*\((\d{4}[a-z]?)\)/g,
    // Author, Year — Title or Author (Year)
    /^[-*]?\s*([A-Z][A-Za-z,\s&]+?)(?:,|\s+)\(?(\d{4}[a-z]?)\)?[.,\s—–-]+(.+)$/gm,
  ];

  for (const text of texts) {
    if (!text) continue;

    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(text)) !== null) {
        const author = match[1]?.trim();
        const year = match[2]?.trim();
        const title = match[3]?.trim();

        if (!author || !year) continue;

        const isJournal = pattern.source.includes('\\*');
        const label = isJournal
          ? `${author} (${year}).`
          : title
            ? `${author} (${year}). ${title.replace(/\.$/, '')}.`
            : `${author} (${year})`;

        const key = label.toLowerCase();
        if (!found.has(key)) {
          found.set(key, {
            id: key.replace(/[^a-z0-9]+/g, '-').slice(0, 48),
            label,
            scholarUrl: scholarSearchUrl(
              isJournal ? `${author} ${year}` : title ? `${author} ${title}` : `${author} ${year}`,
            ),
          });
        }
      }
    }

    // Lines in further-reading style: Author, Year, Title, Journal
    for (const line of text.split('\n')) {
      const trimmed = line.replace(/^[-*]\s*/, '').trim();
      const parts = trimmed.match(/^(.+?),\s*(\d{4}[a-z]?),\s*(.+)$/);
      if (parts) {
        const label = `${parts[1]} (${parts[2]}). ${parts[3].replace(/\.$/, '')}.`;
        const key = label.toLowerCase();
        if (!found.has(key)) {
          found.set(key, {
            id: key.replace(/[^a-z0-9]+/g, '-').slice(0, 48),
            label,
            scholarUrl: scholarSearchUrl(`${parts[1]} ${parts[3]}`),
          });
        }
      }
    }
  }

  return Array.from(found.values()).sort((a, b) => a.label.localeCompare(b.label));
}
