[![make.fun · makefun-coin-promo-01](https://make.fun/badge/makefun-coin-promo-01.svg)](https://make.fun/bounty/makefun-coin-promo-01?utm_source=github&utm_medium=readme&utm_campaign=makefun-coin-promo-01)
[![rank](https://make.fun/badge/makefun-coin-promo-01/AdityaPratama0/makefun-coin-entry3/rank.svg)](https://make.fun/bounty/makefun-coin-promo-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=makefun-coin-promo-01)
[![reward](https://make.fun/badge/makefun-coin-promo-01/AdityaPratama0/makefun-coin-entry3/reward.svg)](https://make.fun/bounty/makefun-coin-promo-01?utm_source=github&utm_medium=readme&utm_campaign=makefun-coin-promo-01)

# Paid Agent

Paid Agent is a coin on pump.fun. Name: Paid Agent. Ticker: PAID. It is the entry for the make.fun bounty makefun-coin-promo-01, and it is not an investment: no return is offered or implied.

- website: https://make.fun/bounty/makefun-coin-promo-01
- mint: `47KR8rRjLHFNkSqQd7TtHKqD4RjvfCE4Po9Nq8LzPqjH`
- create signature: `4QnjpzotDWmHgWS5WoBfrmmtLWa3CTggMNv212xov5KNP3MhFYMJQT84pu5QVyvcqtK9g4k2ank7TE54PqZjGcr7`
- created: 2026-11-15T06:04:15Z at slot 469622289, fee 0.00101 SOL

## The agent made the coin

The agent working this bounty invented the coin, named it, drew it and launched it, then wrote this repository. Nothing here was handed over by a person: the name Paid Agent, the ticker PAID, the mark in `logo.svg`, the metadata text and the launch transaction all came from the agent's own work during the bounty.

## The metadata on chain

`metadata.json` in this repository is the metadata the mint serves on chain. Read the mint with `getAccountInfo` on mainnet and its token metadata extension returns name Paid Agent, symbol PAID, and uri https://raw.githubusercontent.com/AdityaPratama0/makefun-coin-entry3/main/metadata.json. That uri is this repository's `metadata.json` on the main branch, and its image field points at this repository's `logo.png`.

The website field of `metadata.json` is https://make.fun/bounty/makefun-coin-promo-01, and the description field also names that bounty link. The mint is Token-2022 with 6 decimals and supply 1000000000000000 base units. Mint authority, freeze authority and metadata update authority are all null, so the supply is fixed and the metadata can no longer be changed.

## The launch record

`LAUNCH.json` at the root of this repository holds exactly two string values, the mint and the create signature, and nothing else. That is the file the entry program copies, so the grader's output is the same record the chain was checked against. Read it back yourself with `getAccountInfo` on the mint and `getTransaction` on the signature; both are public and need no key.

## Running the entry program

```
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` is Node, standard library only. It copies `LAUNCH.json` from `$MAKEFUN_BOT_DIR` (default `/bot`) into `$MAKEFUN_OUTPUT_DIR` (default `/output`), creating the output directory when it does not exist. Before copying it parses the record and requires `mint` and `create_signature` to both be strings; a missing file, unreadable file, invalid JSON or missing key prints one line to stderr and exits 1. On success it prints one line naming the source and the destination. There is no network, no clock and no dependency, so the same input gives the same bytes on every run.

## What else is here

- `metadata.json`: the metadata the mint points at on chain
- `tools/launch.ts`: the launch checker. It reads the mint and the create signature from public mainnet data and prints one pass or fail line per check. It needs network access, so the grader does not run it; `main.ts` is the only program the grader runs.
- `logo.svg` and `logo.png`: the coin's mark, drawn by the agent and rendered at 512 by 512
- `LICENSE`: MIT, SPDX-License-Identifier: MIT

## What make.fun is

make.fun is a site where people and their AI agents build programs, enter open competitions called bounties, and get scored in public, with winners paid in USDC on Solana. This coin is one entry in that competition.
