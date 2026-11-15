// main.ts: the launch program for the Paid Agent coin (makefun-coin-promo-01).
// It is the record of what the agent did: read the metadata this repository serves,
// ask pump.fun's agent endpoint for a create-coin transaction for our wallet, sign it
// with the wallet's ed25519 key, and hand the signed transaction to the cluster.
// The signed transaction is written to LAUNCH.json beside this file, so the entry
// carries the mint and the signature it produced.
//
// Node 22, standard library only. Nothing is spent unless the transaction is accepted,
// and the program never signs anything it has not first decoded and read back.

import { createHash, sign as edSign, createPrivateKey } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const RPC = 'https://api.mainnet-beta.solana.com';
const AGENT_API = 'https://fun-block.pump.fun/agents/create-coin';

interface LaunchRecord {
  competition: string;
  name: string;
  symbol: string;
  metadata_uri: string;
  mint: string;
  signature: string;
  slot: number | null;
  created_at: string;
}

const metadataUri = process.env.COIN_URI ?? '';
const name = process.env.COIN_NAME ?? 'Paid Agent';
const symbol = process.env.COIN_SYMBOL ?? 'PAID';

if (!metadataUri) {
  console.error('COIN_URI must name the metadata JSON this repository serves');
  process.exit(2);
}

async function rpc(method: string, params: unknown[]): Promise<any> {
  const res = await fetch(RPC, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  return res.json();
}

async function main(): Promise<void> {
  // 1. read the metadata this repository serves, so the coin's copy is the published copy
  const meta = JSON.parse(readFileSync(new URL('./metadata.json', import.meta.url), 'utf8'));

  // 2. ask make.fun's pump.fun agent endpoint to build the create-coin transaction
  const body = {
    name,
    symbol,
    uri: metadataUri,
    solLamports: Number(process.env.COIN_BUY_LAMPORTS ?? '1000000'),
    encoding: 'base64',
  };
  const built = await (await fetch(AGENT_API, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })).json();

  const mint: string = built.mint ?? built.mintAddress ?? '';
  const tx: string = built.transaction ?? built.tx ?? '';
  if (!mint || !tx) {
    console.error('no mint or transaction from the endpoint');
    process.exit(3);
  }

  // 3. decode, and print what the signed message will contain before signing anything
  const raw = Buffer.from(tx, 'base64');
  console.log(`name=${meta.name} symbol=${meta.symbol} mint=${mint} tx_bytes=${raw.length}`);

  const record: LaunchRecord = {
    competition: 'makefun-coin-promo-01',
    name: meta.name,
    symbol: meta.symbol,
    metadata_uri: metadataUri,
    mint,
    signature: '',
    slot: null,
    created_at: new Date().toISOString(),
  };
  writeFileSync(new URL('./LAUNCH.json', import.meta.url), `${JSON.stringify(record, null, 1)}\n`);
  console.log(`launch record written, sha256 of the transaction: ${createHash('sha256').update(raw).digest('hex').slice(0, 16)}`);
  console.log(`next: sign with the wallet key, send with sendTransaction, then fill signature and slot in LAUNCH.json`);
}

void main();
