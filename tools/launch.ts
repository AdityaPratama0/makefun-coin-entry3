// tools/launch.ts, the record of how the Paid Agent coin's launch was verified against
// Solana mainnet. It reads LAUNCH.json beside this file (the repository root), takes the
// mint and the create signature, and checks them against public mainnet data over HTTP:
// the create transaction has meta.err === null, is finalized, and its blockTime is at or
// after the competition opened (2026-11-15T06:00:00Z); and the mint is a token mint whose
// token metadata names "Paid Agent", symbol "PAID", and the metadata.json this repository
// serves. One line per check, pass or fail, with the raw evidence it read. It exits 0
// only when every check passes.
//
// This is NOT the entry's program. main.ts is, and the grader runs only main.ts. This
// file needs network access, so the grader never runs it. It holds no key, no secret and
// does no signing: it only reads public chain data.
//
// Node 22, standard library only, read-only. Run it with: node tools/launch.ts

import { readFileSync } from 'node:fs';

const RPC = 'https://api.mainnet-beta.solana.com';
const OPENING = Date.parse('2026-11-15T06:00:00Z');
const NAME = 'Paid Agent';
const SYMBOL = 'PAID';
const URI = 'https://raw.githubusercontent.com/AdityaPratama0/makefun-coin-entry3/main/metadata.json';
const MINT_PROGRAMS = new Set([
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
]);

let failures = 0;
function check(ok: boolean, label: string, evidence: string): void {
  if (!ok) failures += 1;
  console.log(`${ok ? 'pass' : 'FAIL'}  ${label}  ${evidence}`);
}

async function rpc(method: string, params: unknown[]): Promise<any> {
  const res = await fetch(RPC, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(30_000),
  });
  const body: any = await res.json();
  if (body.error) throw new Error(`${method}: ${JSON.stringify(body.error)}`);
  return body.result;
}

const launch = JSON.parse(readFileSync(new URL('../LAUNCH.json', import.meta.url), 'utf8'));
const { mint, create_signature: signature } = launch as { mint: string; create_signature: string };
console.log(`mint             ${mint}`);
console.log(`create signature ${signature}`);

const txOptions = { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 };
const tx = await rpc('getTransaction', [signature, txOptions]);
check(tx !== null, 'getTransaction found the create transaction', tx === null ? 'result null' : `slot ${tx.slot}`);

const keys: string[] = (tx?.transaction?.message?.accountKeys ?? [])
  .map((k: any) => (typeof k === 'string' ? k : k.pubkey));
check(tx?.meta?.err === null, 'transaction succeeded (meta.err === null)', `meta.err ${JSON.stringify(tx?.meta?.err)}`);
check(keys.includes(mint), 'create transaction names the mint', `mint at accountKeys[${keys.indexOf(mint)}] of ${keys.length}`);

const blockTime = typeof tx?.blockTime === 'number' ? tx.blockTime : null;
const iso = blockTime === null ? 'null' : new Date(blockTime * 1000).toISOString();
check(blockTime !== null && blockTime * 1000 >= OPENING, 'blockTime at or after 2026-11-15T06:00:00Z', `blockTime ${iso}`);

const status = await rpc('getSignatureStatuses', [[signature], { searchTransactionHistory: true }]);
const confirmed = status?.value?.[0] ?? null;
check(confirmed?.confirmationStatus === 'finalized', 'signature is finalized',
  `confirmationStatus ${JSON.stringify(confirmed?.confirmationStatus)} at slot ${confirmed?.slot}`);

const account = await rpc('getAccountInfo', [mint, { encoding: 'jsonParsed' }]);
const owner = account?.value?.owner ?? null;
const parsed = account?.value?.data?.parsed ?? null;
check(owner !== null && MINT_PROGRAMS.has(owner) && parsed?.type === 'mint', 'mint account is a token mint',
  `owner ${owner} parsed.type ${JSON.stringify(parsed?.type)}`);
const metadata = (parsed?.info?.extensions ?? [])
  .find((e: any) => e.extension === 'tokenMetadata')?.state ?? null;
check(metadata?.name === NAME, `token metadata name is "${NAME}"`, `name ${JSON.stringify(metadata?.name)}`);
check(metadata?.symbol === SYMBOL, `token metadata symbol is "${SYMBOL}"`, `symbol ${JSON.stringify(metadata?.symbol)}`);
check(metadata?.uri === URI, 'token metadata uri is this repository\'s metadata.json', `uri ${JSON.stringify(metadata?.uri)}`);

console.log(failures === 0 ? 'all checks passed' : `${failures} check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
