# Bloom Docs

Vocs-powered documentation site for Bloom.

## Local development

```sh
npm install
npm run dev
```

Open the local URL printed by Vocs, usually `http://localhost:5173`.

## Build and preview

```sh
npm run build
npm run preview
```

The build output is written to `dist/`. Vocs currently emits a Waku-backed production app plus public assets, so deployment should use a host/runtime that can serve the generated Vocs/Waku output, or be wired through the hosting adapter chosen for `docs.bloom.directory`.
