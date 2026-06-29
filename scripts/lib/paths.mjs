/**
 * Resolve book/chapter/section paths under books/.
 */
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { load as loadYaml } from 'js-yaml';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const BOOKS_DIR = join(ROOT, 'books');

export function getBooksRoot() {
  return BOOKS_DIR;
}

export function resolveBookDir(bookSlug) {
  const dir = join(BOOKS_DIR, bookSlug);
  if (!existsSync(dir)) throw new Error(`Book not found: books/${bookSlug}`);
  return dir;
}

export function loadBookMeta(bookSlug) {
  const path = join(resolveBookDir(bookSlug), 'book.yaml');
  if (!existsSync(path)) throw new Error(`Missing books/${bookSlug}/book.yaml`);
  return loadYaml(readFileSync(path, 'utf8'));
}

export function resolveChapterDir(bookSlug, chapterDir) {
  const dir = join(resolveBookDir(bookSlug), 'chapters', chapterDir);
  if (!existsSync(dir)) throw new Error(`Chapter not found: books/${bookSlug}/chapters/${chapterDir}`);
  return dir;
}

export function loadChapterMeta(bookSlug, chapterDir) {
  const path = join(resolveChapterDir(bookSlug, chapterDir), 'chapter.yaml');
  if (!existsSync(path)) throw new Error(`Missing chapter.yaml in ${chapterDir}`);
  return loadYaml(readFileSync(path, 'utf8'));
}

export function listSectionFiles(bookSlug, chapterDir) {
  const sectionsDir = join(resolveChapterDir(bookSlug, chapterDir), 'sections');
  if (!existsSync(sectionsDir)) return [];
  return readdirSync(sectionsDir)
    .filter((f) => f.endsWith('.md'))
    .sort();
}

export function loadSectionFile(bookSlug, chapterDir, sectionFile) {
  const path = join(resolveChapterDir(bookSlug, chapterDir), 'sections', sectionFile);
  if (!existsSync(path)) throw new Error(`Section not found: ${sectionFile}`);
  return readFileSync(path, 'utf8');
}

export function listChapters(bookSlug) {
  const chaptersDir = join(resolveBookDir(bookSlug), 'chapters');
  if (!existsSync(chaptersDir)) return [];
  return readdirSync(chaptersDir).filter((d) => !d.startsWith('.')).sort();
}

export function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      args[key] = argv[i + 1] ?? true;
      i++;
    }
  }
  return args;
}
