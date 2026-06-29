/**
 * @deprecated Use `npm run publish` instead. Reads from books/ canonical manuscripts.
 * Legacy seed script — kept for reference only.
 */
import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { Firestore } from '@google-cloud/firestore';
import { OAuth2Client } from 'google-auth-library';

function initDb() {
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (serviceAccountPath && existsSync(serviceAccountPath)) {
    return new Firestore({
      projectId: 'istextbook-e8a3b',
      keyFilename: serviceAccountPath,
    });
  }

  const token = execSync('gcloud auth print-access-token', { encoding: 'utf8' }).trim();
  const authClient = new OAuth2Client();
  authClient.setCredentials({ access_token: token });

  return new Firestore({
    projectId: 'istextbook-e8a3b',
    authClient,
  });
}

const now = new Date().toISOString();

const book = {
  title: 'Managing Organizations in the Age of AI',
  subtitle: 'An AI-First Introduction to Information Systems',
  description:
    'A next-generation textbook for undergraduate and MBA students that teaches managerial thinking for the intelligent enterprise.',
  slug: 'managing-organizations-ai',
  status: 'published',
  partCount: 2,
  chapterCount: 1,
  createdAt: now,
  updatedAt: now,
  publishedAt: now,
};

const chapter = {
  title: 'The Digital Organization and the AI Revolution',
  slug: 'digital-organization-ai-revolution',
  partNumber: 1,
  partTitle: 'Managing Organizations with Digital Technologies',
  chapterNumber: 1,
  summary:
    'How digital technologies and artificial intelligence are reshaping how organizations create value.',
  order: 1,
  status: 'published',
  createdAt: now,
  updatedAt: now,
};

const sections = [
  { title: 'Opening Case', slug: 'opening-case', order: 1 },
  { title: 'Managerial Problem', slug: 'managerial-problem', order: 2 },
  { title: 'Core Concepts', slug: 'core-concepts', order: 3 },
  { title: 'AI Transformation', slug: 'ai-transformation', order: 4 },
];

const openingCaseBlocks = [
  {
    type: 'case',
    order: 1,
    content: `## Amazon's Intelligent Enterprise

In 2024, Amazon processed billions of customer interactions daily—not through manual decision-making, but through an interconnected system of algorithms, data pipelines, and human oversight.

When a customer searches for a product, multiple AI systems simultaneously predict intent, personalize results, optimize pricing, forecast inventory, and route delivery. No single manager makes these decisions. Instead, **organizational intelligence** emerges from the coordination of digital resources.

This is the modern digital organization: not a company that *uses* technology, but a company whose core capabilities are built on digital resources managed as strategic assets.`,
  },
  {
    type: 'paragraph',
    order: 2,
    content: `This chapter introduces the foundational concepts you need to understand how organizations create value through digital technologies—and how artificial intelligence is transforming every managerial function.`,
  },
];

const managerialProblemBlocks = [
  {
    type: 'heading',
    order: 1,
    content: 'The Managerial Challenge',
  },
  {
    type: 'paragraph',
    order: 2,
    content: `Consider this scenario: You are the CIO of a mid-sized retailer. Your CEO asks: *"Should we invest $2 million in an AI-powered demand forecasting system?"*

Traditional textbooks would explain forecasting algorithms. But as a manager, you need to answer different questions:

- Will this improve decision quality?
- What organizational changes are required?
- How do we measure success?
- What are the risks of AI-driven decisions?
- How do we maintain human oversight?

**This textbook teaches you to think like a manager, not a technologist.**`,
  },
  {
    type: 'research_box',
    order: 3,
    content: `**Research Question:** Does digital transformation improve firm performance?

**Evidence:** Strong but conditional. Technology alone rarely creates competitive advantage. Organizational change—new processes, skills, and governance—is essential (Brynjolfsson & McElheran, 2016; Tambe et al., 2020).`,
  },
];

const coreConceptsBlocks = [
  {
    type: 'heading',
    order: 1,
    content: 'The Organizational Resource Framework',
  },
  {
    type: 'paragraph',
    order: 2,
    content: `Organizations create value by acquiring, combining, and deploying **resources**. Managers coordinate four types of organizational resources:

1. **Customers** — relationships and market access
2. **Operations** — processes and capabilities
3. **People** — knowledge, skills, and culture
4. **Finance** — capital and performance metrics

Digital technologies enhance how managers coordinate each resource type. In Part I of this book, we examine each in turn.`,
  },
  {
    type: 'callout',
    order: 3,
    content: `**Key Insight:** Information Systems are not about technology. They are about how managers use information to make better decisions about organizational resources.`,
  },
];

const aiTransformationBlocks = [
  {
    type: 'heading',
    order: 1,
    content: 'Before AI vs. After AI',
  },
  {
    type: 'paragraph',
    order: 2,
    content: `| Dimension | Before AI | After AI |
|-----------|-----------|----------|
| Decision speed | Days to weeks | Real-time |
| Data processing | Sample-based | Full population |
| Personalization | Segment-level | Individual-level |
| Forecasting | Statistical models | Adaptive learning |
| Human role | Decision maker | Decision supervisor |`,
  },
  {
    type: 'ai_exercise',
    order: 3,
    content: `**Reflect with AI:** Open your preferred AI assistant and ask:

*"What are three ways AI could change how a retail manager makes inventory decisions?"*

Compare the AI's response with the framework above. What did it miss? What surprised you?`,
  },
  {
    type: 'checklist',
    order: 4,
    content: `**Manager Checklist — Evaluating AI Investments**

- [ ] Does this improve a specific managerial decision?
- [ ] What data quality is required?
- [ ] What organizational changes are needed?
- [ ] How will we measure ROI?
- [ ] What governance ensures responsible use?
- [ ] What happens when the AI is wrong?`,
  },
];

async function seed() {
  const db = initDb();
  console.log('Seeding Firestore…');

  const bookRef = db.collection('books').doc();
  await bookRef.set(book);
  console.log(`Created book: ${bookRef.id}`);

  const chapterRef = db.collection('chapters').doc();
  await chapterRef.set({
    ...chapter,
    bookId: bookRef.id,
  });
  console.log(`Created chapter: ${chapterRef.id}`);

  const sectionBlocks = [
    openingCaseBlocks,
    managerialProblemBlocks,
    coreConceptsBlocks,
    aiTransformationBlocks,
  ];

  for (let i = 0; i < sections.length; i++) {
    const sectionRef = db.collection('sections').doc();
    await sectionRef.set({
      ...sections[i],
      bookId: bookRef.id,
      chapterId: chapterRef.id,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`Created section: ${sectionRef.id} (${sections[i].title})`);

    for (const block of sectionBlocks[i]) {
      const blockRef = db.collection('contentBlocks').doc();
      await blockRef.set({
        ...block,
        bookId: bookRef.id,
        chapterId: chapterRef.id,
        sectionId: sectionRef.id,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  console.log('Seed complete!');
  console.log(`Book slug: ${book.slug}`);
  console.log(`Read at: /read/${book.slug}/${chapter.slug}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
