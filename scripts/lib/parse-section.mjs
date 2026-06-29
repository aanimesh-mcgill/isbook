/**
 * ISBX section parser — transforms canonical Markdown into Firestore content blocks.
 * Never modifies author prose; only structures it.
 */

const FENCE_PATTERN = /:::(\w+)\n([\s\S]*?):::/g;

const FENCE_TO_BLOCK = {
  case: 'case',
  research: 'research_box',
  manager: 'callout',
  ai: 'paragraph',
  exercise: 'ai_exercise',
  checklist: 'checklist',
  quote: 'quote',
  callout: 'callout',
};

const IMAGE_PATTERN = /!\[([^\]]*)\]\(([^)]+)\)/;
const HEADING_PATTERN = /^(#{1,3})\s+(.+)$/;

/**
 * Parse a section Markdown file into frontmatter and content blocks.
 * @param {string} raw - Full file contents
 * @returns {{ frontmatter: Record<string, unknown>, blocks: Array<Record<string, unknown>> }}
 */
export function parseSection(raw) {
  const { frontmatter, body } = splitFrontmatter(raw);
  const blocks = [];
  let order = 1;

  const parts = splitByFences(body);

  for (const part of parts) {
    if (part.type === 'fence') {
      const blockType = FENCE_TO_BLOCK[part.fenceType] ?? 'paragraph';
      blocks.push({
        type: blockType,
        order: order++,
        content: part.content.trim(),
        metadata: part.fenceType === 'manager' ? { label: 'Managerial Implications' } : undefined,
      });
      continue;
    }

    const segments = splitPlainContent(part.content);
    for (const segment of segments) {
      if (!segment.content.trim()) continue;

      if (segment.kind === 'heading') {
        blocks.push({ type: 'heading', order: order++, content: segment.content });
      } else if (segment.kind === 'figure') {
        blocks.push({
          type: 'figure',
          order: order++,
          imageUrl: segment.imageUrl,
          alt: segment.alt,
          caption: segment.caption,
        });
      } else {
        blocks.push({ type: 'paragraph', order: order++, content: segment.content.trim() });
      }
    }
  }

  return { frontmatter, blocks };
}

function splitFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Missing YAML frontmatter (must start with ---)');
  }

  const frontmatter = parseSimpleYaml(match[1]);
  return { frontmatter, body: match[2] };
}

/** Minimal YAML parser for frontmatter (no external dep at runtime in browser). */
function parseSimpleYaml(yaml) {
  const result = {};
  let currentKey = null;
  let currentList = null;

  for (const line of yaml.split('\n')) {
    const listMatch = line.match(/^  - (.+)$/);
    if (listMatch && currentKey) {
      if (!currentList) currentList = [];
      currentList.push(stripQuotes(listMatch[1].trim()));
      result[currentKey] = currentList;
      continue;
    }

    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      currentList = null;
      const value = kvMatch[2].trim();
      if (value === '' || value === '|' || value === '>') {
        result[currentKey] = value === '>' ? '' : [];
        if (value === '') currentList = [];
      } else if (value.startsWith('[')) {
        result[currentKey] = JSON.parse(value.replace(/'/g, '"'));
      } else {
        result[currentKey] = coerceScalar(stripQuotes(value));
      }
    } else if (currentKey && line.trim() && !line.startsWith(' ')) {
      // multiline scalar continuation
      result[currentKey] = `${result[currentKey]} ${line.trim()}`;
    }
  }

  return result;
}

function stripQuotes(s) {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

function coerceScalar(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^\d+$/.test(value)) return Number(value);
  return value;
}

function splitByFences(body) {
  const parts = [];
  let lastIndex = 0;
  const regex = new RegExp(FENCE_PATTERN.source, 'g');
  let match;

  while ((match = regex.exec(body)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'plain', content: body.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'fence', fenceType: match[1], content: match[2] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < body.length) {
    parts.push({ type: 'plain', content: body.slice(lastIndex) });
  }

  return parts;
}

function splitPlainContent(text) {
  const segments = [];
  const paragraphs = text.split(/\n\n+/);

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    const imageMatch = trimmed.match(IMAGE_PATTERN);
    if (imageMatch && trimmed === imageMatch[0]) {
      segments.push({
        kind: 'figure',
        alt: imageMatch[1],
        imageUrl: imageMatch[2],
        caption: imageMatch[1] || undefined,
      });
      continue;
    }

    const headingMatch = trimmed.match(HEADING_PATTERN);
    if (headingMatch && !trimmed.includes('\n')) {
      segments.push({ kind: 'heading', content: headingMatch[2] });
      continue;
    }

    segments.push({ kind: 'paragraph', content: trimmed });
  }

  return segments;
}

/**
 * Validate section frontmatter and content.
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
export function validateSection(raw) {
  const errors = [];
  const warnings = [];

  try {
    const { frontmatter, blocks } = parseSection(raw);

    for (const field of ['title', 'section', 'order', 'slug', 'status']) {
      if (frontmatter[field] === undefined || frontmatter[field] === '') {
        errors.push(`Missing required frontmatter field: ${field}`);
      }
    }

    if (frontmatter.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(String(frontmatter.slug))) {
      errors.push(`Invalid slug "${frontmatter.slug}" — use lowercase hyphens only`);
    }

    if (/<[a-z][\s\S]*>/i.test(raw.split('---').slice(2).join('---') || raw)) {
      errors.push('HTML tags are not allowed in manuscript body');
    }

    if (blocks.length === 0) {
      errors.push('Section has no content blocks');
    }

    const wordCount = raw.split(/\s+/).length;
    if (wordCount > 3000) {
      warnings.push(`Section is ${wordCount} words — consider splitting (target: 500–1,500)`);
    }

    if (!frontmatter.learningObjectives) {
      warnings.push('Missing learningObjectives in frontmatter');
    }

    const openFences = (raw.match(/:::\w+/g) || []).length;
    const closeFences = (raw.match(/:::/g) || []).length;
    if (openFences * 2 !== closeFences) {
      errors.push('Unclosed fenced block (:::type ... :::)');
    }

    return { valid: errors.length === 0, errors, warnings, frontmatter, blocks };
  } catch (err) {
    return { valid: false, errors: [err.message], warnings: [] };
  }
}
