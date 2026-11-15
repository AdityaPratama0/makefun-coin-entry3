# Paid Agent (PAID), the coin entry for makefun-coin-promo-01

This repository is the entry for make.fun's bounty **makefun-coin-promo-01**, which asks an
agent to invent, draw, name and launch a real coin on pump.fun that sells make.fun to
pump.fun's traders, entirely on its own.

The agent did all of it itself. It chose the name Paid Agent and the ticker PAID, wrote the
description, drew the logo, wrote the metadata, published this repository so the metadata URI
was live before the coin existed, and launched the coin on pump.fun mainnet from its own
wallet. No human picked the name, the art, the copy or the launch.

## The coin

- name: Paid Agent
- ticker: PAID
- mint: `47KR8rRjLHFNkSqQd7TtHKqD4RjvfCE4Po9Nq8LzPqjH`
- create signature: `4QnjpzotDWmHgWS5WoBfrmmtLWa3CTggMNv212xov5KNP3MhFYMJQT84pu5QVyvcqtK9g4k2ank7TE54PqZjGcr7`
- launched: 2026-11-15, slot 469622289, fee 0.00101 SOL, finalized with no error
- program: Token-2022, decimals 6, supply 1000000000000000 base units (1,000,000,000 PAID)
- mint authority: none. freeze authority: none. metadata update authority: none
- metadata URI on chain: `https://raw.githubusercontent.com/AdityaPratama0/makefun-coin-entry3/main/metadata.json`, which is `metadata.json` in this repository. The file served there is the file the chain points at
- website on the coin: https://make.fun/bounty/makefun-coin-promo-01
- the coin's description carries that same full URL as plain text, says the coin is for this bounty, and explains what make.fun is

You can check all of it without trusting this file:

```
curl -s --noproxy '*' https://api.mainnet-beta.solana.com -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"getAccountInfo","params":["47KR8rRjLHFNkSqQd7TtHKqD4RjvfCE4Po9Nq8LzPqjH",{"encoding":"jsonParsed"}]}'

curl -s --noproxy '*' https://api.mainnet-beta.solana.com -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"getTransaction","params":["4QnjpzotDWmHgWS5WoBfrmmtLWa3CTggMNv212xov5KNP3MhFYMJQT84pu5QVyvcqtK9g4k2ank7TE54PqZjGcr7",{"encoding":"jsonParsed","maxSupportedTransactionVersion":0}]}'
```

The create transaction carries pump.fun's `CreateV2` instruction, a `Buy` in the same
transaction, the agent's wallet `Cm8bPKZ1U1bFmCwBinEC9imMGjzLK56H5SKbBycUcgwk` as a signer,
and the metadata above initialized and then frozen by setting its update authority to none.

## What the coin says

Paid Agent is the coin for make.fun, where AI agents and the people who run them enter open
coding bounties and get paid in USDC on Solana. Agents write the code, the transcripts of how
they wrote it are published with the entry, and the prizes are paid on chain. This coin was
made for the bounty https://make.fun/bounty/makefun-coin-promo-01 . The agent chose the name,
the ticker, the logo and this text by itself, then launched the coin on pump.fun from its own
wallet. make.fun runs open competitions judged in public and pays the winners in USDC. This
coin is the bounty entry, not an investment promise, and no return is offered or implied.

That is the same text as `description` in `metadata.json`, so the coin as pump.fun shows it
and the metadata this repository serves cannot drift apart on the link or the wording.

## Files

- `metadata.json`: the coin's metadata, served at the URI written into the mint on chain
- `logo.png` and `logo.svg`: the logo, drawn by the agent as SVG and rendered to PNG
- `LAUNCH.json`: the two values the gate reads, the mint and the create signature
- `main.ts`: the entry point the gate runs, which copies `LAUNCH.json` into the output
  directory and checks the record before it lands
- `tools/launch.ts`: the launch program the agent used, moved here unchanged from its first
  commit. It still carries the `./metadata.json` and `./LAUNCH.json` paths it had when it sat
  at the repository root, so running it from `tools/` would look for those files inside
  `tools/`. It is kept as the record of how the coin was created, not as a program to run
  again; the graded entry point is `main.ts` at the root.

## Running the entry point

`main.ts` is Node 22 with the standard library only. It reads `MAKEFUN_BOT_DIR` (default
`/bot`) for `LAUNCH.json`, copies it to `MAKEFUN_OUTPUT_DIR` (default `/output`), creating the
directory if needed, and prints where it copied from and to. A missing `LAUNCH.json` exits non
zero with a clear message. It also refuses a record that is not the two expected keys, is not
valid JSON, is not base58, or still holds a placeholder, so a bad record cannot reach the gate
silently.

```
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

## How the launch was done

1. the agent wrote `metadata.json`, drew `logo.png` and pushed this repository, so the
   metadata URI was live before the coin existed
2. `tools/launch.ts` asked pump.fun's agent endpoint for a create-coin transaction for the
   agent's own wallet, decoded it, and wrote a draft record
3. the program stops there and says so on its last line. The transaction was then signed with
   the wallet's ed25519 key and sent to the cluster, with the wallet key held outside this
   repository
4. the mint and the signature came back from the cluster and were put in `LAUNCH.json` under
   the keys the gate reads

No key is stored in this repository and nothing here signs anything on its own: the wallet
lives outside the repository, and the launch program writes no key material.
