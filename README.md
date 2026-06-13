<p align="center">
  <img src="public/bloom-mark.svg" alt="Bloom" width="96">
</p>

<h1 align="center">Bloom Docs</h1>

<p align="center">
  User-facing documentation for Bloom, the agentic Ethereum wallet mounted as a virtual filesystem.
</p>

<p align="center">
  <a href="https://github.com/bloom-directory/docs/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/bloom-directory/docs/ci.yml?branch=master&style=flat-square&label=ci"></a>
  <a href="https://docs.bloom.directory"><img alt="Live docs" src="https://img.shields.io/badge/docs-live-141310?style=flat-square"></a>
  <a href="https://bloom.directory"><img alt="Bloom website" src="https://img.shields.io/badge/bloom-directory-a8324c?style=flat-square"></a>
</p>

<p align="center">
  <a href="https://docs.bloom.directory"><strong>Read the docs</strong></a>
  ·
  <a href="https://docs.bloom.directory/getting-started/quickstart"><strong>Quickstart</strong></a>
  ·
  <a href="https://docs.bloom.directory/wallet/use-cases"><strong>Use cases</strong></a>
  ·
  <a href="https://bloom.directory/SKILL.md"><strong>Agent setup skill</strong></a>
</p>

Bloom turns Ethereum into a directory your agent can inspect and write to with ordinary filesystem tools. Reads are onchain queries, writes are staged wallet intents, and every meaningful action leaves reviewable files behind.

If you are here to use Bloom, start with the **[live docs](https://docs.bloom.directory)**. The docs cover setup, the mounted `/bloom` filesystem, wallet transaction review, policy controls, and power-user workflows that combine chain reads, encoding helpers, simulations, watches, and transaction staging.

## What you can do with Bloom

- Ask agents to query chain state without writing custom Web3 SDK glue.
- Read balances, blocks, gas, contract ABIs, method calls, events, ENS records, prices, and daemon status as files.
- Stage wallet actions by writing plain-language or structured intents, then inspect `plan.md` before confirmation.
- Pipe Bloom files through standard shell tools like `jq`, `awk`, `xargs`, `comm`, and `sort`.
- Use `/bloom/tools/` helpers for selectors, ABI/RLP/EIP-712 encoding, unit conversion, hashing, checksums, hex, and base64.
- Keep private keys out of the filesystem while still giving agents a safe, auditable operating surface.

Bloom is **experimental, unaudited alpha software**. Treat docs examples as workflows to adapt and review, not as production financial advice. Never use funds you cannot afford to lose.

## Useful links

- **Live docs:** https://docs.bloom.directory
- **Bloom website:** https://bloom.directory
- **Bloom runtime repo:** https://github.com/bloom-directory/bloom
- **Docs repo:** https://github.com/bloom-directory/docs
- **Agent setup skill:** https://bloom.directory/SKILL.md

## Local development

This repository is the Vocs-powered documentation site for Bloom, configured for Cloudflare Pages.

```sh
npm install
npm run dev
```

Open the local URL printed by Vocs.

## Production build

```sh
npm ci
npm run build
npm run preview
```

`npm run build` writes the static site to `dist/public`.

## Cloudflare Pages deployment

Use the existing Cloudflare Pages project for this repo.

Recommended Pages settings:

- Framework preset: `None` / custom
- Root directory: repository root
- Build command: `npm ci && npm run build`
- Build output directory: `dist/public`
- Node version: 22, or Cloudflare Pages' current LTS if 22 is unavailable

Pages will create preview deployments automatically for pull requests when the Pages project is connected to the GitHub repo and preview deployments are enabled.

## Content sources

The docs are seeded from:

- Bloom wallet/VFS source docs in `../bloom`
- Existing docs content from this repository
- Product framing from `../pitch`
- Public website copy from `../website`

Do not copy secrets, private keys, RPC credentials, or unpublished operational details into this public docs site.
