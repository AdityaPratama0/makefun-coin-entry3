// main.ts, the entry program for the Paid Agent coin (makefun-coin-promo-01).
// The coin's launch record is LAUNCH.json at the root of this repository, holding the
// mint and the create signature. This program copies that file into the grader's
// output directory. Nothing else: no network, no clock, no dependency.
//
//   MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(BOT_DIR, 'LAUNCH.json');
const target = join(OUTPUT_DIR, 'LAUNCH.json');

try {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  copyFileSync(source, target);
} catch (err) {
  console.error(`LAUNCH.json: failed to copy to ${target}: ${(err as Error).message}`);
  process.exit(1);
}
