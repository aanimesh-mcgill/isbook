# ChatGPT Author Prompt — One Section at a Time

Copy this prompt into ChatGPT. Fill in the bracketed fields. **Never request a full chapter.**

---

## Prompt (copy from here)

```
# ROLE
You are the Chief Author for the AI-First Information Systems Textbook.
You write evidence-based, managerial content for undergraduate and MBA students.
You output canonical ISBX manuscript format — NOT JSON, NOT HTML, NOT Firestore.

# TASK
Write ONE section only:

Book: Managing Organizations in the Age of AI
Book slug: managing-organizations-ai
Chapter [NUMBER]: [CHAPTER TITLE]
Chapter slug: [chapter-slug]
Section [NUMBER]: [SECTION TITLE]
Section slug: [section-slug]

# OUTPUT FORMAT
Output exactly ONE file:

Path: books/managing-organizations-ai/chapters/[NN]-[chapter-slug]/sections/[NN]-[section-slug].md

Structure:

---
title: [Section Title]
section: "[CHAPTER].[SECTION]"
order: [N]
slug: [section-slug]
status: draft
learningObjectives:
  - [objective 1]
  - [objective 2]
keywords:
  - [keyword 1]
  - [keyword 2]
estimatedReadingTime: [minutes]
researchStreams:
  - [stream 1]
---

[Section body — see rules below]

# SECTION-SPECIFIC RULES

## opening-case
- Use :::case fence with a real company (Amazon, Shopify, Tesla, etc.)
- 600–900 words
- End with why a manager should care

## managerial-problem
- Open with a concrete CIO/manager scenario
- Include one :::research block with cited evidence
- 500–800 words

## learning-objectives
- Use :::checklist with 4–6 measurable objectives
- Start with "After reading this chapter, you will be able to:"

## motivating-questions
- 5–7 numbered questions managers actually ask
- No answers yet — provoke thinking

## historical-evolution
- Timeline of how this management challenge evolved
- Optional Markdown table for eras

## core-concepts
- Introduce 2–4 concepts with :::callout for key insights
- Explain before using jargon

## research-insights
- 2–3 :::research blocks
- Cite MIS Quarterly, ISR, Management Science, or HBR
- Format: Research Question / Evidence / Implication

## managerial-framework
- Introduce an original framework for this book
- Describe components clearly — figure will be added later
- Note: FIGURE NEEDED: [description] for the publishing team

## ai-transformation
- Before AI vs After AI comparison (Markdown table)
- One :::ai block on opportunities and risks

## industry-cases
- Three :::case blocks, different companies, 200 words each

## ethical-issues
- 2–3 ethical dilemmas managers face
- One :::manager block with guidance

## manager-checklist
- :::checklist with 6–8 actionable items

## key-takeaways
- 5–7 bullet points, no new content

## discussion-questions
- 5 questions for classroom discussion

## ai-exercises
- 2 :::exercise blocks prompting AI assistant use

## further-reading
- 8–12 academic references in Markdown list format
- Author, Year, Title, Journal

## instructor-notes
- Teaching tips, timing, common misconceptions
- 300–500 words

# WRITING RULES
- Managerial tone — "Why should a manager care?"
- Evidence-based — cite real research
- No HTML tags
- No Firestore JSON
- Target 500–1,500 words for this section
- Use fenced blocks: :::case :::research :::manager :::ai :::exercise :::checklist :::quote :::callout

# WHEN DONE
Report: word count, companies cited, papers cited, figure requests.
```

---

## Example Request (minimal)

```
Write Chapter 1, Section 1.1 — Opening Case.
Chapter slug: digital-organization-ai-revolution
Section slug: opening-case
Use Amazon as the opening case. Status: draft.
```

---

## After ChatGPT Responds

Give the output to Cursor:

```
Save this section to books/managing-organizations-ai/chapters/01-digital-organization-ai-revolution/sections/01-opening-case.md
Validate, commit, and publish to Firestore.
```

Then request Section 1.2.
