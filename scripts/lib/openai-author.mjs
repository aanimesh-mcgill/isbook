/**
 * Shared OpenAI author utilities.
 */
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import { stripCodeFences } from './book-catalog.mjs';
import { getSystemPrompt } from './tos.mjs';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));

export function loadEnv() {
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

export function getOpenAIClient() {
  loadEnv();
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes('your-key')) {
    throw new Error('Set OPENAI_API_KEY in .env — see docs/author/OPENAI_AUTHOR.md');
  }
  return new OpenAI({ apiKey });
}

export function getModel(argsModel) {
  return argsModel ?? process.env.OPENAI_MODEL ?? 'gpt-4o';
}

/**
 * Call OpenAI with Pedagogy Engine (TOS) as system prompt.
 * Retries on rate-limit (429) with backoff.
 * @returns {{ content: string, usage: object | undefined }}
 */
export async function generateManuscript({
  userPrompt,
  model,
  temperature = 0.7,
  bookSlug,
  maxRetries = 5,
}) {
  const openai = getOpenAIClient();
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model,
        temperature,
        messages: [
          { role: 'system', content: getSystemPrompt({ bookSlug }) },
          { role: 'user', content: userPrompt },
        ],
      });

      const raw = response.choices[0]?.message?.content;
      if (!raw) throw new Error('empty response from OpenAI');

      return {
        content: stripCodeFences(raw),
        usage: response.usage,
      };
    } catch (err) {
      lastError = err;
      const is429 = err?.status === 429 || String(err?.message).includes('429');
      if (!is429 || attempt === maxRetries) throw err;
      const waitMs = Math.min(60000, 8000 * 2 ** attempt);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }

  throw lastError;
}

export { ROOT };
