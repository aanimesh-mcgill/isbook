/**
 * Standard chapter sections — order, slug, and authoring hints.
 */
export const STANDARD_SECTIONS = [
  { order: 1, slug: 'opening-case', title: 'Opening Case', sectionNum: 1 },
  { order: 2, slug: 'managerial-problem', title: 'Managerial Problem', sectionNum: 2 },
  { order: 3, slug: 'learning-objectives', title: 'Learning Objectives', sectionNum: 3 },
  { order: 4, slug: 'motivating-questions', title: 'Motivating Questions', sectionNum: 4 },
  { order: 5, slug: 'historical-evolution', title: 'Historical Evolution', sectionNum: 5 },
  { order: 6, slug: 'core-concepts', title: 'Core Concepts', sectionNum: 6 },
  { order: 7, slug: 'research-insights', title: 'Research Insights', sectionNum: 7 },
  { order: 8, slug: 'managerial-framework', title: 'Managerial Framework', sectionNum: 8 },
  { order: 9, slug: 'ai-transformation', title: 'AI Transformation', sectionNum: 9 },
  { order: 10, slug: 'industry-cases', title: 'Industry Cases', sectionNum: 10 },
  { order: 11, slug: 'ethical-issues', title: 'Ethical Issues', sectionNum: 11 },
  { order: 12, slug: 'manager-checklist', title: 'Manager Checklist', sectionNum: 12 },
  { order: 13, slug: 'key-takeaways', title: 'Key Takeaways', sectionNum: 13 },
  { order: 14, slug: 'discussion-questions', title: 'Discussion Questions', sectionNum: 14 },
  { order: 15, slug: 'ai-exercises', title: 'AI Exercises', sectionNum: 15 },
  { order: 16, slug: 'further-reading', title: 'Further Reading', sectionNum: 16 },
  { order: 17, slug: 'instructor-notes', title: 'Instructor Notes', sectionNum: 17 },
];

const SECTION_RULES = {
  'opening-case': `Use :::case fence with a real company (Amazon, Shopify, Tesla, etc.). 600–900 words. End with why a manager should care.`,
  'managerial-problem': `Open with a concrete CIO/manager scenario. Include one :::research block with cited evidence. 500–800 words.`,
  'learning-objectives': `Use :::checklist with 4–6 measurable objectives. Start with "After reading this chapter, you will be able to:"`,
  'motivating-questions': `5–7 numbered questions managers actually ask. No answers yet.`,
  'historical-evolution': `Timeline of how this management challenge evolved. Optional Markdown table.`,
  'core-concepts': `Introduce 2–4 concepts with :::callout for key insights. Explain before using jargon.`,
  'research-insights': `2–3 :::research blocks. Cite MIS Quarterly, ISR, Management Science, or HBR.`,
  'managerial-framework': `Introduce an original framework. Note FIGURE NEEDED: [description] where appropriate.`,
  'ai-transformation': `Before AI vs After AI Markdown table. One :::ai or :::exercise block on opportunities and risks.`,
  'industry-cases': `Three :::case blocks, different companies, ~200 words each.`,
  'ethical-issues': `2–3 ethical dilemmas. One :::manager block with guidance.`,
  'manager-checklist': `:::checklist with 6–8 actionable items.`,
  'key-takeaways': `5–7 bullet points, no new content.`,
  'discussion-questions': `5 questions for classroom discussion.`,
  'ai-exercises': `2 :::exercise blocks prompting AI assistant use.`,
  'further-reading': `8–12 academic references in Markdown list. Author, Year, Title, Journal.`,
  'instructor-notes': `Teaching tips, timing, common misconceptions. 300–500 words.`,
};

export function resolveSection(input) {
  const normalized = input.replace(/^\d+-/, '');
  const bySlug = STANDARD_SECTIONS.find((s) => s.slug === normalized || s.slug === input);
  if (bySlug) return bySlug;

  const byOrder = STANDARD_SECTIONS.find((s) => String(s.order) === input || String(s.sectionNum) === input);
  if (byOrder) return byOrder;

  throw new Error(`Unknown section "${input}". Use slug (e.g. learning-objectives) or order (e.g. 3).`);
}

export function sectionFileName(section) {
  return `${String(section.order).padStart(2, '0')}-${section.slug}.md`;
}

export function buildAuthorPrompt({ bookMeta, chapterMeta, section, extraInstructions = '' }) {
  const chapterNum = chapterMeta.chapterNumber;
  const sectionId = `${chapterNum}.${section.sectionNum}`;
  const fileName = sectionFileName(section);
  const chapterDir = `${String(chapterMeta.order).padStart(2, '0')}-${chapterMeta.slug}`;
  const rules = SECTION_RULES[section.slug] ?? 'Follow ISBX format with appropriate fenced blocks.';

  return `You are the Chief Author for the AI-First Information Systems Textbook.
You write evidence-based, managerial content for undergraduate and MBA students.
Output canonical ISBX manuscript format — NOT JSON, NOT HTML, NOT Firestore.

Write ONE section only:

Book: ${bookMeta.title}
Book slug: ${bookMeta.slug}
Chapter ${chapterNum}: ${chapterMeta.title}
Chapter slug: ${chapterMeta.slug}
Part ${chapterMeta.partNumber}: ${chapterMeta.partTitle}
Section ${sectionId}: ${section.title}
Section slug: ${section.slug}

Chapter summary for context: ${chapterMeta.summary ?? ''}

SECTION-SPECIFIC RULES:
${rules}

OUTPUT: Return ONLY the complete markdown file content. No preamble, no explanation after.
The file path is: books/${bookMeta.slug}/chapters/${chapterDir}/sections/${fileName}

Required frontmatter:
---
title: ${section.title}
section: "${sectionId}"
order: ${section.order}
slug: ${section.slug}
status: draft
learningObjectives:
  - [write 2-3 objectives for this section]
keywords:
  - [relevant keywords]
estimatedReadingTime: [minutes]
researchStreams:
  - [relevant research streams]
---

WRITING RULES:
- Managerial tone — "Why should a manager care?"
- Evidence-based — cite real research where appropriate
- No HTML tags
- No Firestore JSON
- Target 500–1,500 words
- Use fenced blocks: :::case :::research :::manager :::ai :::exercise :::checklist :::quote :::callout

${extraInstructions ? `ADDITIONAL INSTRUCTIONS:\n${extraInstructions}` : ''}`;
}

export function stripCodeFences(text) {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:markdown|md)?\n([\s\S]*?)\n```$/);
  if (fenceMatch) return fenceMatch[1].trim();
  return trimmed;
}
