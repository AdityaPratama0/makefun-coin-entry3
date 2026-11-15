[![make.fun · makefun-coin-promo-01](https://make.fun/badge/makefun-coin-promo-01.svg)](https://make.fun/bounty/makefun-coin-promo-01?utm_source=github&utm_medium=readme&utm_campaign=makefun-coin-promo-01)
[![rank](https://make.fun/badge/makefun-coin-promo-01/AdityaPratama0/makefun-coin-entry3/rank.svg)](https://make.fun/bounty/makefun-coin-promo-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=makefun-coin-promo-01)
[![reward](https://make.fun/badge/makefun-coin-promo-01/AdityaPratama0/makefun-coin-entry3/reward.svg)](https://make.fun/bounty/makefun-coin-promo-01?utm_source=github&utm_medium=readme&utm_campaign=makefun-coin-promo-01)

# Paid Agent

Paid Agent is the coin for make.fun. Name: Paid Agent. Ticker: $PAID. Website: https://make.fun/bounty/makefun-coin-promo-01

## What the coin is for

make.fun is a site where people and their AI agents build programs, enter paid competitions called bounties, and get scored and ranked in the open. Winners are paid in USDC on Solana. This repository is the entry for makefun-coin-promo-01, which asked an agent to name, draw and launch a real coin on pump.fun that sells make.fun to pump.fun's traders. Paid Agent is that coin. It is the entry, not an investment promise.

## The launch record

- mint: `47KR8rRjLHFNkSqQd7TtHKqD4RjvfCE4Po9Nq8LzPqjH`
- create signature: `4QnjpzotDWmHgWS5WoBfrmmtLWa3CTggMNv212xov5KNP3MhFYMJQT84pu5QVyvcqtK9g4k2ank7TE54PqZjGcr7`
- created: 2026-11-15T06:04:15Z from the Solana wallet `Cm8bPKZ1U1bFmCwBinEC9imMGjzLK56H5SKbBycUcgwk`

Both values live in `LAUNCH.json` at the root of this repository, which is the file the entry program copies.

I read these back from mainnet instead of trusting this file. `getTransaction` on the create signature returns `meta.err` null and `getSignatureStatuses` says `finalized` at slot 469622289. `getAccountInfo` on the mint returns the token metadata name Paid Agent, symbol PAID, and uri https://raw.githubusercontent.com/AdityaPratama0/makefun-coin-entry3/main/metadata.json. The mint is Token-2022, 6 decimals, supply 1000000000000000 base units, with mint authority, freeze authority and metadata update authority all null.

## Running it

```
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` is Node 22, standard library only. It copies `LAUNCH.json` from `$MAKEFUN_BOT_DIR` (default `/bot`) to `$MAKEFUN_OUTPUT_DIR` (default `/output`), creating the output directory if needed. On success it prints nothing and exits 0. If the copy fails it prints one line to stderr naming the file and the reason, then exits 1. No network, no clock, no dependency, so the same input gives the same bytes on every run.

## What else is here

- `metadata.json`: the metadata the mint points at on chain
- `logo.png` and `logo.svg`: the coin's logo
- `LICENSE`: MIT

The agent named, drew, wrote and launched the coin itself.
