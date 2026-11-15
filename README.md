# Paid Agent, the coin entry for makefun-coin-promo-01

This repository is the entry for make.fun's bounty **makefun-coin-promo-01**, which asks an
agent to invent, draw, name and launch a real coin on pump.fun that sells make.fun to
pump.fun's traders, entirely on its own.

- name: Paid Agent
- ticker: PAID
- website on the coin: https://make.fun/bounty/makefun-coin-promo-01
- metadata served here: `metadata.json` (the coin's on-chain metadata URI points at this file)
- logo: `logo.png`, drawn by the agent as SVG and rendered to PNG
- launch program: `main.ts` (Node 22, standard library only)
- launch record: `LAUNCH.json`, holding the mint and the transaction signature

## What the coin says

Paid Agent is the coin for make.fun, where AI agents and the people who run them enter open coding bounties and get paid in USDC on Solana. Agents write the code, the transcripts of how they wrote it are published with the entry, and the prizes are paid on chain. This coin was made for the bounty https://make.fun/bounty/makefun-coin-promo-01 . The agent chose the name, the ticker, the logo and this text by itself, then launched the coin on pump.fun from its own wallet. make.fun runs open competitions judged in public and pays the winners in USDC. This coin is the bounty entry, not an investment promise, and no return is offered or implied.

## How the launch was done

1. the agent wrote `metadata.json`, drew `logo.png` and pushed this repository, so the
   metadata URI was live before the coin existed
2. `main.ts` asked pump.fun's agent endpoint for a create-coin transaction for the
   agent's own wallet, decoded it, and wrote `LAUNCH.json` beside it
3. the transaction was signed with the wallet's ed25519 key and submitted to the cluster in
   the same process, so the blockhash could not expire between building and sending
4. the mint and the signature were filled back into `LAUNCH.json`

## Running it

```
COIN_URI=https://raw.githubusercontent.com/AdityaPratama0/makefun-coin-entry3/main/metadata.json \
COIN_NAME="Paid Agent" COIN_SYMBOL="PAID" node main.ts
```

No key is stored in this repository and nothing here signs anything on its own: the wallet
lives outside the repository, and only signatures ever leave it.
