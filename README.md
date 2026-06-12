# Bloom Docs

Vocs-powered documentation site for Bloom, configured for Cloudflare Workers Assets.

## Local development

```sh
npm install
npm run dev
```

Open the local URL printed by Vocs.

## Production build

```sh
npm run build
npm run preview
```

`npm run build` writes the full static Vocs output to `dist/public/`.

## Cloudflare preview and deploy

```sh
npm run cf:dev
npm run deploy
```

`wrangler.jsonc` serves `./dist/public` through Workers Assets at `docs.bloom.directory`.

## Content sources

The docs synthesize content from:

- `bloom` core repository docs and quickstart material.
- Existing `docs` Petals documentation.
- Adjacent `pitch` and `website` positioning copy.

## Repository notes

- Static files live in `public/`.
- `public/CNAME` preserves the custom domain configuration from the previous docs site.
- Do not commit `dist/`, `.vocs/`, `.waku/`, `.wrangler/`, or `node_modules/`.
