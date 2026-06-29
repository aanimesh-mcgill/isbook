/**
 * Section catalog — re-exports book-aware catalog loader.
 * IS textbook sections live in section-catalog-is.mjs.
 */
export {
  STANDARD_SECTIONS,
  loadBookCatalog,
  resolveSection,
  buildAuthorPrompt,
  sectionFileName,
  stripCodeFences,
} from './book-catalog.mjs';
