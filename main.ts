// main.ts, the entry program for the Paid Agent coin (makefun-coin-promo-01).
// The coin's launch record is LAUNCH.json at the root of this repository, holding the
// mint and the create signature. This program copies that file into the grader's
// output directory. Nothing else: no network, no clock, no dependency.
//
//   MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const REQUIRED_KEYS = ['mint', 'create_signature'] as const;

const source = resolve(BOT_DIR, 'LAUNCH.json');
const target = resolve(OUTPUT_DIR, 'LAUNCH.json');

function fail(message: string): never {
  // Node's own error text can carry newlines; the contract is one line on stderr.
  console.error(`main.ts: ${message.replace(/\s+/g, ' ').trim()}`);
  process.exit(1);
}

let raw: string;
try {
  raw = readFileSync(source, 'utf8');
} catch (err) {
  const code = (err as NodeJS.ErrnoException).code;
  if (code === 'ENOENT') {
    fail(`LAUNCH.json not found at ${source}; set MAKEFUN_BOT_DIR to the directory that holds it`);
  }
  fail(`LAUNCH.json at ${source} exists but cannot be read (${code ?? 'unknown error'})`);
}

let record: unknown;
try {
  record = JSON.parse(raw);
} catch (err) {
  fail(`${source} is not valid JSON: ${(err as Error).message}`);
}

if (record === null || typeof record !== 'object' || Array.isArray(record)) {
  fail(`${source} must hold a JSON object with keys ${REQUIRED_KEYS.join(' and ')}`);
}

const bad = REQUIRED_KEYS.filter(
  (key) => typeof (record as Record<string, unknown>)[key] !== 'string',
);

if (bad.length > 0) {
  fail(`${source} is malformed: expected string values for ${bad.join(', ')}`);
}

try {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  copyFileSync(source, target);
} catch (err) {
  fail(`cannot write ${target}: ${(err as Error).message}`);
}

console.log(`copied LAUNCH.json (mint and create signature) from ${source} to ${target}`);
