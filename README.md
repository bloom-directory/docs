# Bloom Docs

Vocs-powered documentation site for Bloom, configured for Cloudflare Pages.

## Local development

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
