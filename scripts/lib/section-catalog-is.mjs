/**
 * IS Textbook standard sections (Managing Organizations in the Age of AI).
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

export const IS_SECTION_RULES = {
  'opening-case': `Use :::case fence with a real company. 600–900 words. End with why a manager should care.`,
  'managerial-problem': `Concrete CIO scenario. One :::research block with cited evidence. 500–800 words.`,
  'learning-objectives': `:::checklist with 4–6 objectives. Start with "After reading this chapter, you will be able to:"`,
  'motivating-questions': `5–7 numbered questions. No answers yet.`,
  'historical-evolution': `Timeline with optional Markdown table.`,
  'core-concepts': `2–4 concepts with :::callout. Explain before jargon.`,
  'research-insights': `2–3 :::research blocks citing academic sources.`,
  'managerial-framework': `Original framework. Note FIGURE NEEDED where appropriate.`,
  'ai-transformation': `Before/After AI table. One :::exercise block.`,
  'industry-cases': `Three :::case blocks, ~200 words each.`,
  'ethical-issues': `2–3 dilemmas. One :::manager block.`,
  'manager-checklist': `:::checklist with 6–8 items.`,
  'key-takeaways': `5–7 bullets, no new content.`,
  'discussion-questions': `5 classroom questions.`,
  'ai-exercises': `2 :::exercise blocks for AI assistant use.`,
  'further-reading': `8–12 academic references.`,
  'instructor-notes': `Teaching tips, 300–500 words.`,
};

export function sectionFileName(section) {
  return `${String(section.order).padStart(2, '0')}-${section.slug}.md`;
}

export function stripCodeFences(text) {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:markdown|md)?\n([\s\S]*?)\n```$/);
  if (fenceMatch) return fenceMatch[1].trim();
  return trimmed;
}
