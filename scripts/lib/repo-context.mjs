/**
 * Repository context loader for OpenAI authoring.
 * Reads the evolving manuscript so generated content stays consistent.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { load as loadYaml } from 'js-yaml';
import {
  getBooksRoot,
  loadBookMeta,
  loadChapterMeta,
  listChapters,
  listSectionFiles,
  resolveChapterDir,
} from './paths.mjs';
import { loadBookBibleUserContext } from './tos.mjs';

const ROOT = join(getBooksRoot(), '..');
const BOOK_BIBLE = join(ROOT, 'books/database-analytics-ai/00_BOOK_BIBLE');
const LO_DIR = join(ROOT, 'atlas/learning-objects/objects');

function readText(path) {
  if (!existsSync(path)) return null;
  return readFileSync(path, 'utf8');
}

function wordCount(text) {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function truncate(text, maxChars, label = 'content') {
  if (!text || text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}\n\n[... ${label} truncated — ${text.length - maxChars} chars omitted ...]`;
}

function stripFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\n?/, '').trim();
}

function sectionOrderFromFile(fileName) {
  const match = fileName.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : 999;
}

function slugFromFile(fileName) {
  const match = fileName.match(/^\d+-(.+)\.md$/);
  return match ? match[1] : fileName;
}

/**
 * Load learning objects referenced by a chapter permanent ID.
 */
export function loadChapterLearningObjects(chapterMeta) {
  const permanentId = chapterMeta.permanentId ?? `CH-${String(chapterMeta.chapterNumber).padStart(3, '0')}`;
  const indexPath = join(ROOT, 'atlas/learning-objects/index.json');
  if (!existsSync(indexPath)) return [];

  const index = JSON.parse(readFileSync(indexPath, 'utf8'));
  const ids = index.byChapter?.[permanentId] ?? [];
  return ids
    .map((id) => {
      const path = join(LO_DIR, `${id}.yaml`);
      if (!existsSync(path)) return null;
      return loadYaml(readFileSync(path, 'utf8'));
    })
    .filter(Boolean);
}

/**
 * Summarize chapters — current chapter gets detail; others one line each.
 */
export function loadBookChapterIndex(bookSlug, currentChapterNumber) {
  const lines = [];
  for (const chapterDir of listChapters(bookSlug)) {
    try {
      const meta = loadChapterMeta(bookSlug, chapterDir);
      const isCurrent = meta.chapterNumber === currentChapterNumber;
      const sections = listSectionFiles(bookSlug, chapterDir);
      lines.push(
        `- Ch ${meta.chapterNumber}: **${meta.title}** — ${sections.length} sections${isCurrent ? ' ← CURRENT' : ''}`,
      );
      if (isCurrent && meta.summary) {
        lines.push(`  Summary: ${meta.summary.trim().replace(/\s+/g, ' ')}`);
      }
    } catch {
      /* skip */
    }
  }
  return lines.join('\n');
}

/**
 * Load prior sections — only files matching the active section catalog (avoids v1 orphans).
 */
export function loadPriorChapterSections(bookSlug, chapterDir, beforeOrder, catalog) {
  const catalogSlugs = new Set((catalog?.sections ?? []).map((s) => s.slug));
  const catalogOrders = new Map((catalog?.sections ?? []).map((s) => [s.slug, s.order]));

  const sectionsDir = join(resolveChapterDir(bookSlug, chapterDir), 'sections');
  if (!existsSync(sectionsDir)) return [];

  const bySlug = new Map();
  for (const file of readdirSync(sectionsDir).filter((f) => f.endsWith('.md'))) {
    const slug = slugFromFile(file);
    if (catalogSlugs.size > 0 && !catalogSlugs.has(slug)) continue;
    const order = catalogOrders.get(slug) ?? sectionOrderFromFile(file);
    if (order >= beforeOrder) continue;
    const content = readFileSync(join(sectionsDir, file), 'utf8');
    const existing = bySlug.get(slug);
    if (!existing || order > existing.order) {
      bySlug.set(slug, { file, order, slug, content, words: wordCount(content) });
    }
  }

  return [...bySlug.values()].sort((a, b) => a.order - b.order);
}

/**
 * List section titles already written in this chapter (catalog-aware).
 */
export function loadChapterSectionOutline(bookSlug, chapterDir, catalog) {
  const catalogSlugs = new Set((catalog?.sections ?? []).map((s) => s.slug));
  const files = listSectionFiles(bookSlug, chapterDir).filter((f) => {
    if (catalogSlugs.size === 0) return true;
    return catalogSlugs.has(slugFromFile(f));
  });

  return files
    .map((f) => {
      const content = readFileSync(join(resolveChapterDir(bookSlug, chapterDir), 'sections', f), 'utf8');
      const titleMatch = content.match(/^title:\s*(.+)$/m);
      return `- ${f}${titleMatch ? ` — ${titleMatch[1].trim()}` : ''} (${wordCount(content)} words)`;
    })
    .join('\n');
}

function formatPriorSection(sec, sectionOrder) {
  const isOpening = sec.order === 1;
  const isRecent = sec.order >= sectionOrder - 2;

  if (isOpening) {
    return `### ${sec.file} [opening story — reference]\n\n${truncate(sec.content, 5000, sec.file)}`;
  }
  if (isRecent) {
    return `### ${sec.file} [recent — full text]\n\n${sec.content}`;
  }
  const body = stripFrontmatter(sec.content);
  return `### ${sec.file} [summary only]\n\n${truncate(body, 1800, sec.file)}`;
}

/**
 * Build the repository context block injected into the OpenAI user prompt.
 */
export function buildRepoContextBlock({
  bookSlug,
  chapterDir,
  chapterMeta,
  sectionOrder,
  catalog = null,
}) {
  const bookMeta = loadBookMeta(bookSlug);
  const priorSections = loadPriorChapterSections(bookSlug, chapterDir, sectionOrder, catalog);
  const learningObjects = loadChapterLearningObjects(chapterMeta);
  const sectionOutline = loadChapterSectionOutline(bookSlug, chapterDir, catalog);
  const chapterIndex = loadBookChapterIndex(bookSlug, chapterMeta.chapterNumber);
  const bookBibleUser = loadBookBibleUserContext();

  const priorBlock = priorSections.map((sec) => formatPriorSection(sec, sectionOrder)).join('\n\n');

  const loBlock = learningObjects
    .map((lo) => `- **${lo.permanentId ?? lo.id}**: ${lo.title}${lo.summary ? ` — ${lo.summary}` : ''}`)
    .join('\n');

  return `
# REPOSITORY CONTEXT (read for consistency — do not contradict)

You are extending an evolving manuscript stored in GitHub. Match voice, terminology, characters, and facts established in prior sections.

## Book metadata
- Title: ${bookMeta.title}
- Slug: ${bookMeta.slug}
- Audience: ${bookMeta.audience ?? 'MBA / MS Analytics students'}

## Current chapter
- Number: ${chapterMeta.chapterNumber}
- Title: ${chapterMeta.title}
- Part ${chapterMeta.partNumber}: ${chapterMeta.partTitle}
- Summary: ${(chapterMeta.summary ?? '').trim().replace(/\s+/g, ' ')}

## Book Bible status
${bookBibleUser || '(none)'}

## Chapter progress map
${chapterIndex || '(no chapters yet)'}

## Sections already in this chapter
${sectionOutline || '(none — you are writing the first section)'}

## Prior sections in this chapter
${priorBlock || '(none — this is the first section in the chapter)'}

## Learning objects for this chapter
${loBlock || '(none registered yet)'}

## Consistency rules
- Use **Meridian Retail Group** cast: Priya Sharma (VP Data), Marcus Chen, Elena Rodriguez, James Okonkwo
- Do not contradict prior sections
- Do not repeat full explanations — reference briefly
- Match ISBX fenced block conventions
`.trim();
}

/**
 * Update Book Bible memory files after a successful write.
 */
export function updateBookBibleAfterWrite({
  bookSlug,
  chapterDir,
  chapterMeta,
  section,
  outPath,
  usage,
}) {
  if (bookSlug !== 'database-analytics-ai') return;

  const content = readFileSync(outPath, 'utf8');
  const words = wordCount(content);
  const now = new Date().toISOString().slice(0, 10);
  const relPath = outPath.replace(/\\/g, '/').split('books/database-analytics-ai/').pop();

  const ctxPath = join(BOOK_BIBLE, 'CURRENT_CONTEXT.md');
  let ctx = readText(ctxPath) ?? '';
  ctx = ctx.replace(/\*\*Last updated:\*\* .+/g, `**Last updated:** ${now}`);
  ctx = ctx.replace(
    /\*\*Session focus:\*\* .+/g,
    `**Session focus:** OpenAI authored ${section.slug} (${words} words)`,
  );
  ctx = ctx.replace(
    /\| Next section to write \| .+\|/,
    `| Next section to write | \`${String(section.order + 1).padStart(2, '0')}-${catalogSlugNext(section)}\` |`,
  );
  writeFileSync(ctxPath, ctx, 'utf8');

  const statusPath = join(BOOK_BIBLE, 'PROJECT_STATUS.md');
  let status = readText(statusPath) ?? '';
  status = status.replace(/\*\*Last updated:\*\* .+/g, `**Last updated:** ${now}`);
  writeFileSync(statusPath, status, 'utf8');
}

function catalogSlugNext(section) {
  const next = {
    1: 'think-first',
    2: 'learning-objectives',
    3: 'executive-summary',
    4: 'why-this-matters',
    5: 'big-picture',
    6: 'core-concepts',
    7: 'business-example',
    8: 'technology-decision',
    9: 'architecture-challenge',
    10: 'hands-on-activity',
    11: 'ai-activity',
    12: 'industry-insight',
    13: 'manager-perspective',
    14: 'common-mistakes',
    15: 'continue-learning',
    16: 'summary',
    17: 'reflection',
    18: 'assessment',
    19: 'references',
    20: '(chapter complete)',
  };
  return next[section.order] ?? 'next-section';
}

export { wordCount };
