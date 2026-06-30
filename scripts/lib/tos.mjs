/**
 * Textbook Operating System (TOS) — central loader for all five engines.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { load as loadYaml } from 'js-yaml';
import { getBooksRoot } from './paths.mjs';

const ROOT = join(getBooksRoot(), '..');

const TOS = {
  pedagogy: join(ROOT, 'docs/tos/pedagogy-engine'),
  content: join(ROOT, 'docs/tos/content-engine'),
  assessment: join(ROOT, 'docs/tos/assessment-engine'),
  publishing: join(ROOT, 'docs/tos/publishing-engine'),
  ai: join(ROOT, 'docs/tos/ai-engine'),
};

/** Book Bible — v2 Chief Author constitution (preferred for database-analytics-ai) */
const BOOK_BIBLE = join(ROOT, 'books/database-analytics-ai/00_BOOK_BIBLE');

/** @deprecated paths — fall back if TOS files missing */
const LEGACY = {
  pedagogy: join(ROOT, 'docs/author/CONSTITUTION.md'),
  revision: join(ROOT, 'docs/author/REVISION_PROMPT.md'),
  studentReview: join(ROOT, 'docs/author/STUDENT_REVIEW_PROMPT.md'),
};

function readFile(path) {
  if (!existsSync(path)) return null;
  return readFileSync(path, 'utf8');
}

function extractPromptBody(markdown) {
  if (!markdown) return '';
  const match = markdown.match(/```\n([\s\S]*?)```/);
  if (match) return match[1].trim();
  return markdown.trim();
}

// ─── Pedagogy Engine ─────────────────────────────────────────────────────────

export function loadPedagogySystemPrompt() {
  const bookBible = join(BOOK_BIBLE, 'SYSTEM_PROMPT.md');
  if (existsSync(bookBible)) return readFile(bookBible);
  const path = join(TOS.pedagogy, 'system-prompt.md');
  return readFile(path) ?? readFile(LEGACY.pedagogy) ?? '';
}

function truncate(text, maxChars, label = 'content') {
  if (!text || text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}\n\n[... ${label} truncated — ${text.length - maxChars} chars omitted ...]`;
}

/** Load Book Bible for OpenAI system message (v2 authoring). */
export function loadBookBibleContext({ compact = true } = {}) {
  const system = readFile(join(BOOK_BIBLE, 'SYSTEM_PROMPT.md'));
  const decisions = readFile(join(BOOK_BIBLE, 'AUTHOR_DECISIONS.md'));
  const parts = [];
  if (system) {
    parts.push(`# SYSTEM_PROMPT\n\n${compact ? truncate(system, 24000, 'SYSTEM_PROMPT') : system}`);
  }
  if (decisions) {
    parts.push(`# AUTHOR_DECISIONS\n\n${compact ? truncate(decisions, 8000, 'AUTHOR_DECISIONS') : decisions}`);
  }
  return parts.join('\n\n---\n\n');
}

/** Book Bible fields for user-prompt repo context (keeps system message smaller). */
export function loadBookBibleUserContext() {
  const files = [
    ['PROJECT_STATUS', 'PROJECT_STATUS.md'],
    ['CURRENT_CONTEXT', 'CURRENT_CONTEXT.md'],
  ];
  const parts = [];
  for (const [label, name] of files) {
    const content = readFile(join(BOOK_BIBLE, name));
    if (content) parts.push(`# ${label}\n\n${truncate(content, 6000, label)}`);
  }
  return parts.join('\n\n---\n\n');
}

export function getSystemPrompt({ bookSlug } = {}) {
  const useBookBible = bookSlug === 'database-analytics-ai';
  const pedagogy = useBookBible && existsSync(join(BOOK_BIBLE, 'SYSTEM_PROMPT.md'))
    ? loadBookBibleContext()
    : loadPedagogySystemPrompt();
  return `${pedagogy}

---

# API OUTPUT RULES (Publishing Engine)

- Output ONLY the requested ISBX markdown manuscript file.
- Use YAML frontmatter + Markdown + fenced blocks.
- Never output JSON, HTML, Firestore documents, or explanatory preamble.
- You are designing a learning experience block — not filling a template with generic text.
`;
}

export function loadExperienceBlocksCatalog() {
  const path = join(TOS.pedagogy, 'experience-blocks.yaml');
  if (!existsSync(path)) return null;
  const data = loadYaml(readFileSync(path, 'utf8'));
  const sections = (data.sections ?? []).map((s) => ({
    order: s.order,
    slug: s.slug,
    title: s.title,
    sectionNum: s.order,
    phase: s.phase,
    rules: s.rules ?? '',
  }));
  return {
    sections,
    rules: Object.fromEntries(sections.map((s) => [s.slug, s.rules])),
    isDefault: false,
    engine: 'pedagogy',
  };
}

export function loadLearningCycle() {
  const path = join(TOS.pedagogy, 'learning-cycle.yaml');
  if (!existsSync(path)) return null;
  return loadYaml(readFileSync(path, 'utf8'));
}

// ─── Content Engine ──────────────────────────────────────────────────────────

export function loadContentSchema(schemaId) {
  const normalized = String(schemaId).toLowerCase();
  const path = join(TOS.content, 'schemas', `${normalized}.yaml`);
  if (!existsSync(path)) return null;
  return loadYaml(readFileSync(path, 'utf8'));
}

export function formatSchemaForPrompt(schema) {
  if (!schema) return '';

  const lines = [
    `CONTENT ENGINE SCHEMA: ${schema.label ?? schema.id}`,
    schema.businessContext ?? '',
    '',
    'TABLES (show these sample rows to students before SQL):',
  ];

  for (const [tableName, table] of Object.entries(schema.tables ?? {})) {
    lines.push(`\n### ${tableName}`);
    lines.push(table.description ?? '');
    if (table.columns?.length) {
      lines.push('| Column | Type | Meaning |');
      lines.push('|--------|------|---------|');
      for (const col of table.columns) {
        lines.push(`| ${col.name} | ${col.type} | ${col.description} |`);
      }
    }
    if (table.sampleRows?.length) {
      lines.push('\nSample rows:');
      for (const row of table.sampleRows) {
        lines.push(`- ${JSON.stringify(row)}`);
      }
    }
  }

  if (schema.exampleBusinessQuestions?.length) {
    lines.push('\nExample business questions for this schema:');
    for (const q of schema.exampleBusinessQuestions) {
      lines.push(`- ${q}`);
    }
  }

  return lines.join('\n');
}

// ─── Assessment Engine ───────────────────────────────────────────────────────

export function loadAssessmentActivities() {
  const path = join(TOS.assessment, 'activity-types.yaml');
  if (!existsSync(path)) return null;
  return loadYaml(readFileSync(path, 'utf8'));
}

// ─── AI Engine ───────────────────────────────────────────────────────────────

export function loadRevisionPrompt() {
  const path = join(TOS.ai, 'revision-prompt.md');
  return extractPromptBody(readFile(path) ?? readFile(LEGACY.revision));
}

export function loadStudentReviewPrompt() {
  const path = join(TOS.ai, 'student-review-prompt.md');
  return extractPromptBody(readFile(path) ?? readFile(LEGACY.studentReview));
}

// ─── Chapter Instances ───────────────────────────────────────────────────────

/**
 * Load a chapter instance YAML (composes all engines).
 * Supports --instance and legacy --prompt flags.
 */
export function loadChapterInstance(bookSlug, instanceId) {
  const normalized = instanceId.replace(/\.yaml$/, '');

  const paths = [
    join(getBooksRoot(), bookSlug, 'instances', `${normalized}.yaml`),
    join(getBooksRoot(), bookSlug, 'chapter-prompts', `${normalized}.yaml`),
  ];

  for (const path of paths) {
    if (existsSync(path)) {
      const raw = loadYaml(readFileSync(path, 'utf8'));
      return normalizeInstance(raw);
    }
  }

  throw new Error(`Missing chapter instance: books/${bookSlug}/instances/${normalized}.yaml`);
}

function normalizeInstance(raw) {
  const content = raw.content ?? {};
  const pedagogy = raw.pedagogy ?? {};
  const assessment = raw.assessment ?? {};
  const ai = raw.ai ?? {};

  return {
    ...raw,
    businessCase: raw.businessCase ?? content.businessCase,
    schema: raw.schema ?? content.schema,
    concepts: raw.concepts ?? content.concepts ?? [],
    previousChapter: raw.previousChapter ?? pedagogy.previousExperience,
    nextChapter: raw.nextChapter ?? pedagogy.nextExperience,
    assessmentInclude: assessment.include ?? [],
    aiActivities: ai.activities ?? [],
  };
}

export function buildChapterContextBlock(instance) {
  if (!instance) return '';

  const concepts = (instance.concepts ?? []).map((c) => `- ${c}`).join('\n');
  const schemaBlock = formatSchemaForPrompt(
    loadContentSchema(instance.schema ?? instance.content?.schema),
  );

  const assessment = (instance.assessmentInclude ?? [])
    .map((a) => `- ${a}`)
    .join('\n');
  const aiActs = (instance.aiActivities ?? []).map((a) => `- ${a}`).join('\n');

  return `
CHAPTER INSTANCE (TOS — learning experience configuration):

Module: ${instance.module ?? 'N/A'}
Chapter ${instance.chapterNumber ?? '?'}: ${instance.title ?? 'Untitled'}
Business case: ${instance.businessCase ?? 'Use a realistic company'}
Content schema: ${instance.schema ?? 'Define schema with sample rows before SQL'}

Concepts for this experience:
${concepts || '- (see chapter authorContext)'}

Previous experience: ${instance.previousChapter ?? 'Maintain continuity with prior chapters.'}
Next experience preview: ${instance.nextChapter ?? 'Motivate the next chapter instance.'}

${schemaBlock ? `\n${schemaBlock}\n` : ''}
${assessment ? `Assessment types to emphasize:\n${assessment}\n` : ''}
${aiActs ? `AI activities to include:\n${aiActs}\n` : ''}
${instance.extraInstructions ? `Additional instructions:\n${instance.extraInstructions.trim()}` : ''}
`.trim();
}

// ─── Revision / Student review messages ──────────────────────────────────────

export function buildRevisionUserMessage({ bookMeta, chapterMeta, sectionMeta, manuscript }) {
  const sectionLabel = sectionMeta
    ? `Experience block ${chapterMeta.chapterNumber}.${sectionMeta.order}: ${sectionMeta.title}`
    : `Full chapter instance ${chapterMeta.chapterNumber}: ${chapterMeta.title}`;

  return `${loadRevisionPrompt()}

---

Book: ${bookMeta.title}
${sectionLabel}

MANUSCRIPT TO REVISE:

${manuscript}
`;
}

export function buildStudentReviewUserMessage({ bookMeta, chapterMeta, sectionMeta, manuscript }) {
  const sectionLabel = sectionMeta
    ? `Experience block ${chapterMeta.chapterNumber}.${sectionMeta.order}: ${sectionMeta.title}`
    : `Full chapter instance ${chapterMeta.chapterNumber}: ${chapterMeta.title}`;

  return `${loadStudentReviewPrompt()}

---

Book: ${bookMeta.title}
${sectionLabel}

MANUSCRIPT TO IMPROVE:

${manuscript}
`;
}

// ─── Section file helpers ────────────────────────────────────────────────────

export function listChapterSectionFiles(chapterDir) {
  const sectionsDir = join(chapterDir, 'sections');
  if (!existsSync(sectionsDir)) return [];
  return readdirSync(sectionsDir)
    .filter((f) => f.endsWith('.md'))
    .sort();
}

export function readSectionManuscript(chapterDir, fileName) {
  return readFileSync(join(chapterDir, 'sections', fileName), 'utf8');
}

export function writeSectionManuscript(chapterDir, fileName, content) {
  mkdirSync(join(chapterDir, 'sections'), { recursive: true });
  writeFileSync(join(chapterDir, 'sections', fileName), content, 'utf8');
}

// Backward compatibility alias
export { loadChapterInstance as loadChapterPrompt };
