# OpenAI Author — Step-by-Step Setup

Generate textbook sections using **ChatGPT models (GPT-4o)** directly from Cursor's terminal.

---

## Step 1 — Get an OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in (or create an account)
3. Open **API keys** → **Create new secret key**
4. Copy the key (starts with `sk-...`)
5. Add billing at [platform.openai.com/settings/organization/billing](https://platform.openai.com/settings/organization/billing) if required

> API usage is pay-per-token. One section (~1,500 words) costs roughly **$0.05–$0.15** with GPT-4o.

---

## Step 2 — Add the Key to Your Project

Open `.env` in the project root and add:

```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o
```

`.env` is gitignored — your key stays local.

---

## Step 3 — Install Dependencies

In Cursor's terminal:

```bash
cd c:\Users\aanime\isbook
npm install
```

(`openai` is already in package.json after setup.)

---

## Step 4 — Generate a Section

```bash
npm run author -- --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution --section learning-objectives
```

### Arguments

| Argument | Required | Example |
|----------|----------|---------|
| `--book` | Yes | `managing-organizations-ai` |
| `--chapter` | Yes | `01-digital-organization-ai-revolution` |
| `--section` | Yes | `learning-objectives` or `3` |
| `--model` | No | `gpt-4o` (default) |
| `--instructions` | No | `"Use Starbucks as the case company"` |
| `--out` | No | `inbox` (default) or `chapter` |
| `--validate` | No | Run ISBX validation after generation |

### Section names (slug or number)

| # | Slug |
|---|------|
| 1 | `opening-case` |
| 2 | `managerial-problem` |
| 3 | `learning-objectives` |
| 4 | `motivating-questions` |
| 5 | `historical-evolution` |
| 6 | `core-concepts` |
| 7 | `research-insights` |
| 8 | `managerial-framework` |
| 9 | `ai-transformation` |
| 10 | `industry-cases` |
| 11 | `ethical-issues` |
| 12 | `manager-checklist` |
| 13 | `key-takeaways` |
| 14 | `discussion-questions` |
| 15 | `ai-exercises` |
| 16 | `further-reading` |
| 17 | `instructor-notes` |

---

## Step 5 — Review the Output

The file is saved to:

```
books/_inbox/03-learning-objectives.md
```

Open it in Cursor. **You are the editor** — fix anything before publishing.

---

## Step 6 — Move to the Chapter Folder (if using inbox)

Either move manually, or re-run with `--out chapter`:

```bash
npm run author -- --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution --section learning-objectives --out chapter
```

Or tell Cursor:

```text
Move books/_inbox/03-learning-objectives.md to the correct chapter sections folder.
```

---

## Step 7 — Validate

```bash
node scripts/validate.mjs --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution --section 03-learning-objectives
```

Or generate with validation built in:

```bash
npm run author -- --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution --section 3 --validate
```

---

## Step 8 — Publish to Firestore

1. Set `status: published` in the section frontmatter when ready
2. Publish:

```bash
node scripts/publish-section.mjs --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution --section 03-learning-objectives
```

Or publish the whole chapter:

```bash
node scripts/publish.mjs --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution
```

---

## Step 9 — Deploy the Website

```bash
npm run firebase:deploy
```

Live at: `https://istextbook-e8a3b.web.app/read/managing-organizations-ai/digital-organization-ai-revolution/learning-objectives`

---

## Full Workflow (One Section)

```bash
# 1. Generate
npm run author -- --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution --section 3 --validate

# 2. Review books/_inbox/03-learning-objectives.md in Cursor

# 3. Move to chapter folder + set status: published (or use --out chapter)

# 4. Publish
node scripts/publish-section.mjs --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution --section learning-objectives

# 5. Deploy
npm run firebase:deploy
```

---

## Tips

- **One section at a time** — never generate a full chapter
- **Add instructions** for specific companies or angles:
  ```bash
  npm run author -- --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution --section opening-case --instructions "Use Shopify, focus on Canadian SME context"
  ```
- **Cheaper model** for drafts: `--model gpt-4o-mini`
- **Cursor's role** after generation: validate, move, publish, deploy — never rewrite prose unless you ask

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Missing OPENAI_API_KEY` | Add key to `.env` |
| `401 Unauthorized` | Check API key is valid |
| `429 Rate limit` | Wait and retry, or upgrade OpenAI plan |
| Validation fails | Edit the `.md` file manually, re-run validate |
| Section not on website | Check `status: published` in frontmatter |
