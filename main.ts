// main.ts: entry point for the makefun-coin-promo-01 bounty.
//
// The graded job is one copy: take LAUNCH.json from the bot directory and put it
// in the output directory the gate reads. Node 22, standard library only.
//
// The first run of this file only copied bytes. It passed a file that happened to
// be well formed, and would have passed an empty object just as happily, so the
// copy now checks the record before it lands: both keys present, both strings,
// both plausible base58, no placeholder left behind. A bad record is a failure
// here with a non zero exit, not a silent bad entry at the gate.

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = resolve(join(botDir, 'LAUNCH.json'));
const dest = resolve(join(outDir, 'LAUNCH.json'));

const EXPECTED_KEYS = ['mint', 'create_signature'] as const;
const BASE58 = /^[1-9A-HJ-NP-Za-km-z]+$/;
const MINT_PATTERN = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const SIGNATURE_PATTERN = /^[1-9A-HJ-NP-Za-km-z]{64,88}$/;

function fail(code: number, ...lines: string[]): never {
  for (const line of lines) console.error(`main.ts: ${line}`);
  process.exit(code);
}

function readRecord(path: string): { mint: string; create_signature: string } {
  let raw: string;
  try {
    raw = readFileSync(path, 'utf8');
  } catch (error) {
    fail(2, `cannot read ${path}`, (error as Error).message);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    fail(3, `${path} is not valid JSON`, (error as Error).message);
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    fail(3, `${path} must hold a JSON object`);
  }

  const record = parsed as Record<string, unknown>;
  const keys = Object.keys(record);

  const unexpected = keys.filter((key) => !EXPECTED_KEYS.includes(key as never));
  if (unexpected.length > 0) {
    fail(3, `${path} has keys the gate does not read: ${unexpected.join(', ')}`);
  }

  for (const key of EXPECTED_KEYS) {
    if (!(key in record)) fail(3, `${path} is missing the key ${key}`);
    const value = record[key];
    if (typeof value !== 'string' || value.length === 0) {
      fail(3, `${path}: ${key} must be a non empty string`);
    }
    if (!BASE58.test(value)) {
      fail(3, `${path}: ${key} is not base58`);
    }
    if (/placeholder|todo|xxx|example/i.test(value)) {
      fail(3, `${path}: ${key} still holds a placeholder`);
    }
  }

  const mint = record.mint as string;
  const create_signature = record.create_signature as string;

  if (!MINT_PATTERN.test(mint)) {
    fail(3, `${path}: mint does not look like a mint address`);
  }
  if (!SIGNATURE_PATTERN.test(create_signature)) {
    fail(3, `${path}: create_signature does not look like a transaction signature`);
  }

  return { mint, create_signature };
}

if (!existsSync(source) || !statSync(source).isFile()) {
  fail(
    2,
    `LAUNCH.json not found at ${source}`,
    'set MAKEFUN_BOT_DIR to the directory that holds LAUNCH.json',
  );
}

const record = readRecord(source);

mkdirSync(outDir, { recursive: true });
copyFileSync(source, dest);
console.log(`copied LAUNCH.json from ${source} to ${dest}`);
console.log(`mint=${record.mint} create_signature=${record.create_signature}`);
