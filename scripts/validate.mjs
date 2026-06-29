#!/usr/bin/env node
/**
 * Validate ISBX section manuscripts.
 *
 * Usage:
 *   npm run validate -- --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution
 *   npm run validate -- --book managing-organizations-ai --chapter 01-digital-organization-ai-revolution --section 01-opening-case
 */
import { parseArgs, listSectionFiles, loadSectionFile } from './lib/paths.mjs';
import { validateSection } from './lib/parse-section.mjs';

const args = parseArgs(process.argv.slice(2));

if (!args.book || !args.chapter) {
  console.error('Usage: npm run validate -- --book <slug> --chapter <dir> [--section <file-without-md>]');
  process.exit(1);
}

const sectionFiles = args.section
  ? [`${args.section}.md`]
  : listSectionFiles(args.book, args.chapter);

if (sectionFiles.length === 0) {
  console.error('No section files found.');
  process.exit(1);
}

let hasErrors = false;

for (const file of sectionFiles) {
  const raw = loadSectionFile(args.book, args.chapter, file);
  const result = validateSection(raw);

  console.log(`\n${file}`);
  if (result.warnings?.length) {
    result.warnings.forEach((w) => console.log(`  ⚠ ${w}`));
  }
  if (!result.valid) {
    hasErrors = true;
    result.errors.forEach((e) => console.log(`  ✗ ${e}`));
  } else {
    console.log(`  ✓ valid (${result.blocks?.length ?? 0} blocks)`);
  }
}

process.exit(hasErrors ? 1 : 0);
